// create the controller and inject Angular's $scope
awApp.controller('mainController', function($scope, $uibModal, gameService) {
    // create a message to display in our view

    $scope.init = function() {

    };

    $scope.message = "mainController.message";


    $scope.showModal = function () {
      $uibModal.open({
          templateUrl: '../../pages/modal/testModal.html',
          controller: 'testModalController',
          scope: $scope,
      })
      .result.then(function() {
          alert('closed');
      }, function() {
          alert('canceled');
      });
    };

});
