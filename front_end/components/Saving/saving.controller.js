angular.module('savingsApp').controller('saveController',
    ['$state', 'saveService', 'store', 'moment',
        function ($state, saveService, store, moment) {

            var vm = this;

            vm.name = store.get('name');
            vm.email = store.get('email');
            vm.state = $state.params.state;
            vm.option = $state.params.option;

            switch (vm.option) {
                case 'jumbo':
                    numMaxDate = 30; // 2 Years, 6 months.
                    numMinDate = 12; // 1 Year.
                    maxInterest = 6;
                    minInterest = 4;
                    vm.minAmount = 200000;
                    vm.maxAmount = 500000;
                    break;
                case 'premium':
                    numMaxDate = 24; // 2 Years
                    numMinDate = 8; // 8 Months
                    maxInterest = 5;
                    minInterest = 3;
                    vm.minAmount = 150000;
                    vm.maxAmount = 375000;
                    break;
                case 'personal':
                    numMaxDate = 12; // 1 Year
                    numMinDate = 5; // 5 Months
                    maxInterest = 3;
                    minInterest = 2;
                    vm.minAmount = 50000;
                    vm.maxAmount = 125000;
                    break;
                case 'family':
                    numMaxDate = 18; // 1 Year, 6 Months
                    numMinDate = 6; // 6 Months
                    maxInterest = 4;
                    minInterest = 2;
                    vm.minAmount = 100000;
                    vm.maxAmount = 250000;
                    break;
                case 'entrepreneur':
                    numMaxDate = 84; // 7 years
                    numMinDate = 36; // 3 Years
                    maxInterest = 11;
                    minInterest = 9;
                    vm.minAmount = 1000000;
                    vm.maxAmount = 1500000;
                    break;
                case 'enterprise':
                    numMaxDate = 84; // 7 years
                    numMinDate = 48; // 4 Years
                    maxInterest = 13;
                    minInterest = 11;
                    vm.minAmount = 1500000;
                    vm.maxAmount = 2000000;
                    break;
                case 'standard':
                    numMaxDate = 84; // 7 years
                    numMinDate = 24; // 2 Years
                    maxInterest = 9;
                    minInterest = 7;
                    vm.minAmount = 500000;
                    vm.maxAmount = 1000000;
                    break;
                case 'starter':
                    numMaxDate = 60;
                    numMinDate = 12; // 1 Year
                    maxInterest = 7;
                    minInterest = 5;
                    vm.minAmount = 100000;
                    vm.maxAmount = 500000;
                    break;

                default:
                    break;
            }

            if (vm.option) {
                date = new Date();
                vm.minDate = new Date(
                    date.getFullYear(),
                    date.getMonth() + numMinDate,
                    date.getDate() + 1
                );
                vm.maxDate = new Date(
                    date.getFullYear(),
                    date.getMonth() + numMaxDate,
                    date.getDate() + 1
                );
            }


            let userId = store.get('user').userId;
            vm.activated = false;

            vm.startSave = async (options) => {
                vm.activated = true;
                vm.save.option = vm.option;
                vm.save.minInterest = minInterest;
                vm.save.maxInterest = maxInterest;
                vm.save.txRef = options;
                vm.save.minDate = numMinDate;

                saveDate = moment(vm.duration);
                date = moment(new Date());
                vm.save.duration = saveDate.diff(date, 'months');

                vm.save.email = store.get('user').email;
                vm.save.phoneNumber = store.get('user').phoneNumber;

                let status = await saveService.startSavings(vm.save, userId);
                if (!status) vm.activated = false;
            };

            vm.changeRoute = (state) => {
                if (state == 'continuous' || state == 'fixed') {
                    $state.go('dashboard.saving.saveOption', {
                        state
                    });
                } else {
                    let option = state;
                    $state.go('dashboard.saving.saveOption.save', {
                        option
                    });
                }
            }
        }
    ]);