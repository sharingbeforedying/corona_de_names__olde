const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class PersonPlayer extends Schema {
  constructor () {
      super();
      this.id    = "";

      this.name  = "";
      this.image = "";
  }
}
schema.defineTypes(PersonPlayer, {
  id:    "string",
  name:  "string",
  image: "string",
});

exports.PersonPlayer = PersonPlayer;
