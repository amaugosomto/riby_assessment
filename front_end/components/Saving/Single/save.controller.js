angular.module('savingsApp').controller('historyController',
    ['store','$scope','items',
        async function (store, $scope, items) {
            vm = this;

            // vm.saves = result;
            vm.total = 0;
            let token = store.get('user').token;

            if (!token) $state.go('login');

            $scope.saves = items;

            if ($scope.saves) {
                for (let index = 0; index < $scope.saves.length; index++) {
                    const save = parseInt($scope.saves[index].amount);
                    $scope.total += parseInt(save);
                }
            }

            console.log($scope.saves)
        }
    ]);