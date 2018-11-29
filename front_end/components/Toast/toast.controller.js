angular.module('savingsApp').controller('toastController', ['$mdToast','store', toast]);

function toast($mdToast, store) {
    var vm = this;
    var isDlgOpen;

    vm.message = store.get('message');

    vm.closeToast = function () {
        if (isDlgOpen) return;

        $mdToast.hide().then(function () {
            isDlgOpen = false;
        });
        store.remove('message');
    };

    store.remove('message')
}