angular.module('savingsApp').service('historyService', 
['$http', 'defualts', 'store', '$mdToast',
function ($http, defualts, store, $mdToast) {

    this.getSave = async (saveId) => {
        this.savings = {};
        let url = defualts.save_backend + `/view/${saveId}`;

        await $http.get(url).then((Response) => {
            if (Response.data.status) {
                this.savings = Response.data.payload;
            } else {
                defualts.toast($mdToast, store, Response.data.message);
            }
        }, () => {
            defualts.toast($mdToast, store, 'An error occurred');
        });

        return this.savings;
    }
}]);