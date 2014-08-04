var Storage = function() {
    'use strict';

    var credentials = [];
    var listener_callbacks = [];
    var storage = chrome.storage;
    var sync = storage.sync;

    var variable_name = 'credentials';

    function getCredentials() {
        sync.get(variable_name, function (result) {
            if (result.hasOwnProperty(variable_name)) {
                credentials = result.credentials;

                for (var key in listener_callbacks) {
                    if (listener_callbacks.hasOwnProperty(key)) {
                        listener_callbacks[key](credentials);
                    }
                }
            }
        });
    }

    function setCredentials() {
        var data = {};
        data[variable_name] = credentials;
        sync.set(data);
    }

    function addCredential(credential) {
        credentials.push(credential);
        setCredentials();

        return credential;
    }

    function removeCredential(index) {
        var credential = credentials.splice(index, 1);
        setCredentials();

        return credential;
    }

    function getForUrl(url) {
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var re = new RegExp(credentials[key].url);
                if (re.test(url)) {
                    console.log('found');
                    return credentials[key];
                }
            }
        }

        return {};
    }

    function addListener(callback) {
        if (typeof(callback) !== 'undefined') {
            listener_callbacks.push(callback);
        }

        storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'sync' && changes.hasOwnProperty(variable_name)) {
                credentials = changes[variable_name].newValue;

                if(typeof(callback) !== 'undefined') {
                    callback(credentials);
                }
            }
        });
    }

    // retrieve the credentials from sync
    getCredentials();

    return {
        'addListener': addListener,
        'removeCredential': removeCredential,
        'addCredential': addCredential,
        'getForUrl': getForUrl
    }
}();