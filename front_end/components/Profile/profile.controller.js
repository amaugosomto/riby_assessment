angular.module('savingsApp').controller('profileController', 
['result','$state','$scope','$timeout','accountService', function(result, $state, $scope, $timeout, accountService) {
    vm = this;

    if(!result) vm.isNotFound = true;
    vm.user = result;
    vm.edit = vm.user.first_name? true : false;
    vm.user.last_name = vm.user.last_name? vm.user.last_name : vm.user.name;
    vm.user.first_name = vm.user.first_name? vm.user.first_name : vm.user.name;
    vm.user.address = vm.user.address? vm.user.address : '';

    if (vm.user.img_name){
        vm.img_src = `./assets/img/uploads/${vm.user.img_name}`;
    }
    
    
    vm.edit = (userId) => {
        $state.go('dashboard.profile.edit', { userId });
    }

    vm.update = () => {
        console.log(vm.user)
    }

    $scope.photo_upload = async function () {
        await accountService.upload($scope.file)
        $scope.file = '';
    }

    $scope.photoChanged = (files) => {
        if (files.length > 0 && files[0].name.match(/\.(jpg|png|jpeg)$/)) {
            console.log(files)
            let file = files[0];
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                $timeout(function () {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                });
            };
        } else {
            $scope.thumbnail = {};
        }
    };
}]);