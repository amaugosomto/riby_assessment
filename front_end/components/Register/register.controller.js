
angular.module('savingsApp').controller("registerController", 
    ['registerService','$mdToast', 'store', 'defualts', function ( registerService, $mdToast, store, defualts) {

        var vm = this;

    vm.registerUser = () => {
        let user = vm.user;

        if(user.password !== user.confirm_password){
            defualts.toast($mdToast, store, 'Passwords dont match, please retry');
            vm.user.password = '';
            vm.user.confirm_password = '';
        } else {
            delete vm.user.confirm_password;
            registerService.register(vm.user);
        }
        
    }

    vm.state = `Abia Adamawa Akwa-Ibom Anambra Bauchi Bayelsa Benue Borno Cross-River Delta Ebonyi Edo Ekiti Enugu Gombe Imo Jigawa Kaduna Kano Katsina Kebbi Kogi Kwara Lagos Nasarawa Niger Ogun Ondo Osun Oyo Plateau Rivers Sokoto Taraba Yobe Zamfara FCT`.split(' ').map((state) => {
        return {
            state
        }
    });
    
}]);