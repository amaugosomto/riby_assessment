angular.module('savingsApp').controller('email_controller', 
['defualts', '$mdToast', 'store', '$http', '$state','$uibModalInstance',
 function(defualts, $mdToast, store, $http, $state, $uibModalInstance) {
    vm = this;
    vm.activated = false;
    
    vm.request = () => {
        vm.activated = true;
        $uibModalInstance.dismiss('cancel');
        let url = defualts.user_backend + `/request/${vm.email}`;
        let email = vm.email;

        $http.post(url).then((Response) => {
            if (Response.data.status) {
                defualts.toast($mdToast, store, Response.data.message);
                $state.go('login');
            } else {
                defualts.toast($mdToast, store, Response.data.message);
                vm.activated = false;
            }
        }, (err) => {
            defualts.toast($mdToast, store, 'An error occurred');
            console.log(err);
            vm.activated = false;
        })
    }
}])