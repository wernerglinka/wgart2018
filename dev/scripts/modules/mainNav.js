/*eslint no-unused-vars: false*/
/*global jQuery */

var mainNav = (function ($) {

    "use strict";

    const menuLinks = $('.main-menu').find('a');

    let init = function () {
        const thisMenuLayer = $(".main-navigation");

        // add event handler to all menu links
        menuLinks.on('touchclick', function () {
            const thisLink = $(this);
            const linkTarget = thisLink.attr('href');

            // hide the main nav
            $('body').removeClass('navActive');
            thisMenuLayer.hide();

            // get the vertical position of the linkTarget
            let position = $(linkTarget).offset().top;
            $('html, body').animate({
                scrollTop: position - 110
                }, 500);
        });
    };

    return {
        init: init
    };
})(jQuery);