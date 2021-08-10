awApp.controller('personPlayerController', function($scope, gameService) {

    $scope.init = function() {
      console.log("personPlayerController::init()");
    };


    $scope.activate_setName = function() {
      //console.log("onDblClick", "wordInput:", $scope.wordInput);
      $scope.wordInputFormGroup.hidden = false;

      $scope.wordInput.focus();
      console.log("after:", $scope.wordInput);
    };


    $scope.submit_setName = function() {
      console.log("submit_setName:", $scope.input_word);

      $scope.wordInputFormGroup.hidden = true;

      var newValue = $scope.input_word;
      gameService.person_setPlayerName($scope.personPlayer.id, newValue);

    };

    $scope.submit_removePlayer = function() {
      gameService.person_removePlayer($scope.personPlayer.id);
    };


});
