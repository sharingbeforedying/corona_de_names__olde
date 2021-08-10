const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const PersonPlayer = require("./PersonPlayer.js").PersonPlayer;

class PersonPlayerGroup extends Schema {
  constructor () {
      super();

      this.players = new MapSchema();
  }
}
schema.defineTypes(PersonPlayerGroup, {
  players: { map : PersonPlayer },
});
exports.PersonPlayerGroup = PersonPlayerGroup;
