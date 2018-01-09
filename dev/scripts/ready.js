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

}(jQuery));