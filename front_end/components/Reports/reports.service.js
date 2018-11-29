angular.module('savingsApp').service('reportsService',
    ['$http', '$mdDialog', '$state', '$rootScope', 'defualts', 'store', '$mdToast',
        function ($http, $mdDialog, $state, $rootScope, defualts, store, $mdToast) {

            this.getSavings = async () => {
                let url = defualts.save_backend + '/views';
                this.savings = {};

                await $http.get(url).then((Response) => {
                    if (Response.data.status) {
                        this.savings = Response.data.payload;
                        this.savings.mode = 'savings';
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });
                return this.savings;
            }

            this.getUsers = async () => {
                let url = defualts.user_backend + '/view';
                this.users = {};

                await $http.get(url).then((Response) => {
                    if (Response.data.status) {
                        this.users = Response.data.payload;
                        this.users.mode = 'users';
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store,'An error occurred');
                });
                return this.users;
            }

            this.change = async (user, state) => {
                let url = defualts.user_backend + '/edit';

                let userDetails = {
                    user,
                    state
                };

                await $http.put(url, userDetails).then((Response) => {
                    if (Response.data.status) {
                        $mdDialog.hide();
                        $state.reload('dashboard.reports.users').then(() => {
                            $state.go('dashboard.reports.users');
                        });
                        // alert('success');
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                })
            }

        }
    ]);