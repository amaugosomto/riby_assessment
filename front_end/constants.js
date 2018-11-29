(function () {
    'use strict';

    var defualts = {
        'user_backend': 'http://localhost:3000/users',
        'save_backend': 'http://localhost:3000/saves',
        'toast': toast

    }

    function toast ($mdToast, store, data){
        store.set('message', data);
        $mdToast.show({
            hideDelay   : 3000,
            position    : 'top right',
            controller  : 'toastController as vm',
            templateUrl : './components/Toast/toast.html'
        });
    }

    angular.module('savingsApp').value('defualts', defualts);
})();