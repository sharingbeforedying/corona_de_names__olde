const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const SessionPlayer = require('./SessionPlayer.js').SessionPlayer;
const SessionTeam   = require('./SessionTeam.js').SessionTeam;

const onChange = require('on-change');

const Utils = require('../utils/utils.js').Utils;

class SessionConfig extends Schema {

    constructor() {
      super();

      this.teams = new MapSchema();
      // const redTeam  = SessionTeam.create_redTeam();
      const sessionTeam1 = new SessionTeam("ssT1", "#ff33cc", "M-KILLERS");
      this.teams[sessionTeam1.id]  = sessionTeam1;
      // const blueTeam = SessionTeam.create_blueTeam();
      const sessionTeam2 = new SessionTeam("ssT2", "#00ccff", "C-MOTHERFUCKERS");
      this.teams[sessionTeam2.id] = sessionTeam2;

      this.teamsOrder = new MapSchema();
      this.teamsOrder[1] = sessionTeam1.id;
      this.teamsOrder[2] = sessionTeam2.id;

      const session_config = this;
      this.watchedTeams = onChange(this.teams, function (path, value, previousValue) {
        console.log("SessionConfig::this.teams.onChange");

        session_config.updateCanStart();
      });

      this.canStart = false;

      this.nb_cells = 25;
    }

    updateCanStart() {
      const readyCount = Object.values(this.teams).filter(team => team.ready).length;
      console.log("readyCount:", readyCount);
      this.canStart = readyCount > 1;
    }


    getOrderedTeamsIter() {
      const teamIds = Object.keys(this.teamsOrder).sort().map(ord => this.teamsOrder[ord]);
      return teamIds.map(teamId => this.teams[teamId]);
    }

    joinTeam(playerId, teamId) {
      const sessionPlayer = new SessionPlayer(playerId, teamId);
      this.watchedTeams[teamId].addPlayer(sessionPlayer);
    }

    leaveTeam(playerId, teamId) {
      this.watchedTeams[teamId].removePlayer(playerId);
    }

    admin_setTeamOrder(playerId, teamOrder) {
      //todo
    }

    getPlayersMap() {
      //return Object.values(this.teams)
      return Object.values(this.watchedTeams)

                   //.map(team => team.players)
                   .map(team => team.watchedPlayers)

                   .reduce((acc, playersDict) => {
                     //console.log("acc", acc);
                     //console.log("playersDict", playersDict);

                     //acc.assign(playersDict);
                     Utils.extendObj(acc, playersDict);

                     return acc;
                   }, {});
    }

    getPlayer(playerId) {

      const playersMap = this.getPlayersMap();
      //console.log("playersMap", playersMap);
      const player = playersMap[playerId];
      //console.log("player", player);
      return player;
    }

    setPlayerProperty(playerId, propName, value) {
      const player = this.getPlayer(playerId);
      if(player) {
        console.log("setPlayerProperty", playerId, propName, value);
        player[propName] = value;
      } else {
        console.log("setPlayerProperty", "error", "player not found", playerId);
      }
    }

}
schema.defineTypes(SessionConfig, {
  teams           : {map : SessionTeam},
  teamsOrder      : {map : "string"},

  canStart        : "boolean",

  nb_cells        : "number",
});

exports.SessionConfig = SessionConfig;
