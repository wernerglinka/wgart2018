"use strict";

/*eslint no-unused-vars: 0*/

// function to add "target='_blank'" to all external links
var externalLinks = function ($, undefined) {
    "use strict";

    var allExternalLinks = $('a[href^="http://"], a[href^="https://"]');
    var init = function init() {
        allExternalLinks.each(function () {
            var thisExternalLink = $(this);
            thisExternalLink.attr("target", "_blank");
        });
    };
    return {
        init: init
    };
}(jQuery);
'use strict';

/*eslint no-unused-vars: false*/
/*global jQuery */

var mainNav = function ($) {

    "use strict";

    var menuLinks = $('.main-menu').find('a');

    var init = function init() {
        var thisMenuLayer = $(".main-navigation");

        // add event handler to all menu links
        menuLinks.on('touchclick', function () {
            var thisLink = $(this);
            var linkTarget = thisLink.attr('href');

            // hide the main nav
            $('body').removeClass('navActive');
            thisMenuLayer.hide();

            // get the vertical position of the linkTarget
            var position = $(linkTarget).offset().top;
            $('html, body').animate({
                scrollTop: position - 110
            }, 500);
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/
/*global jQuery */

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = function ($, undefined) {

    "use strict";

    var init = function init() {

        var thisPage = $("body");
        var hamburger = $(".hamburger");
        var topMessage = $(".top-message");
        var thisMenuLayer = $(".main-navigation");
        var thisMenu = $(".main-menu");
        var mobileScreenWidth = 768;

        hamburger.on("touchclick", function (event) {

            if (thisPage.hasClass("navActive")) {
                if (topMessage) {
                    topMessage.slideDown();
                }
                thisPage.removeClass("navActive");
                thisMenuLayer.fadeOut();
                thisMenu.css("margin-top", "60px");
            } else {
                if (topMessage) {
                    topMessage.slideUp();
                }
                thisPage.toggleClass("navActive");
                thisMenuLayer.fadeIn();
                thisMenu.css("margin-top", "40px");
            }
        });

        $(window).resize(function () {
            if ($(window).width() > mobileScreenWidth) {
                thisPage.removeClass("navActive");
            }
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to make the main nav fixed to top on home page when page is scrolled up
var scrollHomeNav = function ($, undefined) {
    "use strict";

    var hasTopMessage = $(".top-message").length;
    var TopMessageHeight = $(".top-message").height();
    var thisHeader = $("header");

    var init = function init() {
        if (hasTopMessage) {
            $(window).scroll(function () {
                var thisWindow = $(this);
                if (thisWindow.scrollTop() >= TopMessageHeight && !thisHeader.hasClass("isFixed")) {
                    thisHeader.addClass("isFixed");
                }
                if ($(this).scrollTop() < TopMessageHeight && thisHeader.hasClass("isFixed")) {
                    thisHeader.removeClass("isFixed");
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

// the scroll to top function for long pages
var scrollToTop = function ($, undefined) {

    var hasToTop = $("#toTop").length;
    var toTop = $("#toTop");
    var TO_TOP_VISIBLE = 400;

    var init = function init() {
        if (hasToTop) {
            toTop.on("touchclick", function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 500, "easeOutCubic");
                return false;
            });
            // hide scroll icon if content is at top already
            // normally we would check for $(window).scrollTop() but IE8 always return 0, what else is new
            if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                $("#toTop").hide();
            }
            // update scroll icon if window is resized
            $(window).resize(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").hide();
                }
            });
            // manage scroll icon when scrolling
            $(window).scroll(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").fadeOut(400);
                } else {
                    $("#toTop").fadeIn(400);
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

// function to extend jQuery event >> touchclick for touch and click
var touchClick = function ($, undefined) {

    'use strict';

    var init = function init() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/
/* global jQuery, window, touchClick, hoverMenu, mobileMenu, externalLinks,
   scrollHomeNav, scrollToTop, mainNav, OP_MESSAGE_HEIGHT */

(function ($) {

    "use strict";

    //the document ready function

    $(function () {

        touchClick.init();
        mobileMenu.init();
        externalLinks.init();
        scrollHomeNav.init();
        scrollToTop.init();
        mainNav.init();
    });
    // end ready function
})(jQuery);
//# sourceMappingURL=main.js.map
