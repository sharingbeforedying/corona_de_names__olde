awApp.controller('sessionPlayerController', function($scope, gameService) {

    $scope.init = function() {
      console.log("sessionPlayerController::init()");
    };

    // $scope.submit_setRole = function() {
    //   console.log("submit_setRole:", $scope.sessionPlayer.role);
    //
    //   gameRoomClientService.session_config_setPlayerRole($scope.sessionPlayer, $scope.sessionPlayer.role);
    // };

    $scope.readyInputChanged = function() {
      const newValue = $scope.sessionPlayer.ready;
      //console.log("newValue:", newValue);
      gameService.session_config_setPlayerReady($scope.sessionPlayer, newValue);
    };

    $scope.submit_leaveTeam = function() {
      gameService.session_config_leaveTeam($scope.sessionPlayer, $scope.sessionTeam);
    };


});
