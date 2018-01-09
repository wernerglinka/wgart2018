/* eslint capitalized-comments: "always" */

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var browserSync = require('browser-sync').create();


var Metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var assets = require('metalsmith-assets');
var sitemap = require('metalsmith-sitemap');
var robots = require('metalsmith-robots');
var htmlMinifier = require('metalsmith-html-minifier');
var metadata = require('metalsmith-metadata');
var writemetadata = require('metalsmith-writemetadata');
var ignore = require('metalsmith-ignore');

// path variables
var root = "./";
var contentPath = "./dev/content";
var assetPath = "./dev/sources";
var scriptPath = "./dev/scripts";
var stylePath = "./dev/styles";
var partialsPath = "./dev/partials";
var destPath = "./publish";

// assets
var sequence = require('gulp-sequence');
var order = require('gulp-order');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var compressJS = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

// template engine
var nunjucks = require('nunjucks');
var CaptureTag = require('nunjucks-capture');
var dateFilter = require('nunjucks-date-filter');

nunjucks
    .configure(['./dev/content','./dev/partials'], {watch: false, autoescape:false})
    .addExtension('CaptureTag', new CaptureTag())
    .addFilter('is_string', function(obj) {
      return typeof obj == 'string';
    })
    .addFilter('is_array', function(obj) {
      return Array.isArray(obj);
    })
    .addFilter('date', dateFilter)
    // replaces a file extension with a "/". Needed in generating custom XML feeds
    .addFilter('makePermalink', function(obj) {
      return obj.replace(/.md/g , '/');
    })
    // converts a date into a UTC string. Needed for XML dates
    .addFilter('UTCdate', function (date) {
      return date.toUTCString();
    })
    // when building an XML page any text that contains html "<", ">" and "&" characters need to be escaped
    .addFilter('escapeHTML', function (text) {
      return ( text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    })
    // strips all html from a string
    .addFilter('stripHTML', function (htmlString) {
      return htmlString.replace(/<[^>]+>/g, '');
    })
    .addFilter('spaceToDash', function (string) {
      return string.replace(/\s+/g, "-");
    });

// metalsmith
function setupMetalsmith(callback) {

    Metalsmith(process.cwd())
        .source(contentPath)
        .destination(destPath)
        .clean(true)

        .use(inPlace({
            "engine": "nunjucks",
            "directory": contentPath,
            "partials": partialsPath
        }))

        .use(assets({
            "source": assetPath,
            "destination": root
        }))

        .use(robots({
            "useragent": "googlebot",
            "allow": "index.html",
            "disallow": "404.html",
            "sitemap": "http://www.sitename.com/sitemap.xml"
        }))

//        .use(writemetadata({
//          pattern: ['**/*.html'],
//          ignorekeys: ['next', 'contents', 'previous'],
//          bufferencoding: 'utf8'
//        }))

        .build(function(err) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            callback();
        });
}

//Gulp tasks
gulp.task('metalsmith', function(callback) {
    setupMetalsmith(callback);
});

gulp.task('vendorScripts', function() {
    return gulp.src([
            "node_modules/jquery/dist/jquery.js",
            "node_modules/jquery.easing/jquery.easing.js",
            "node_modules/jquery-hoverintent/jquery.hoverIntent.js",
            "node_modules/js-breakpoints/breakpoints.js"
        ])
        .pipe(concat('vendors.min.js'))
        .pipe(compressJS())
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')))
});

var jsOrder = [
          path.join(__dirname, scriptPath, 'ready.js'),
          path.join(__dirname, scriptPath, 'modules/touchClick.js'),
          path.join(__dirname, scriptPath, 'modules/externalLinks.js'),
          path.join(__dirname, scriptPath, 'modules/mobileMenu.js'),
          path.join(__dirname, scriptPath, 'modules/scrollHomeNav.js'),
          path.join(__dirname, scriptPath, 'modules/mainNav.js'),
          path.join(__dirname, scriptPath, 'modules/scrollToTop.js')
        ];


gulp.task('scripts', function () {
    return gulp.src(path.join(__dirname, scriptPath, '**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(order(jsOrder))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile style sheet for development
gulp.task('styles', function() {
    return gulp.src(path.join(__dirname, stylePath, 'main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});

gulp.task('buildDev', function (cb) {
  sequence([
    'vendorScripts',
    'scripts',
    'styles'
    ],
    'metalsmith',
    cb
  )
});

// having buildDev as a dependency for the refresh task insures that they are executed before browerSync is run
// reference: browsersync.io/docs/gulp
gulp.task('refresh', ['buildDev'], function (done) {
  browserSync.reload();
  done();
})

gulp.task('default', ['buildDev'], function () {

  browserSync.init({
    server: {
      baseDir: "publish"
    },
    open: false
  });

  gulp.watch([
    path.join(__dirname, scriptPath, '**/*'),
    path.join(__dirname, stylePath, '**/*'),
    path.join(__dirname, contentPath, '**/*'),
    path.join(__dirname, partialsPath, '**/*'),
    path.join(__dirname, assetPath, '**/*')
  ], ['refresh']);

  console.log(path.join(__dirname, contentPath, '**/*'));


});

gulp.task('buildProd', function (cb) {
  sequence([
    'vendorScripts',
    'productionScripts',
    'productionStyles'
    ],
    'metalsmith',
    cb
  )
});

gulp.task('productionScripts', function () {
    return gulp.src(path.join(__dirname, scriptPath, '**/*.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(order([
          path.join(__dirname, scriptPath, 'ready.js'),
          path.join(__dirname, scriptPath, 'modules/touchClick.js'),
          path.join(__dirname, scriptPath, 'modules/externalLinks.js'),
          path.join(__dirname, scriptPath, 'modules/mobileMenu.js'),
          path.join(__dirname, scriptPath, 'modules/scrollHomeNav.js'),
          path.join(__dirname, scriptPath, 'modules/scrollNav.js'),
          path.join(__dirname, scriptPath, 'modules/scrollToTop.js')
        ]))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile style sheet for development
gulp.task('productionStyles', function() {
    return gulp.src(path.join(__dirname, stylePath, 'main.scss'))
        .pipe(sass({style: 'compressed'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});
