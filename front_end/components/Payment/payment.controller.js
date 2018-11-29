angular.module('savingsApp').controller('paymentController',
    ['$state', 'paymentService', '$rootScope', '$uibModalInstance', function ($state, paymentService, $rootScope, $uibModalInstance) {

        var vm = this;

        let saving = $rootScope.saving
        let saveId = saving.saveId;
        (saving.amountPaidTillDate)? vm.amount = saving.amount - saving.amountPaidTillDate: vm.amount = saving.amount;
        let plan = saving.plan;
        vm.plan = (plan == 'fixed')? 'fixed': null; 

        vm.payment = () => {
            if (vm.plan){
                paymentService.payment(vm.pay.amount, saveId);
                $uibModalInstance.dismiss('cancel');
            } else {
                paymentService.payWithRave(vm.pay.amount, saveId);
                $uibModalInstance.dismiss('cancel');
            } 
        }
    }]);