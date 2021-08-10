// create the controller and inject Angular's $scope
awApp.controller('personPlayersPController', function($scope, gameService) {
    // create a message to display in our view

    $scope.init = function() {
      console.log("personPlayersPController::init");

      $scope.localPersonPlayers = () => gameService.getLocalPersonPlayersMap();

      $scope.personPlayerGroupsMap_other = () => gameService.getPersonPlayerGroupsMap_other();

      gameService.onChange(() => {
        console.log("autoPController::gameService.onChange");
        $scope.$apply();
      });

    };

    $scope.add_player = function() {
      console.log("button clicked");

      gameService.person_addPlayer();
    };


});
