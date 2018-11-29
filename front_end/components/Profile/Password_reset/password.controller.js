angular.module('savingsApp').controller('reset_controller', 
['defualts', '$mdToast', 'store', '$http', '$state',
function (defualts, $mdToast, store, $http, $state) {
    vm = this;
    vm.activated = false;

    vm.reset = () => {
        vm.activated = true;
        let token = $state.params.token;
        let url = defualts.user_backend + `/reset_password/${token}`;

        $http.put(url, vm.user).then((Response) => {
            if (Response.data.status) {
                defualts.toast($mdToast, store, Response.data.message);
                $state.go('login');
            } else {
                defualts.toast($mdToast, store, Response.data.message);
                vm.activated = false;
            }
        }, (err) => {
            defualts.toast($mdToast, store, 'An error occurred');
            vm.activated = false;
        });

    }

}])