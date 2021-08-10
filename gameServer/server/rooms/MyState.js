const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const PersonPlayer         = require("./PersonPlayer.js").PersonPlayer;
const PersonPlayerGroup    = require("./PersonPlayerGroup.js").PersonPlayerGroup;

const Game             = require("../game/Game.js").Game;
const SessionConfig       = require("../game/SessionConfig.js").SessionConfig;

const GameState        = require("../game/model/GameState.js").GameState;

//const Action           = require("../game/model/actions/Action.js").Action;
const TellerHint       = require("../game/model/actions/TellerHint.js").TellerHint;
const GuesserSelection = require("../game/model/actions/GuesserSelection.js").GuesserSelection;
const GuesserEndTurn   = require("../game/model/actions/GuesserEndTurn.js").GuesserEndTurn;

const PlayerAction = require("../game/model/PlayerAction.js").PlayerAction;


class MyState extends Schema {
    constructor () {
        super();
        //not serialized
        this.game         = null;

        //serialized
        this.personPlayerGroups = new MapSchema();
        this.session_config     = new SessionConfig();
        // this.instanceConfig     = new InstanceConfig();
        this.gameState          = null;
        //this.spectators   = new MapSchema();
    }

    createPersonPlayer(sessionId) {
      if(!this.personPlayerGroups[sessionId]) {
        this.personPlayerGroups[sessionId] = new PersonPlayerGroup();
      }
      const group  = this.personPlayerGroups[sessionId];

      var personPlayerId = sessionId + "_" + Object.keys(group.players).length;

      const personPlayer = new PersonPlayer();
      personPlayer.id = personPlayerId;
      group.players[personPlayerId] = personPlayer;

      return personPlayer;
    }

    removePersonPlayer(sessionId, playerId) {

      try {
        //console.log(this.playerGroups[sessionId].toJSON());
        const group = this.personPlayerGroups[sessionId];
        delete group.players[playerId];

        this.updateSessionConfig();
      } catch(e) {
        console.log(e);
      }

      /*
      const to_delete = Object.keys(this.players).filter(key => key.startsWith(sessionId));
      Array.from(to_delete).forEach((key, i) => {
        delete this.players[key];
      });
      */

    }

    removePersonPlayerGroup(sessionId) {
      delete this.personPlayerGroups[sessionId];

      /*
      const to_delete = Object.keys(this.players).filter(key => key.startsWith(sessionId));
      Array.from(to_delete).forEach((key, i) => {
        delete this.players[key];
      });
      */

    }

    getAllPersonPlayers() {
      return Object.values(this.personPlayerGroups).reduce((acc, grp) => acc.concat(Object.values(grp.players)), []);
    }

    updateSessionConfig() {
      //const ready_ids = this.getAllPlayers().filter(player => player.ready).map(player => player.id);
      //this.session_config.configureWithReadyIds(ready_ids);
    }


    /*Commands*/

    //players

    cmd_person_createPersonPlayer (sessionId, command, data) {
      const personPlayer = this.createPersonPlayer(sessionId);
      //todo: put this elsewhere
      personPlayer.name = data.nickname || "toto"; //|| generateName();

      return personPlayer;
    }

    cmd_person_removePersonPlayer (sessionId, command, data) {
      const playerId = data.playerId;
      this.removePersonPlayer(sessionId, playerId);
    }

    cmd_person_setPersonPlayerName (sessionId, command, data) {
      const playerId = data.playerId;
      const name     = data.name;
      console.log("setPersonPlayerName:", playerId, name);
      this.hlp_setPersonPlayerProperty(sessionId, playerId, "name", name);
    }

    hlp_setPersonPlayerProperty(sessionId, playerId, property, value) {
      console.log("hlp_setPlayerProperty:", playerId, property, value);
      const group  = this.personPlayerGroups[sessionId];
      //console.log("group", group.toJSON());
      const personPlayer = group.players[playerId];
      //console.log("personPlayer", personPlayer.toJSON());
      if(personPlayer) {
        personPlayer[property] = value;
      } else {
        console.log("could not find personPlayer matching playerId:", playerId);
      }
    }

    //config

    cmd_session_config_joinTeam (sessionId, command, data) {
      const playerId = data.playerId;
      const teamId   = data.teamId;
      console.log("cmd_config_joinTeam:", playerId, teamId);
      this.session_config.joinTeam(playerId, teamId);
    }

    cmd_session_config_leaveTeam (sessionId, command, data) {
      const playerId = data.playerId;
      const teamId   = data.teamId;
      console.log("cmd_config_leaveTeam:", playerId, teamId);
      this.session_config.leaveTeam(playerId, teamId);
    }

    cmd_session_config_setPlayerReady (sessionId, command, data) {
      const playerId = data.playerId;
      const ready    = data.ready;
      console.log("cmd_config_setSessionPlayerReady:", playerId, ready);

      this.session_config.setPlayerProperty(playerId, "ready", ready);
    }

    cmd_session_config_setPlayerRole (sessionId, command, data) {
      const playerId = data.playerId;
      const role     = data.role;
      console.log("cmd_config_setSessionPlayerRole:", playerId, role);

      this.session_config.setPlayerProperty(playerId, "role", role);
    }

    cmd_session_startGame (sessionId, command, data) {
      try {
        if(this.session_config.canStart) {

          this.game      = new Game(this.session_config);
          this.gameState = this.game.gameState;

        }
      } catch(e) {
        console.log(e);
      }
    }

    cmd_auto_role_in_team (sessionId, command, data) {
      const teamId = data.teamId;
      const role   = data.role;

      //create player
      const nickname = "auto" + "_" + role + "_" + teamId;
      let personPlayer = this.cmd_person_createPersonPlayer(sessionId, command, {nickname : nickname});

      //join team
      this.cmd_session_config_joinTeam(sessionId, command, {playerId: personPlayer.id, teamId: teamId});

      //set role
      this.cmd_session_config_setPlayerRole(sessionId, command, {playerId: personPlayer.id, role: role});

      //set ready
      this.cmd_session_config_setPlayerReady(sessionId, command, {playerId: personPlayer.id, ready: true});
    }

    cmd_auto_game (sessionId, command, data) {
      const type           = data.type;
      const nb_cells       = data.nb_cells;
      const startingTeamId = data.startingTeamId;
    }


    //game

    cmd_instance_teller_submitHint(sessionId, command, data) {
      console.log("cmd_instance_teller_submitHint");
      const srcId  = data.playerId;
      const action = new TellerHint(data.word, data.number);

      const playerAction = new PlayerAction(srcId, action);

      this.game.manageTellerAction(playerAction);
    }

    cmd_instance_guesser_submitCellSelection(sessionId, command, data) {
      console.log("cmd_instance_guesser_submitCellSelection");
      const srcId  = data.playerId;
      const action = new GuesserSelection(data.cellIndex);

      const playerAction = new PlayerAction(srcId, action);

      this.game.manageGuesserSelection(playerAction);
    }

    cmd_instance_guesser_submitEndTurn(sessionId, command, data) {
      console.log("cmd_instance_guesser_submitEndTurn");
      const srcId  = data.playerId;
      const action = new GuesserEndTurn();

      const playerAction = new PlayerAction(srcId, action);

      this.game.manageGuesserEndTurn(playerAction);
    }

}
schema.defineTypes(MyState, {
  personPlayerGroups : { map : PersonPlayerGroup },

  session_config  : SessionConfig,
  gameState       : GameState,

  //spectators   : { map : PersonPlayer },
});

exports.MyState = MyState;
