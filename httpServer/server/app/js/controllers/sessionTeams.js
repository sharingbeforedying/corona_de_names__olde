// create the controller and inject Angular's $scope
awApp.controller('sessionTeamsPController', function($scope, gameService) {
    // create a message to display in our view

    $scope.init = function() {

      $scope.session_teamsMap = () => gameService.getSessionTeamsMap();
      $scope.personPlayersMap_local_available = () => gameService.getLocalAvailablePersonPlayersMap();

      gameService.onChange(() => {
        console.log("sessionTeamsPController::->gameService.onChange");

        $scope.$apply();
      });

    };

    $scope.submit_startGame = function() {
      gameService.session_startGame();
    };

    $scope.selectPersonPlayer = function(personPlayer) {
      if($scope.selectedPersonPlayer == personPlayer) {
          $scope.selectedPersonPlayer = null;
      } else {
        $scope.selectedPersonPlayer = personPlayer;
      }

      //$scope.$apply();
    }


});
