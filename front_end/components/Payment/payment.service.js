angular.module('savingsApp').service('paymentService',
    ['$http', '$state', '$rootScope', 'defualts', 'store', '$mdToast',
        function ($http, $state, $rootScope, defualts, store, $mdToast) {

            this.payWithRave = (amount, saveId) => {
                let email = store.get('user').email;
                let phoneNumber = store.get('user').phoneNumber;

                const API_publicKey = "FLWPUBK-da9242d26d2c615b628f86d4f9fd8e37-X";

                if (amount > 500000) {
                    txref = "rave-123456";
                    this.payment(amount, saveId);
                    return;
                }

                var x = getpaidSetup({
                    PBFPubKey: API_publicKey,
                    customer_email: email,
                    amount: amount,
                    customer_phone: phoneNumber,
                    currency: "NGN",
                    payment_method: "both",
                    txref: "rave-123456",
                    meta: [{
                        metaname: "flightID",
                        metavalue: "AP1234"
                    }],
                    onclose: function () {},
                    callback: function (response) {
                        var txref = response.tx.txRef; // collect txRef returned and pass to a server page to complete status check.
                        if (
                            response.tx.chargeResponseCode == "00" ||
                            response.tx.chargeResponseCode == "0"
                        ) {
                            let details = {
                                id: saveId,
                                amount: amount
                            }
                            pay(details);
                        } else {
                            defualts.toast($mdToast, store, 'An error occurred, please repay');
                            // redirect to error page
                        }

                        x.close();
                    }
                });
                // this.payment(100, 22)

            };

            this.payment = (amount, saveId) => {
                let savesDetail = {
                    id: saveId,
                    amount: amount
                }
                pay(savesDetail);
            }

            var pay = async (savesDetail) => {
                let url = defualts.save_backend + '/payment';

                await $http.put(url, savesDetail).then((Response) => {


                    if (Response.data.status) {
                        defualts.toast($mdToast, store, Response.data.message);
                        $state.reload('dashboard').then(() => {
                            $state.go('dashboard');
                        });
                    } else {
                        defualts.toast($mdToast, store, Response.data.message)
                    }
                }, () => {
                    $rootScope.$emit('stateChangeError');
                    defualts.toast($mdToast, store, 'An error occurred');
                });
            }
        }
    ]);