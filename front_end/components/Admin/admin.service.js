angular.module('savingsApp').service('adminService',
    ['$http', '$rootScope', '$mdToast', 'store', 'defualts',
        function ($http, $rootScope, $mdToast, store, defualts) {

            this.editPermission = (userId) => {
                let url = defualts.user_backend + '/update';

                $http.put(url, userId).then((Response) => {
                    if (Response.data.status) {
                        defualts.toast($mdToast, store, Response.data.status);
                    } else {
                        defualts.toast($mdToast, store, Response.data.status);
                    }
                }, (err) => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                })
            }

            this.getUserSaving = () => {

            }
        }
    ]);