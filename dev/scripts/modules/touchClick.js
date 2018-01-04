/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var touchClick = (function ($, undefined) {
    "use strict";
    let init = function () {
        let isMobile = false;
        if ($("html").hasClass("touch")) {
            isMobile = true;
        }
        //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        let eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return  {
        init: init
    };
})(jQuery);