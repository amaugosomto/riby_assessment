angular.module('savingsApp').controller('adminController', ['result','store','$state', function(result, store, $state) {
    vm = this;

    vm.reports = result;
    vm.userName = store.get('userDetails').userName;
}]);