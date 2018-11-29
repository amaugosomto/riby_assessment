// (function () {
    angular.module('savingsApp').controller('contactController', ['$mdDialog', function ($mdDialog) {
        var self = this;

        self.openDialog = function ($event) {
            $mdDialog.show({
                controller: DialogCtrl,
                controllerAs: 'vm',
                templateUrl: './components/Contact/contact.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true
            });
        };

        function DialogCtrl($timeout, $q, $scope, $mdDialog) {
            var self = this;

            self.states = `Abia Adamawa Akwa-Ibom Anambra Bauchi Bayelsa Benue Borno Cross-River Delta Ebonyi Edo Ekiti Enugu Gombe Imo Jigawa Kaduna Kano Katsina Kebbi Kogi Kwara Lagos Nasarawa Niger Ogun Ondo Osun Oyo Plateau Rivers Sokoto Taraba Yobe Zamfara FCT`.split(' ').map((state) => {
                return {
                    state
                }
            });

            self.cancel = function ($event) {
                $mdDialog.cancel();
            };
            self.finish = function ($event) {
                $mdDialog.hide();
            };
        }

    }]);
// })();