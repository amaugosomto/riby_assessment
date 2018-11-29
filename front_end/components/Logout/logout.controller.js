
angular.module('savingsApp').controller("logoutController", 
    ['$state','store', function($state, store) {
        var vm = this;
        
        vm.logOut = () => {
            if (!store.get('user')) {
                $state.go('login');
            } else {
                store.remove('user');
                store.remove('userDetails');
                store.remove('saveId');
                store.remove('userId');
                store.remove('time');
                $state.go('login');
            }            
        }
        
    }]);