/* global jQuery, window, touchClick, hoverMenu, mobileMenu, youTubeVideos, lineNumbers, externalLinks,
   modifyMarketoForm, scrollHomeNav, smallImage, bannerBackground, scrollToTop, confirmLeave, modalVideos, OP_MESSAGE_HEIGHT */
/*eslint no-unused-vars: 0*/

// custom event for api loaded
let videoAPIReady = new Event('videoAPIReady');

// load the youTube video JS api
// https://developers.google.com/youtube/iframe_api_reference
// this code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady () {

    window.dispatchEvent(videoAPIReady);

}


(function () {

    //the document ready function
    $(function () {

        touchClick.init();
        hoverMenu.init();
        mobileMenu.init();
        youTubeVideos.init();
        lineNumbers.init();
        externalLinks.init();
        modifyMarketoForm.init();
        scrollHomeNav.init();
        smallImage.init();
        bannerBackground.init();
        scrollToTop.init();
        confirmLeave.init();
        modalVideos.init();
    
});
    // end ready function

}());