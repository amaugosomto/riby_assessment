(function () {
    'use strict';

    angular
        .module('savingsApp')
        .service('Auth', auth_service);

    auth_service.$inject = ['$rootScope', 'store'];

    function auth_service($rootScope, store) {

        var auth = {};

        auth.init = () => {
            if (auth.isLoggedIn()) {
                $rootScope.user = auth.currentUser();
            }
        };

        auth.currentUser = () => {
            return store.get('user');
        }

        auth.isLoggedIn = () => {
            return store.get('user') != null;
        }

        auth.checkPermisiionForView = (view) => {
            if (!view.requiresAutentication) {
                return true;
            }

            return auth.userHasPermissionForView(view);
        }

        auth.userHasPermissionForView = (view) => {
            
            if (!auth.isLoggedIn()) return false;
            if (!view.permissions || !view.permissions.length) return true;

            return auth.userHasPermission(view.permissions);
        }

        auth.userHasPermission = (permissions) => {
            if (!auth.isLoggedIn()) return false;

            var found = false;
            angular.forEach(permissions, function (permissions, index) {
                if (store.get('user').user_permission.indexOf(permissions) >= 0) {
                    found = true;
                    return;
                }
            });
            return found;
        }

        return auth;
    }
})();