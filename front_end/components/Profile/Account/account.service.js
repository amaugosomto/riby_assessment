angular.module('savingsApp').factory('accountService',
    ['$http', '$state', 'store', 'defualts', '$mdToast',
        function ($http, $state, store, defualts, $mdToast) {

            let fac = {};

            fac.saveAccount = (account) => {
                let id = store.get('userId');
                let url = defualts.user_backend + '/edit';
                let seckey = 'FLWSECK-90380016e6e137cc95c08696e1ccff89-X';
                let flutUrl = 'https://ravesandboxapi.flutterwave.com/v2/gpx/transfers/beneficiaries/create';

                account.seckey = seckey;
                if (account.bank == 'Access Bank') account.account_bank = '044';
                if (account.bank == 'Sterling Bank') account.account_bank = '232';

                delete account["bank"];

                var req = {
                    method: "POST",
                    url: flutUrl,
                    headers: {
                        'Auth': 'no'
                    },
                    data: account
                }

                $http(req).then((Response) => {

                    if (Response.data.status == 'success') {

                        account.account_name = Response.data.data.fullname;
                        account.bank_name = Response.data.data.bank_name;
                        delete account['seckey'];
                        account.user = store.get('user').userId;

                        $http.put(url, account).then((Response) => {

                            if (Response.data.status) {
                                defualts.toast($mdToast, store, Response.data.status)
                                $state.reload('dashboard.profile').then(() => {
                                    $state.go('dashboard.profile');
                                });
                            } else {
                                defualts.toast($mdToast, store, Response.data.status)
                            }
                        }, () => {
                            defualts.toast($mdToast, store, 'An Error occured, Please Contact the Admin and dont create a new account');
                            $state.go('dashboard.profile');
                        });
                    }

                }, () => {
                    defualts.toast($mdToast, store, 'An Error occured, Please retry')
                });
            }

            fac.upload = (file) => {

                if (file) {
                    let fd = new FormData();
                    let url = defualts.user_backend + '/upload';
                    fd.append('myFile', file.upload);

                    let status = false;

                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function (response) {
                        if (response.data.status) {
                            alert(response.data.payload);
                            // defualts.toast($mdToast, store, response.data.message);
                            // status = true;
                        } else {
                            alert(response.data.payload);
                            defualts.toast($mdToast, store, response.data.message);
                        }
                    }, () => {
                        defualts.toast($mdToast, store, 'An Error occured, Please Contact the Admin');
                        $state.go('dashboard.profile');
                    });
                } else {
                    defualts.toast($mdToast, store, 'Please select a file');
                }


            }

            return fac;
        }
    ]);