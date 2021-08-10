const colyseus = require('colyseus');
const MyState  = require('./MyState.js').MyState;

exports.MyRoom = class extends colyseus.Room {

  constructor(presence) {
    super();
    //this.players = []
    //this.state   = 0

    const state = new MyState();
    console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

  }

  onCreate (options) {
    //console.log("onCreate", options);
    console.log("onCreate");

    //todo:
    //this.state.cmd_room_on_create() //-> admin
  }

  onJoin (client, options) {
    //console.log("onJoin",client,options);
    console.log("onJoin");

    //todo:
    //this.state.cmd_room_on_join() //-> greet
  }

  onMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("onMessage");

    const sessionId = client.sessionId;
    const [command, data] = message;

    console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    //person
    if(command == "person_createPlayer") {
      this.state.cmd_person_createPersonPlayer(sessionId, command, data);
    } else if (command == "person_setPlayerName") {
      this.state.cmd_person_setPersonPlayerName(sessionId, command, data);
    } else if (command == "person_removePlayer") {
      this.state.cmd_person_removePersonPlayer(sessionId, command, data);
    }

    //session
      //session_config
    else if (command == "session_config_joinTeam") {
      this.state.cmd_session_config_joinTeam(sessionId, command, data);
    } else if (command == "session_config_leaveTeam") {
      this.state.cmd_session_config_leaveTeam(sessionId, command, data);
    } else if (command == "session_config_setPlayerReady") {
      this.state.cmd_session_config_setPlayerReady(sessionId, command, data);
    } else if (command == "session_config_setPlayerRole") {
      this.state.cmd_session_config_setPlayerRole(sessionId, command, data);
    }

    else if (command == "session_startGame") {
      this.state.cmd_session_startGame(sessionId, command, data);
    }

    //auto
    else if (command == "auto_role_in_team") {
      this.state.cmd_auto_role_in_team(sessionId, command, data);
    } else if (command == "auto_game") {
      this.state.cmd_auto_game(sessionId, command, data);
    }


    //instance
    else if (command == "instance_teller_submitHint") {
      this.state.cmd_instance_teller_submitHint(sessionId, command, data);
    } else if (command == "instance_guesser_submitCellSelection") {
      this.state.cmd_instance_guesser_submitCellSelection(sessionId, command, data);
    } else if (command == "instance_guesser_submitEndTurn") {
      this.state.cmd_instance_guesser_submitEndTurn(sessionId, command, data);
    }

    else {
      console.log("unknown command:", command);
    }
  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log("onLeave");

    this.state.removePersonPlayerGroup(client.sessionId);
    this.state.updateSessionConfig();

    //todo:
    //this.state.cmd_room_on_leave()  //->tell all someone left + update players + update game config ...
  }

  onDispose() {
    console.log("onDispose");
  }





}
