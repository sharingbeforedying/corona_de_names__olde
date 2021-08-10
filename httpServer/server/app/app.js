var awApp = angular.module('awApp', ['ngRoute', 'ui.bootstrap', 'fileDropzone']);

  // configure our routes
  awApp.config(function($routeProvider, $compileProvider) {
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|mailto|local|chrome-extension):|data:image\/)/);
      //$compileProvider.imgSrcSanitizationWhitelist(/^data:img\/png.*/);
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|local|chrome-extension):/);

      $routeProvider

          // route for the home page
          .when('/', {
              templateUrl : 'pages/home.html',
              controller  : 'mainController'
          })
          .when('/auto', {
              templateUrl : 'pages/auto.html',
              controller  : 'autoPController'
          })
          .when('/personPlayers', {
              templateUrl : 'pages/personPlayers.html',
              controller  : 'personPlayersPController'
          })
          .when('/sessionTeams', {
              templateUrl : 'pages/sessionTeams.html',
              controller  : 'sessionTeamsPController'
          })
          // .when('/game', {
          //     templateUrl : 'pages/game.html',
          //     controller  : 'gamePController'
          // })
          .when('/sessionConfig', {
              templateUrl : 'pages/sessionConfig.html',
              controller  : 'sessionConfigPController'
          })
          .when('/instanceConfig', {
              templateUrl : 'pages/instanceConfig.html',
              controller  : 'instanceConfigPController'
          })

          .when('/game_teller', {
              templateUrl : 'pages/game_teller.html',
              controller  : 'gameTellerPController'
          })
          .when('/game_guesser', {
              templateUrl : 'pages/game_guesser.html',
              controller  : 'gameGuesserPController'
          })

          .when('/game_duo', {
              templateUrl : 'pages/cn_duo/game_duo.html',
              controller  : 'gameDuoPController'
          })


          .when('/cn_position', {
              templateUrl : 'pages/codenames/cn_position.html',
              controller  : 'cnpMainController'
          })
          .when('/cn_customize', {
              templateUrl : 'pages/codenames/cn_customize.html',
              controller  : 'cncuMainController'
          })
          .when('/cn_main', {
              templateUrl : 'pages/codenames/cn_main.html',
              controller  : 'cnMainController'
          })
          .when('/cn_mini', {
              templateUrl : 'pages/codenames/cn_mini.html',
              controller  : 'cnMiniController'
          })



          .when('/login', {
              templateUrl : 'pages/login.html',
              controller  : 'loginController'
          })
          .when('/create_profile', {
              templateUrl : 'pages/create_profile.html',
              controller  : 'createProfileController'
          })
          .when('/profile', {
              templateUrl : 'pages/profile.html',
              controller  : 'profileController'
          })


          .when('/sessions', {
              templateUrl : 'pages/sessions.html',
              controller  : 'sessionController'
          })
          .when('/create_session', {

              //creation session code ?

              templateUrl : 'pages/create_session.html',
              controller  : 'createSessionController'
          })
          .when('/session', {
              templateUrl : 'pages/session.html',
              controller  : 'sessionController'
          })


          .when('/create_content_grid', {
              templateUrl : 'pages/create_content_grid.html',
              controller  : 'createContentGridController'
          })

          .otherwise('/');

  });

  awApp.directive('scopeElement', function () {
      return {
          restrict:"A", // E-Element A-Attribute C-Class M-Comments
          replace: false,
          //priority: 451, //ng-init has priority level 450.
          link: function($scope, elem, attrs) {
              console.log("scopeElement()");
              $scope[attrs.scopeElement] = elem[0];
          }
      };
  });


/*
  awApp.directive('elemReady', function( $parse ) {
     return {
         restrict: 'A',
         link: function( $scope, elem, attrs ) {
            elem.ready(function(){
              $scope.$apply(function(){
                  var func = $parse(attrs.elemReady);
                  func($scope);
              })
            })
         }
      }
  })
*/
