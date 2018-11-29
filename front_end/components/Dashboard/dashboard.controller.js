angular.module('savingsApp').controller("dashController",
    ['store', '$state', 'result', '$rootScope', 'paymentService', '$uibModal', '$document',
        function (store, $state, result, $rootScope, paymentService, $uibModal, $document) {

            var vm = this;
            vm.ready = false;
            saving = result;
            vm.savings = [];
            vm.fixed = [];
            vm.pending = [];
            vm.messages = [];

            vm.active = $rootScope.active;
            $rootScope.$on('$stateChangeSuccess', function () {
                vm.active = $rootScope.active;
            });
            
            vm.currentPage = 1;
            vm.pageSize = 5;

            if (saving.saves) {
                for (let index = 0; index < saving.saves.length; index++) {
                    let save = saving.saves[index];

                    if (save.plan == 'continuous' && save.amountPaidTillDate > 0) {
                        vm.savings.push(save);

                    } else if (save.plan == 'fixed' && save.paid == true) {
                        vm.savings.push(save);

                    } else {
                        vm.pending.push(save);
                    }

                }
                vm.length = vm.pending.length;
            }

            if (saving.counts) {
                vm.savesWeight = saving.counts.saveWeight / 1024;
                vm.savesUpTillDate = saving.counts.element.amount;
                vm.usersCount = saving.counts.userCount;
                vm.savingsCount = saving.counts.saveCount;
            }

            // vm.msg_length = vm.messages.length;

            vm.init = () => {
                if (!store.get('token')) $state.go('login');
            };

            let userId = store.get('userId');
            vm.name = store.get('user').user_name;
            vm.email = store.get('user').email;

            vm.payment = function (saveId, amount, amountPaidTillDate, parentSelector, size) {
                
                $rootScope.saving = {
                    saveId,
                    amount,
                    amountPaidTillDate
                }
                
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: './components/Payment/payment.html',
                    controller: 'paymentController',
                    controllerAs: 'vm',
                    size: size,
                    appendTo: parentElem
                });

                modalInstance.result.then(function (selectedItem) {
                    vm.selected = selectedItem;
                }, function () {});

            }

            vm.withdraw = (date, saveId) => {
                let nDate = 0;
                if (date) nDate = date;
                $state.go('dashboard.withdraw', {
                    date: nDate,
                    saveId: saveId
                });
            }

            vm.view = function (id, size, parentSelector) {
                store.set('saveId', id);
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: './components/Saving/Single/save.html',
                    controller: function (items, store, $state) {
                        vm = this;

                        vm.total = 0;
                        let token = store.get('user').token;
                        if (!token) $state.go('login');

                        vm.saves = items;
                        if (vm.saves) {
                            for (let index = 0; index < vm.saves.length; index++) {
                                const save = parseInt(vm.saves[index].amount);
                                vm.total += parseInt(save);
                            }
                        }
                    },
                    controllerAs: 'vm',
                    size: size,
                    appendTo: parentElem,
                    resolve: {
                        items: function (historyService, $state, store) {
                            let saveId = store.get('saveId');
                            let token = store.get('user').token;

                            if (!token) $state.go('login');

                            return historyService.getSave(saveId);
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    vm.selected = selectedItem;
                }, function () {});
            };
        }
    ]);