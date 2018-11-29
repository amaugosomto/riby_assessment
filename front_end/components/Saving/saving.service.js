angular.module('savingsApp').factory('saveService',
    ['$http', '$state', '$rootScope', 'defualts', 'store', '$mdToast',
        function ($http, $state, $rootScope, defualts, store, $mdToast) {

            let fac = {};

            let url = defualts.save_backend + '/request';

            fac.startSavings = (save, userId) => {

                var details;
                let sSave = save;
                sSave.userId = userId;
                $http.post(url, sSave).then((Response) => {

                    if (Response.data.status) {
                        details = true;
                        defualts.toast($mdToast, store, Response.data.message);
                        $state.reload('dashboard').then(()=> {
                            $state.go('dashboard');
                        })
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });
                return details;
            }

            return fac;
        }
    ]);