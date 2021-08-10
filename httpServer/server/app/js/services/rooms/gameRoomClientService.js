awApp.service('gameRoomClientService_incoming', function(gameService) {
  console.log("gameRoomClientService_incoming");

  this.data = {};

  this.listenToChanges = function(room) {

    const localId = room.sessionId;
    this.data["localId"] = localId;

    const cs_incoming = this;
    room.state.onChange = (changes) => {
      console.log("gameRoomClientService_incoming::room.state.onChange");
      changes.forEach(change => {
          console.log(change.field);
          console.log(change.value);
          console.log(change.previousValue);


          if(change.field == "personPlayerGroups") {
            const personPlayerGroups = change.value.toJSON();
            cs_incoming.manageChanges_personPlayerGroups(localId, personPlayerGroups);
          } else if(change.field == "session_config") {
            const session_config = change.value.toJSON();
            cs_incoming.manageChanges_sessionConfig(localId, session_config);
          } else if(change.field == "gameState") {
            const gameState = change.value ? change.value.toJSON() : null;
            if(gameState) {
              cs_incoming.manageChanges_gameState(localId, gameState);
            }
          } else {
            cs_incoming.data[change.field] = change.value;
          }


          cs_incoming.notifyObservers();
      });
    };

  };


  //OBSERVER PATTERN

  this.observerCallbacks = [];

  //register an observer
  this.registerObserverCallback = function(callback){
    this.observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  this.notifyObservers = function(){
    const serviceName = "gameRoomClientService_incoming";
    this.observerCallbacks.forEach((callback,i) => {callback(serviceName);});
  };



  //processing

  this.manageChanges_personPlayerGroups = function(localId, personPlayerGroups) {
    console.log("state.personPlayerGroups has changed");
    console.log("personPlayerGroups:", personPlayerGroups);

    this.data["personPlayerGroupsMap"] = personPlayerGroups;

    if(personPlayerGroups[localId]) {
        this.data["local_personPlayersMap"] = personPlayerGroups[localId].players;
    } else {
      this.data["local_personPlayersMap"] = {};
    }

    var otherPlayerGroupsMap = Object.fromEntries(Object.entries(personPlayerGroups).filter(([key, value])  => key != localId));
    console.log("otherPlayerGroupsMap", otherPlayerGroupsMap);
    this.data["other_personPlayerGroupsMap"] = otherPlayerGroupsMap;

    this.data["local_availablePersonPlayersMap"] = this.interface.getLocalAvailablePersonPlayersMap();

    console.log("manageChanges_personPlayerGroups", "this.data", this.data);
  };

  this.manageChanges_sessionConfig = function(localId, session_config) {
    console.log("state.session_config has changed");
    console.log("session_config:", session_config);

    this.data["session_config"] = session_config;

    this.data["local_availablePersonPlayersMap"] = this.interface.getLocalAvailablePersonPlayersMap();

    this.data["session_teamsMap"]   = this.interface.getSessionTeamsMap();
    this.data["session_playersMap"] = this.interface.getSessionPlayersMap();

    this.data["local_session_playersMap"] = this.interface.getLocalSessionPlayersMap()
    this.data["local_session_teamsMap"]   = this.interface.getLocalSessionTeamsMap();

    console.log("manageChanges_sessionConfig", "this.data", this.data);
  };

  this.manageChanges_gameState = function(localId, gameState) {
    console.log("state.gameState has changed");
    console.log("gameState:", gameState);

    this.data["gameState"] = gameState;

    this.data["activeTeamPSI"]   = this.interface.getTeamPSI(this.interface.getActiveTeamId());
    this.data["activePlayerPSI"] = this.interface.getPlayerPSI(this.interface.getActivePlayerId());

    if(this.interface.isLocalTeamId(this.interface.getActiveTeamId())) {
      this.data["local_activeTeamPSI"] = this.data["activeTeamPSI"];
    } else {
      console.log("not local team");
    }

    if(this.interface.isLocalPlayerId(this.interface.getActivePlayerId())) {
      this.data["local_activePlayerPSI"] = this.data["activePlayerPSI"];
    } else {
      console.log("not local player");
    }

    console.log("manageChanges_gameState", "this.data", this.data);
  };





  //INTERFACE
  const cs = this;
  cs.interface = {}

  cs.interface.getPlayerPSI = function(id) {
    const personPlayer   = cs.interface.getPersonPlayersMap()[id];
    const sessionPlayer  = cs.interface.getSessionPlayersMap()[id];
    const instancePlayer = cs.interface.getInstancePlayersMap()[id];
    return {
      person:   personPlayer,
      session:  sessionPlayer,
      instance: instancePlayer,
    };
  }

  cs.interface.getTeamPSI = function(id) {
    const personPlayersMap = cs.interface.getPersonPlayersMap();
    const sessionTeam      = cs.interface.getSessionTeamsMap()[id];
    const instanceTeam     = cs.interface.getInstanceTeamsMap()[id];
    const personPlayersInTeam = cs.interface.getPersonTeam(sessionTeam, personPlayersMap);
    return {
      person:   personPlayersInTeam,
      session:  sessionTeam,
      instance: instanceTeam,
    };
  }

  cs.interface.getPersonTeam = function(sessionTeam, personPlayersMap) {
    return {
      id : sessionTeam.id,
      players: Object.fromEntries(Object.values(sessionTeam.players).map(sessionPlayer => [sessionPlayer.id, personPlayersMap[sessionPlayer.id]])),
    };
  }

  cs.interface.isLocalPlayerId = function(playerId) {
    return cs.interface.getLocalPersonPlayersMap()[playerId] != null;
  }

  cs.interface.isLocalTeamId = function(teamId) {
    return cs.interface.getLocalSessionTeamsMap()[teamId] != null;
  }

  cs.interface.getActiveTeamId = function() {
    return cs.data["gameState"].turn.teamId;
  }

  cs.interface.getActivePlayerId = function() {
    return cs.data["gameState"].turn.activePlayerId;
  }


  //state
    //person
  cs.interface.getPersonPlayerGroupsMap = function() {
    return cs.data["personPlayerGroupsMap"];
  }

  cs.interface.getOtherPersonPlayerGroupsMap = function() {
    return cs.data["other_personPlayerGroupsMap"];
  }

  cs.interface.getPersonPlayersMap = function() {
    const personPlayerGroupsMap = cs.interface.getPersonPlayerGroupsMap();
    return cs.interface.hlp_fusion_subMaps(personPlayerGroupsMap, "players");
  }

  cs.interface.getLocalPersonPlayersMap = function() {
    return cs.data["local_personPlayersMap"];
  }

    //session
  cs.interface.getSessionTeamsMap = function() {
    const session_config = cs.data["session_config"]
    var teamsMap;
    if (session_config) {
      teamsMap = session_config.teams;
    } else {
      teamsMap = {};
    }
    //console.log("getSessionTeamsMap", teamsMap);
    return teamsMap;
  }

  cs.interface.getSessionPlayersMap = function() {
    const sessionTeamsMap = cs.interface.getSessionTeamsMap();
    return cs.interface.hlp_fusion_subMaps(sessionTeamsMap, "players");
  }

  cs.interface.getLocalSessionPlayersMap = function() {
    const sessionPlayersMap = cs.interface.getSessionPlayersMap();

    const localPersonPlayersMap = cs.interface.getLocalPersonPlayersMap();

    const localSessionPlayersMap = Object.fromEntries(Object.entries(sessionPlayersMap).filter(([playerId,sessionPlayer]) => localPersonPlayersMap[playerId] != null));
    return localSessionPlayersMap;
  }

  cs.interface.getLocalSessionTeamsMap = function() {
    const localSessionPlayersMap = cs.interface.getLocalSessionPlayersMap();

    const sessionTeamsMap = cs.interface.getSessionTeamsMap();

    const localSessionTeamsMap = Object.fromEntries(Object.values(localSessionPlayersMap).map(sessionPlayer => [sessionPlayer.teamId, sessionTeamsMap[sessionPlayer.teamId]]));
    return localSessionTeamsMap;
  }


    //instance
  cs.interface.getInstanceTeamsMap = function() {
    const teamsMap = cs.data["gameState"].teams;
    //console.log("getInstanceTeamsMap", teamsMap);
    return teamsMap;
  }

  cs.interface.getInstancePlayersMap = function() {
    const instanceTeamsMap = cs.interface.getInstanceTeamsMap();
    return cs.interface.hlp_fusion_subMaps(instanceTeamsMap, "players");
  }

  cs.interface.hlp_fusion_subMaps = function(maps, subMapName) {
    const submapsArray = Object.values(maps).map(map => map[subMapName]);
    const fusionMap = submapsArray.reduce((acc, subMap) => Object.assign(acc, subMap), {});
    return fusionMap;
  };


  cs.interface.getLocalAvailablePersonPlayersMap = function() {
    //console.log("Object.entries({})", Object.entries({}));
    //console.log("Object.fromEntries([])", Object.fromEntries([]));
    console.log("this", this);

    const localPersonPlayersMap = cs.interface.getLocalPersonPlayersMap();
    console.log("localPersonPlayersMap", localPersonPlayersMap);
    if(!localPersonPlayersMap) {
      return {};
    }
    if(Object.entries(localPersonPlayersMap).length == 0) {
     return {};
    }

    const sessionPlayersMap = cs.interface.getSessionPlayersMap();
    console.log("sessionPlayersMap", sessionPlayersMap);

    const entries = Object.entries(localPersonPlayersMap);
    console.log("entries", entries);
    const filteredEntries = entries.filter(([playerId, personPlayer]) => sessionPlayersMap[playerId] == null)
    return Object.fromEntries(filteredEntries);
  }

  cs.interface.get_local_activePlayerPSI = function() {
    return cs.data["local_activePlayerPSI"];
  }

  cs.interface.get_local_activeTeamPSI = function() {
    return cs.data["local_activeTeamPSI"];
  }


  cs.interface.get_grid__position = function() {
    console.log("g_rcs.get_grid__position");
    return cs.data["gameState"].position_grid;
  }

  cs.interface.get_grid__game = function() {
    return cs.data["gameState"].game_grid;
  }

  cs.interface.getGameState = function() {
    return cs.data["gameState"];
  }


  //DI:
  console.log("gameRoomClientService_incoming", "interface injection");
  console.log("gameRoomClientService_incoming", "interface", Object.keys(this.interface));
  Object.keys(this.interface).forEach((fkey, i) => {
    gameService[fkey] = this.interface[fkey];
  });

  this.registerObserverCallback((serviceName) => {
    gameService.notifyObservers();
  });

});








awApp.service('gameRoomClientService_outgoing', function(gameService) {
  console.log("gameRoomClientService_outgoing");

  this.registerCommands = function(room) {

    const cs = this;
    cs.interface = {};

    cs.interface.person_addPlayer = function(nickname) {
      room.send(["person_createPlayer", {nickname: nickname}]);
    };

    cs.interface.person_removePlayer = function(playerId) {
      room.send(["person_removePlayer", {"playerId" : playerId}]);
    };

    cs.interface.person_setPlayerName = function(playerId, name) {
      room.send(["person_setPlayerName", {"playerId" : playerId, "name" : name}]);
    };




    cs.interface.session_config_joinTeam = function(personPlayer, team) {
      const playerId = personPlayer.id;
      const teamId   = team.id;
      room.send(["session_config_joinTeam", {"playerId" : playerId, "teamId" : teamId}]);
    };

    cs.interface.session_config_leaveTeam = function(sessionPlayer, team) {
      const playerId = sessionPlayer.id;
      const teamId   = team.id;
      room.send(["session_config_leaveTeam", {"playerId" : playerId, "teamId" : teamId}]);
    };

    cs.interface.session_config_setPlayerReady = function(sessionPlayer, ready) {
      const playerId = sessionPlayer.id;
      room.send(["session_config_setPlayerReady", {"playerId" : playerId, "ready" : ready}]);
    };

    cs.interface.session_config_setPlayerRole = function(sessionPlayer, role) {
      const playerId = sessionPlayer.id;
      room.send(["session_config_setPlayerRole", {"playerId" : playerId, "role" : role}]);
    };

    cs.interface.session_startGame = function() {
      room.send(["session_startGame", {}]);
    };

    cs.interface.auto_role_in_team = function(role,teamId) {
      room.send(["auto_role_in_team", {"role" : role, "teamId" : teamId}]);
    };

    cs.interface.auto_game = function(type, nb_cells, startingTeamId) {
      room.send(["auto_game", {"type" : type, "nb_cells" : nb_cells, "startingTeamId" : startingTeamId}]);
    }




    cs.interface.instance_teller_submitHint = function(instancePlayer, word, number) {
      const playerId = instancePlayer.id;
      room.send(["instance_teller_submitHint", {"playerId" : playerId, "word" : word, "number" : number}]);
    };

    cs.interface.instance_guesser_submitCellSelection = function(instancePlayer, cellIndex) {
      const playerId = instancePlayer.id;
      room.send(["instance_guesser_submitCellSelection", {"playerId" : playerId, "cellIndex" : cellIndex}]);
    };

    cs.interface.instance_guesser_submitEndTurn = function(instancePlayer) {
      const playerId = instancePlayer.id;
      room.send(["instance_guesser_submitEndTurn", {"playerId" : playerId}]);
    };


    //DI:
    console.log("gameRoomClientService_outgoing", "interface injection");
    console.log("gameRoomClientService_outgoing", "interface", Object.keys(this.interface));
    Object.keys(this.interface).forEach((fkey, i) => {
      gameService[fkey] = this.interface[fkey];
    });
  };


});

awApp.service('gameRoomClientService', function(gameRoomClientService_incoming, gameRoomClientService_outgoing) {
  console.log('gameRoomClientService');

  const roomPort = 2567;
  const roomName = "game_room";

  this.client = new Colyseus.Client("ws://localhost:" + roomPort);

  this.client.joinOrCreate(roomName, {/* options */}).then(room => {
    console.log("joined successfully", room);

    //in
    gameRoomClientService_incoming.listenToChanges(room);

    //out
    gameRoomClientService_outgoing.registerCommands(room);

  }).catch(e => {
    console.error("join error", e);
  });


});

//initialize the service(s)
awApp.run(function (gameRoomClientService) {
  console.log("run");
  //this will induce the dependency injections
});
