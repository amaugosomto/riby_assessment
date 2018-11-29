angular.module('savingsApp').controller('pendingController',
    ['result', '$state', 'paymentService', '$rootScope', '$uibModal', '$document',
        function (result, $state, paymentService, $rootScope, $uibModal, $document) {

            vm = this;

            savings = result;
            vm.pending = [];

            for (let index = 0; index < savings.saves.length; index++) {
                const pending = savings.saves[index];

                if (!pending.paid || pending.amountPaidTillDate <= 0) {
                    vm.pending.push(pending);
                }
            }

            vm.payment = (saveId, amount, plan,  parentSelector, size) => {
                if (plan == 'fixed'){
                    paymentService.payWithRave(amount, saveId);
                } else {

                    $rootScope.saving = {
                        saveId,
                        amount,
                        plan
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
            }
        }
    ]);