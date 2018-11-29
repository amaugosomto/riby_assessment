angular.module('savingsApp').factory("registerService",
    ['$http', '$state', '$rootScope', 'defualts', 'store', '$mdToast',
        ($http, $state, $rootScope, defualts, store, $mdToast) => {
            let fac = {};
            
            let url = defualts.user_backend + '/register';
            fac.register = (user) => {
                $http.post(url, user).then((Response) => {

                    if (Response.data.status) {
                        defualts.toast($mdToast, store, Response.data.message);
                        $state.go('login');
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });
            }
            return fac;
        }
    ]);