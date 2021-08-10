const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const SessionPlayer = require('./SessionPlayer.js').SessionPlayer;

const onChange = require('on-change');

class SessionTeam extends Schema {
  constructor (id, color, name="") {
      super();
      this.id = id;

      this.color   = color;
      this.name    = name;

      this.roles = new ArraySchema();
      this.roles.push("teller");
      this.roles.push("guesser");

      this.players = new MapSchema();
      this.valid   = false;
      this.ready   = false;


      const team = this;
      //THE DREAM:
      // this.players = onChange(new MapSchema(), function (path, value, previousValue) {
      //   console.log("SessionTeam::this.players.onChange");
      //
      //   team.updateValid();
      //   team.updateReady();
      // });

      const watchedPlayers = onChange(this.players, function (path, value, previousValue) {
        console.log("SessionTeam::this.players.onChange");

      	//console.log('Object changed:', ++i);
      	//console.log('this:', this);

        //console.log('path:', path);
      	//console.log('value:', value);
      	//console.log('previousValue:', previousValue);

        /*
        if(value && !previousValue) {
          console.log("SessionTeam::this.players.onChange", "first player added");

        } else if(!value && previousValue) {
          console.log("SessionTeam::this.players.onChange", "last player removed ?");

        } else if(value && previousValue) {

          const length_prev = Object.values(previousValue).length;
          const length_curr = Object.values(value).length;
          if(length_curr > length_prev) {
            console.log("SessionTeam::this.players.onChange", "player added");

          } else if(length_curr < length_prev) {
            console.log("SessionTeam::this.players.onChange", "playerd removed");

          } else {
            console.log("SessionTeam::this.players.onChange", "same length");
          }

        } else {
          console.log("???");
        }
        */

        team.updateValid();
        team.updateReady();
      });
      this.watchedPlayers = watchedPlayers;

  }

  updateValid() {
    const ok_guesser = Object.values(this.players).some(player => player.role == "teller");
    const ok_teller  = Object.values(this.players).some(player => player.role == "guesser");
    this.valid = ok_guesser && ok_teller;
  }

  updateReady() {
    const ready_guesser = Object.values(this.players).filter(player => player.role == "teller").some(player => player.ready);
    const ready_teller  = Object.values(this.players).filter(player => player.role == "guesser").some(player => player.ready);
    this.ready = ready_guesser && ready_teller;
  }

  addPlayer(gamePlayer) {
    this.watchedPlayers[gamePlayer.id] = gamePlayer;
    //this.updateValid();
  }

  removePlayer(playerId) {
    delete this.watchedPlayers[playerId];
    //this.updateValid();
  }

  getSessionPlayerWithRole(role) {
    const tellers = Object.values(this.players).filter(player => player.role == role);
    let first = tellers.find(e => true);
    return first;
  }

  static create_redTeam() {
    return new SessionTeam("id_red", "red", "red team");
  }

  static create_blueTeam() {
    return new SessionTeam("id_blue", "blue", "blue team");
  }

}

schema.defineTypes(SessionTeam, {
  id      : "string",

  color   : "string",
  name    : "string",

  roles   : [ "string" ],

  players : {map : SessionPlayer},

  valid   : "boolean",
  ready   : "boolean",

});

exports.SessionTeam = SessionTeam;
