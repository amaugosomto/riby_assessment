angular.module('savingsApp').controller('reportsController',
    ['result', '$mdDialog', 'reportsService', 'store', '$state',  '$uibModal', '$log', '$document',
    function (result, $mdDialog, reportsService, store, $state, $uibModal, $log, $document) {
        var vm = this;

        vm.reports = result;
        vm.total = 0;
        vm.currentPage = 1;
        vm.pageSize = 10;

        if (vm.reports) {
            // vm.userName = store.get('userDetails').userName;
            (!store.get('userName')) ? '' : vm.userName = store.get('userName');
            if (vm.reports.mode == 'savings') {
                for (let index = 0; index < vm.reports.length; index++) {

                    if (vm.reports[index].amountPaidTillDate >= 0) {
                        let save = parseInt(vm.reports[index].amountPaidTillDate);
                        vm.total += parseInt(save);
                    } else {
                        let save = parseInt(vm.reports[index].amount);
                        vm.total += parseInt(save);
                    }
                }
            }
        }

        vm.user = function ($event, userId) {
            store.set('userId', userId);

            $mdDialog.show({
                controller: userCtrl,
                controllerAs: 'vm',
                templateUrl: './components/Admin/userEdit.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true
            });
        };

        vm.save = (userName, userId, parentSelector, size) => {
            let userDetails = {
                userId,
                userName
            }
            store.set('userDetails', userDetails);
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: './components/Admin/userSavings.html',
                controller: function (items, store) {
                    vm = this;
                    vm.reports = items;
                    vm.userName = store.get('userDetails').userName;
                },
                controllerAs: 'vm',
                size: size,
                appendTo: parentElem,
                resolve: {
                    items: function (dashBoardService, $state, store) {
                        let token = store.get('user').token;
                        if (!token) $state.go('login');

                        let userId = store.get('userDetails').userId;
                        return dashBoardService.getSaves(userId);
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.selected = selectedItem;
            }, function () {});
            // $state.go('dashboard.reports.users.saving', {
            //     userId
            // });
        }

        function userCtrl($timeout, $q, $scope, $mdDialog) {
            var self = this;

            self.options = 'disabled user admin'.split(' ').map((option) => {
                return {
                    option
                };
            });

            self.change = () => {
                let user = store.get('userId');
                // do a check to be sure he is not being reassigned a role he already has.
                reportsService.change(user, self.state);
            }

            self.cancel = function ($event) {
                $mdDialog.cancel();
            };
            self.finish = function ($event) {
                $mdDialog.hide();
            };
        }

    }])