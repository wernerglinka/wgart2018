/*eslint no-unused-vars: 0*/
/*global jQuery */

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = (function ($, undefined) {

    "use strict";

    let init = function () {

        const thisPage = $("body");
        const hamburger = $(".hamburger");
        const topMessage = $(".top-message");
        const thisMenuLayer = $(".main-navigation");
        const thisMenu = $(".main-menu");
        const mobileScreenWidth = 768;

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

})(jQuery);