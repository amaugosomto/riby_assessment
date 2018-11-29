angular.module('savingsApp').controller('accountController',
    ['accountService', '$document', function (accountService) {
        var vm = this;
        vm.banks = {
            1: 'Access Bank',
            2: 'Sterling Bank'
        }

        vm.clicked = false;
        vm.save = () => {
            vm.clicked = true;
            accountService.saveAccount(vm.account);
        }
    }]);