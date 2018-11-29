angular.module('savingsApp').service('dashBoardService',
    ['$http', '$rootScope', 'defualts', 'store', '$mdToast',
        function ($http, $rootScope, defualts, store, $mdToast) {

            this.savingsDetails = {
                dateElapse: 0
            };

            this.getSaves = async (userId) => {
                this.savings = {};
                let url = defualts.save_backend + `/views/${userId}`;

                await $http.get(url).then((Response) => {
                    if (Response.data.status) {
                        this.savings = Response.data.payload;
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, (error) => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });

                return this.savings;
            }

            this.getCount = async () => {
                this.counts = {};
                let url = defualts.user_backend + '/number';

                await $http.get(url).then((Response) => {
                    if (Response.data.status) {
                        this.counts = Response.data.payload;
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, (error) => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });

                return this.counts;
            }
        }
    ]);