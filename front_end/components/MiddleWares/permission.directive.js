
(function() {
    'use strict';

    angular
        .module('savingsApp')
        .directive('permission', permission_directive);

    permission_directive.$inject = ['Auth'];
    function permission_directive(Auth) {
        
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                permission: '='
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
            scope.$watch(Auth.isLoggedIn, function(){
                if (Auth.userHasPermission(scope.permission)) {
                    element.show();
                } else {
                    element.remove();
                }                
            });
        }}
})();