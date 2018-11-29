angular.module('savingsApp').directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            var parsedFile = $parse(attrs.fileModel);
            var parsedFileSetter = parsedFile.assign;

            elm.bind('change', function() {
                scope.$apply(function() {
                    parsedFileSetter(scope, elm[0].files[0]);
                })
            })
        }
    };
}]);