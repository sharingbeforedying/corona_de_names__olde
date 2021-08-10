awApp.controller('sessionTeamController', function($scope, gameService) {

    $scope.init = function() {
      console.log("sessionTeamController::init()");
    };


    $scope.submit_joinTeam = function() {
      console.log("submit_joinTeam:");

      if($scope.selectedPersonPlayer) {
          gameService.session_config_joinTeam($scope.selectedPersonPlayer, $scope.sessionTeam);
      } else {
        console.log("ignored");
      }

    }

});
