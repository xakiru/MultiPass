var Analytics = function() {
    'use strict';

    var ga;

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-1168006-9']);
    _gaq.push(['_trackPageview']);

    function init() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    }

    return {
        'init': init,
        'event': function(event, action) {
            _gaq.push(['_trackEvent', event, action]);
        }
    }
}();

Analytics.init();