


awApp.controller('cnmMainController', function($scope,gameRoomClientService,displaySettingsService) {
  console.log('cnmMainController');
  //$scope.gameModel = new GameModel(5,5);  //Don't do that, it will cause an infinite digest loop => create gameModel elsewhere

  $scope.init = function() {
    //$scope.gameModel = gameModel;
    $scope.gameModel = gameService.gameModel;

    $scope.items = itemService.service.getRandomItems($scope.gameModel.cellModels.length);

    displaySettingsService.configureWithNbCells($scope.gameModel.cellModels.length);
    $scope.displaySettings = displaySettingsService.data;
  }

  $scope.styleForMain = function() {
    return {
      "background-color" : "wheat",
    };
  };

  $scope.styleForTopBanner = function() {
    return {
      "background-color" : $scope.gameModel.getActiveTeam().color,
    };
  };

});

/*
awApp.controller('cnmGameOverController', function($scope,$timeout) {
  console.log('cnmGameOverController');

  $scope.message = "";

  $scope.winner = null;
  $scope.loser  = null;

  $scope.init = function() {

    $scope.gameModel.addGameOverEventListener( (winner, loser) => {
      $scope.message = ["WINNER: ",winner.name, ",", "LOSER:", loser.name].join(" ");
    });
  };

  $scope.styleForGameOver = function() {
    return {
      "background-color" : $scope.gameModel.getActiveTeam().color,
    };
  };

});
*/

awApp.controller('cnmGridController', function($scope,$timeout) {
    console.log('cnmGridController');

    //$scope.gameModel = gameModel;
    $scope.init = function() {

    }

    //$scope.cnpGridModel = $scope.gameModel.gridModel;

    $scope.child_models = $scope.gameModel.cellModels;


    $scope.get_grid_model = function() {
      return partition($scope.child_models, 5);
    };

    $scope.grid_model = $scope.get_grid_model();

    $scope.styleForGrid = function() {
      return {
        "background-color" : "Transparent",

        "pointer-events": $scope.gameModel.currentTurn.contract ? "auto" : "none",
      };
    };

    //game callbacks
    // gameModel.gameOver() {
    //
    // }

});

awApp.controller('cnmCellController', function($scope) {

  $scope.init = function(cellModel) {
    $scope.cellModel = cellModel;
    $scope.item      = $scope.items[cellModel.getIndex()];


    if($scope.item) {
      $scope.imageSrc = $scope.item.type == "image" ? $scope.item.content : null
      $scope.word     = $scope.item.type == "word"  ? $scope.item.content : null;
    }

  }

  $scope.cellClicked = function() {
    console.log("cnmCellController.cellClicked");

    $scope.cellModel.flipped = true;
    $scope.imageSrc = "";
    $scope.word     = "";

    //$scope.$parent.cellClicked($scope);
    $scope.gameModel.manageCellSelection($scope.cellModel);

  };

  /*
  $scope.update = function() {
    if($scope.cellModel.flipped) {
      $scope.imageSrc = "";
      $scope.word     = "";

      //$cellScope.$apply();
    } else if ($scope.cellModel.guessers.length > 0) {

    }

    //$scope.$apply();
  }
  */

  $scope.colorForType = function(type) {
    var outColor = '';

    switch (type) {
      case 0:
        outColor = "#AAAAAA";
      break;
      case 1:
        outColor = $scope.completedColorTeam ? ($scope.completedColorTeam.color == "red" ? "gold" : "red") : "red";
      break;
      case 2:
        outColor = $scope.completedColorTeam ? ($scope.completedColorTeam.color == "blue" ? "gold" : "blue") : "blue";
      break;
      case 3:
      case 5:
      case 6:
      case 7:
      case 8:
        outColor = "#000000";
      break;
      case 4:
        outColor = $scope.completedColorTeam ? $scope.completedColorTeam.color : "green";
      break;
      default:
        outColor = 'type does not exist';
        break;
    }

    return outColor;
  };

  $scope.styleForCell = function() {
    return {
      "background-color" : $scope.cellModel.flipped ? $scope.colorForType($scope.cellModel.gridCellModel.type) : "LightGray",
    };
  };

  $scope.styleForCard = function() {
    return {
      // "width"  : "" + $scope.displaySettings.cell_size + "px",
      "height" : "" + $scope.displaySettings.cell_size + "px",
    };
  };

  $scope.styleForWord = function() {
    return {
      "font-size": "" + $scope.displaySettings.font_size + "px",
    };
  };

});

awApp.controller('cnmTeamController', function($scope,$timeout) {
  console.log('cnmTeamController');

  $scope.init = function(teamModel) {
    $scope.team = teamModel;
  };

  $scope.getObjectiveForTeam = function() {
    return $scope.gameModel.getObjectiveForTeam($scope.team);
  }

  $scope.getRemainingForTeam = function() {
    return $scope.gameModel.getRemainingForTeam($scope.team);
  }


  $scope.styleForTeam = function() {
    return {
      "background-color" : $scope.team.color,

      "color" : "white",
      "font-size": "1.2em",

      /*
      "visibility" : ($scope.team == $scope.gameModel.getActiveTeam()) ? "visible" : "hidden",
      */
    };
  };
});

awApp.controller('cnmTeamTurnController', function($scope,$timeout) {
  console.log('cnmTeamTurnController');

  $scope.isVisible = function() {
    //return ($scope.team == $scope.gameModel.currentTurn.team);
    return ($scope.team == $scope.gameModel.getActiveTeam());

  }

  $scope.styleForTurn = function() {
    return {
      "background-color" : $scope.team.color,

      "color" : "white",
      "font-size": "1.2em",

      "visibility" : $scope.isVisible() ? "visible" : "hidden",
    };
  };


});

awApp.controller('cnmCreateContractController', function($scope,$timeout) {
  console.log('cnmCreateContractController');

  $scope.data = {
    npNumberModel: null,
  };

  $scope.submitContract = function() {
    var contract = new Contract($scope.gameModel.getActiveTeam(), $scope.data.npNumberModel.number);
    $scope.gameModel.currentTurn.registerContract(contract);
  };

  /*
  $scope.$on('np_numberDidUpdate', function (e, data) {
    console.log(e, data);
    var number = data;
    $scope.nb_todo = number;
  });
  */

  $scope.isVisible = function() {
    return !$scope.gameModel.currentTurn.contract;
  }

  $scope.styleForContractCreator = function() {
    // console.log("styleForContractCreator");
    // console.log("$scope.$parent.isVisible(): ", $scope.$parent.isVisible());
    // console.log("$scope.isVisible(): ", $scope.isVisible());
    return {
      "visibility" : ($scope.$parent.isVisible() && $scope.isVisible()) ? "visible" : "hidden",
    };
  };

});

awApp.controller('contractController', function($scope,$timeout) {
  console.log('contractController');

  //$scope.name = $scope.gameModel.contract.name;

  $scope.endTurn = function() {
    console.log("endTurn");
    $scope.gameModel.endTurn();
  };

  $scope.isVisible = function() {
    return $scope.gameModel.currentTurn.canEndTurn();
  };

  $scope.styleForEndTurn = function() {
    // console.log("styleForEndTurn");
    // console.log("$scope.$parent.isVisible(): ", $scope.$parent.isVisible());
    // console.log("$scope.isVisible(): ", $scope.isVisible());
    return {
      "visibility" : ($scope.$parent.isVisible() && $scope.isVisible()) ? "visible" : "hidden",
    };
  };

  /*
  $scope.$on('np_numberDidUpdate', function (e, data) {
    console.log(e, data);
    var number = data;
    $scope.nb_todo = number;
  });
  */

});
