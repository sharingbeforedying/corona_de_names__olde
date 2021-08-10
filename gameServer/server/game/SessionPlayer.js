const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class SessionPlayer extends Schema {
  constructor (id, teamId) {
      super();
      this.id     = id;
      this.teamId = teamId; 

      this.role = null;
      this.ready = false;

      //this.nb_played = 0;
  }
}
schema.defineTypes(SessionPlayer, {
  id        :  "string",
  teamId    :  "string",

  role      : "string",
  ready     : "boolean",

  //nb_played :  "number",
});

exports.SessionPlayer = SessionPlayer;
