angular.module('savingsApp').factory("loginService",
    ['$http', 'store', '$state', 'moment', '$rootScope', 'defualts', '$mdToast',
        function ($http, store, $state, moment, $rootScope, defualts, $mdToast) {
            let fac = {};

            let url = defualts.user_backend + '/login';

            fac.login = (user) => {

                var details;
                $http.post(url, user).then(function (Response) {
                    // details = Response.data;

                    if (Response.data.status) {
                        var user = {
                            user_permission: [Response.data.payload.user_details.permission],
                            userId: Response.data.payload.user_details._id,
                            email: Response.data.payload.user_details.email,
                            phoneNumber: Response.data.payload.user_details.phoneNumber,
                            token: Response.data.payload.token
                        }

                        if (Response.data.payload.user_details.first_name) {
                            user.user_name = Response.data.payload.user_details.first_name + ' ' + Response.data.payload.user_details.last_name;
                        } else {
                            user.user_name = Response.data.payload.user_details.name;
                        }

                        let now = moment().hour();
                        store.set('user', user);
                        store.set('time', moment().hour(1 + now));

                        details = true;
                        defualts.toast($mdToast, store, Response.data.message);
                        $state.go('dashboard');
                    } else {
                        defualts.toast($mdToast, store, Response.data.message);
                    }
                }, () => {
                    defualts.toast($mdToast, store, 'An error occured');
                    $rootScope.$emit('stateChangeError');
                });
                return details;
            }
            return fac;
        }
    ]);