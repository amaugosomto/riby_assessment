
(function () {
    'use strict';

    angular
        .module('savingsApp')
        .directive('navigationbar', Directive);

    function Directive() {
        
        var directive = {
            bindToController: true,
            templateUrl: './components/navigation/navigation.directive.html',
            controller: toolbar_controller,
            controllerAs: 'toolbar'
        };

        return directive;
    }

    /* @ngInject */
    function toolbar_controller($rootScope, $scope) {
        var vm = this;

        vm.check = $rootScope.checks;

        $scope.$on('login', function (event, obj) {
            obj !== null ? vm.check = true : vm.check = null;
            // console.log('hello', obj)
        });

        $rootScope.$watch('checks', function(event, check) {});
    }
})();