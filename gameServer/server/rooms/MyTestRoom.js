const colyseus = require('colyseus');
const MyTestState  = require('./MyTestState.js').MyTestState;

exports.MyTestRoom = class extends colyseus.Room {

  constructor(presence) {
    super();

    //const state = new MyTestState();
    const state = MyTestState.using_schema2();
    console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

  }

  onCreate (options) {
    console.log("onCreate");
  }

  onJoin (client, options) {
    console.log("onJoin");
  }

  onMessage (client, message) {
    console.log("onMessage");

    //this.state.
  }

  onLeave (client, consented) {
    console.log("onLeave");
  }

  onDispose() {
    console.log("onDispose");
  }

}
