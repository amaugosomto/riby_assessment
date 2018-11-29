angular.module('savingsApp').controller('withdrawController',
    ['$state', 'withdrawService', 'store', 'result', function ($state, withdrawService, store, result) {

        var vm = this;
        let date = $state.params.date;
        let saveId = $state.params.saveId;

        vm.condition = false;
        if (parseInt(date) / 1000 >= new Date() / 1000) {
            vm.condition = true;
        }

        user = result;
        if(user.bank_name) {
            vm.accStat = true;
        } else { vm.accStat = false; }

        vm.name = store.get('name');
        vm.email = store.get('email');

        vm.withdraw = async () => {
            if (vm.condition) {
                let status = {id: saveId, early: true, account: vm.account};
                withdrawService.withdraw(status);

            } else {
                let status = {id: saveId}
                withdrawService.withdraw(status);
            }
        }
    }]);