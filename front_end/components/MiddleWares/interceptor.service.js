(function () {
    'use strict';

    angular
        .module('savingsApp')
        .factory('interceptor', interceptor_service);

    interceptor_service.$inject = ['store'];

    function interceptor_service(store) {

        var interceptor = {

            request: function (config) {

                if (store.get('user')) {
                    var token = store.get('user').token;
                    if (!config.headers.Auth) {
                        config.headers['x-access-token'] = token;
                    } else {
                        delete config.headers["Auth"];
                    }
                }

                return config;
            },
            response: function (Response) {
                return Response;
            }
        };
        return interceptor;
    }
})();