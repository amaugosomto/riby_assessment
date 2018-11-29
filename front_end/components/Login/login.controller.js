
angular.module('savingsApp').controller('loginController',
['loginService', '$uibModal', '$document', function (loginService, $uibModal, $document) {

    var vm = this;
    vm.activated = false;

    vm.loginUser = async function() {
        
        vm.activated = true;
        let edited = vm.user;
        edited.email = vm.user.email.toLowerCase();

        var status = await loginService.login(edited);
        if(status != true) vm.activated = false;
    }

    vm.reset = function (size, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: './components/Profile/Password_reset/email.html',
            controller: 'email_controller',
            controllerAs: 'vm',
            size: size,
            appendTo: parentElem
        });

        modalInstance.result.then(function (selectedItem) {
            vm.selected = selectedItem;
        }, function () {
        }); 
    }

}])