
angular.module('savingsApp').factory('withdrawService', 
['$http', '$state','store','$rootScope','defualts', '$mdToast',
    function($http, $state, store, $rootScope, defualts, $mdToast) {
    let fac = {};

    fac.withdraw = async (status) => {
        let url = defualts.save_backend + '/withdraw';
        let detail;
        status.userId = store.get('user').userId;

        await $http.put(url, status).then(function(response) {

            if (response.data.status){
                detail = response.data.status;
                // defualts.toast($mdToast, store, response.data.message);
                alert(response.data.message);
                $state.reload('dashboard').then(()=> {
                    $state.go('dashboard');
                });
            } else {
                defualts.toast($mdToast, store, response.data.message);
            }
            
        }, () => {
            defualts.toast($mdToast, store, 'An error occured, try again later.');
            $state.go('dashboard');
        });
        return detail;
    }

    return fac;
}]);