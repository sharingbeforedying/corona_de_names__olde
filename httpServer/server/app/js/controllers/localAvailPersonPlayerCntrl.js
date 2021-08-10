awApp.controller('localAvailablePersonPlayerController', function($scope) {

    $scope.init = function() {
      console.log("localAvailablePersonPlayerController::init()");
    };

    $scope.style = function() {
      var outStyle;
      if($scope.selectedPersonPlayer == $scope.personPlayer) {
        outStyle = $scope.styleForSelected();
      } else {
        outStyle = $scope.styleForUnselected();
      }
      return outStyle;
    };

    $scope.styleForSelected = function() {
      return {
        "border-width": "5px",
        "border-color": "orange",
        "border-style": "double",
      };
    };

    $scope.styleForUnselected = function() {
      return {
        "border-width": "0px",
        "border-color": "Transparent",
        "border-style": "none",
      };
    };

});
