angular.module('savingsApp').service('profileService',
    ['$http', '$rootScope', 'defualts', 'store', '$mdToast',
        function ($http, $rootScope, defualts, store, $mdToast) {

            this.getUser = async (userId) => {
                this.savings = {};
                let url = defualts.user_backend + `/view/${userId}`;


                await $http.get(url).then((Response) => {
                    if (Response.data.status) {
                        this.savings = Response.data.payload;
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, (error) => {
                    $rootScope.$emit('stateChangeError');
                    console.log(error);
                    defualts.toast($mdToast, store, 'An error occurred');
                });

                return this.savings;
            }
        }
    ])