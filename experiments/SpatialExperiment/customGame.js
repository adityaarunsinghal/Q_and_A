var _ = require('lodash');
var fs    = require('fs');
var assert = require('assert');
var utils  = require(__base + 'src/sharedUtils.js');
var ServerGame = require('./src/game.js')['ServerGame'];

class ServerRefGame extends ServerGame {
  constructor(config) {
    super(config);
    this.trialList = [];
    this.numRounds = config.numRounds;
    this.firstRole = _.sample(['helper', 'leader']);
    this.trialList = this.makeTrialList(this.firstRole);
  }

  customEvents (socket) {
    console.log('setting events');
    socket.on('endRound', function(data) {
      console.log('round ended...');
      var all = socket.game.activePlayers();
      setTimeout(function() {
	_.map(all, function(p){
	  p.player.instance.emit( 'updateScore', data);
	});
       }, 1000);
      socket.game.newRound(4000);
    });
  }
  
  // *
  // * TrialList creation
  // *
  
  
  sampleMapSequence () {
    var types = _.shuffle([//'catch', 'catch', 'pragmatic', 'pragmatic',
//			   'blocked', 'blocked', 'empty', 'empty',
      'random', 'random', 'random', 'random',
      'random', 'random', 'random', 'random']);
    var otherRole = this.firstRole == 'leader' ? 'helper' : 'leader';
    return _.map(types, (type, i) => {
      return {trialType: type,
	      goal: _.sample(['rows', 'columns']),
	      role: i % 2 == 0 ? this.firstRole : otherRole};
    });
  }

  // Take trialInfo obj and make a map out of it
  constructMap (trialInfo) {
    const gameMap = new GameMap(trialInfo);
    return {underlying: gameMap['underlying'],
	    initRevealed: gameMap['initRevealed'],
	    goal: trialInfo.goal,
	    role: trialInfo.role};
  }

  // Take condition as argument
  // construct context list w/ statistics of condition
  makeTrialList () {
    var trialSequence = this.sampleMapSequence();
    // Construct trial list (in sets of complete rounds)
    for (var i = 0; i < this.numRounds; i++) {
      var world = this.constructMap(trialSequence[i]); 
      this.trialList.push(world);
    };
    return this.trialList;
  };

  onMessage (client,message) {
    //Cut the message up into sub components
    var message_parts = message.split('.');

    //The first is always the type of message
    var message_type = message_parts[0];

    //Extract important variables
    var gc = client.game;
    var id = gc.id;
    var all = gc.activePlayers();
    var target = gc.getPlayer(client.userid);
    var others = gc.getOthers(client.userid);
    switch(message_type) {
    
    case 'question' :
      var code = message_parts[1];
      var msg = ("Is " + code + " safe?");
      _.map(all, function(p){
	p.player.instance.emit( 'chatMessage', {
	  user: client.userid,
	  msg: msg,
	  code: code,
	  sender: message_parts[3],
	  source_role: message_parts[4]
	});
      });
      break;
      
    case 'answer' :
      console.log(message_parts);
      _.map(all, function(p){
	p.player.instance.emit('chatMessage', {
	  user: client.userid,
	  msg: message_parts[1],
	  sender: message_parts[3],
	  source_role: message_parts[4],
	  code: message_parts.slice(5)
	});
      });
      break;

    case 'exitSurvey' :
      console.log(message_parts.slice(1));
      break;
      
    case 'h' : // Receive message when browser focus shifts
      //target.visible = message_parts[1];
      break;
    }
  };

  /*
    Associates events in onMessage with callback returning json to be saved
    {
    <eventName>: (client, message_parts) => {<datajson>}
    }
    Note: If no function provided for an event, no data will be written
  */
  dataOutput () {
    function commonOutput (client, message_data) {
      //var target = client.game.currStim.target;
      //var distractor = target == 'g1' ? 'g0' : 'g1';
      console.log(client.game.currStim);
      return {
	iterationName: client.game.iterationName,
	gameid: client.game.id,
	time: Date.now(),
	workerId: client.workerid,
	assignmentId: client.assignmentid,
	trialNum: client.game.roundNum,
	trialType: client.game.currStim.currGoalType,
	// targetGoalSet: client.game.currStim.goalSets[target],
	// distractorGoalSet: client.game.currStim.goalSets[distractor],
	firstRole: client.game.firstRole
      };
    };
    
    var revealOutput = function(client, message_data) {
      var selections = message_data.slice(3);
      var allObjs = client.game.currStim.hiddenCards;
      return _.extend(
	commonOutput(client, message_data), {
	  sender: message_data[1],
	  timeFromMessage: message_data[2],
	  revealedObjs : selections,
	  numRevealed : selections.length,
	  fullContext: JSON.stringify(_.map(allObjs, v => {
	    return _.omit(v, ['rank', 'suit', 'url']);
	  }))
	});
    };
    

    var exitSurveyOutput = function(client, message_data) {
      var subjInfo = JSON.parse(message_data.slice(1));
      return _.extend(
	_.omit(commonOutput(client, message_data),
	       ['targetGoalSet', 'distractorGoalSet', 'trialType', 'trialNum']),
	subjInfo);
    };
    

    var messageOutput = function(client, message_data) {
      return _.extend(
	commonOutput(client, message_data), {
	  cardAskedAbout: message_data[1],
	  sender: message_data[4],
	  timeFromRoundStart: message_data[3]
	}
      );
    };

    return {
      'chatMessage' : messageOutput,
      'reveal' : revealOutput,
      'exitSurvey' : exitSurveyOutput
    };
  }
}

class GameMap {
  constructor(trialInfo) {
    this.trialType = trialInfo.trialType;
    this.goalType = trialInfo.goal;    

    this.labels = [
      'A1', 'A2', 'A3',
      'B1', 'B2', 'B3', 
      'C1', 'C2', 'C3'
    ];

    // Boards are equivalent w.r.t. reflection, so we 
    // construct assuming row goal and then rotate to get col goal boards
    const transformation = this.goalType == 'rows' ? _.sample([
      x => x,
      x => this.rotate(this.reflect(this.rotate(x)))
    ]) : _.sample([
      x => this.rotate(x),
      x => this.reflect(this.rotate(x)),
    ]);
	  
    this.sampleMap(transformation);
  }
  
  sampleMap (transformation) {
    const grid = (this.trialType == 'catch' ? this.sampleCatch() :
		  this.trialType == 'pragmatic' ? this.samplePragmatic(false) :
		  this.trialType == 'blocked' ? this.samplePragmatic(true) :
		  this.trialType == 'empty' ? this.sampleEmpty() :
		  this.trialType == 'random' ? this.sampleRandom() :
		  console.error('unknown trialType' + this.trialType));
    const initDict = this.matrixToDict(transformation(grid.initRevealed));
    this.initRevealed = _.filter(_.keys(initDict), key => initDict[key] === 'x');
    this.underlying = this.matrixToDict(transformation(grid.underlying));
  }

  matrixToDict (matrix) {
    return _.zipObject(this.labels, _.flatten(matrix));
  }
  
  // We pick 1 of the 3 rows to be initiated,
  // and then ensure that row has no bombs...
  sampleCatch () {
    const rowToReveal = _.sample([0,1,2]);
    let initRevealed = this.allHidden();
    let underlying = this.allBombs();
    initRevealed[rowToReveal][0] = 'x';
    initRevealed[rowToReveal][1] = 'x';    
    underlying[rowToReveal][0] = 'g';
    underlying[rowToReveal][1] = 'g';    
    underlying[rowToReveal][2] = 'g';
    return Math.random() < .5 ? {
      initRevealed, underlying
    } : {
      initRevealed: this.reflect(initRevealed),
      underlying: this.reflect(underlying)
    };
  }

  // For some spice, we randomly sample initializations and stuff
  sampleRandom () {
    let underlying = this.allBombs();
    let clearRow = _.sample([0,1,2]);
    underlying[clearRow][0] = 'g';
    underlying[clearRow][1] = 'g';    
    underlying[clearRow][2] = 'g';
    
    let initRevealed = _.map(underlying, row => {
      return _.map(row, cell => {
	return (cell == 'r' ? 'o' :
		Math.random() < .5 ? 'x' : 'o');
      });
    });

    console.log(initRevealed);
    console.log('allrevealed', this.allRevealed(initRevealed));
    return this.allRevealed(initRevealed) ? this.sampleRandom() :
      Math.random() < .5 ? {
	initRevealed, underlying
      } : {
	initRevealed: this.reflect(initRevealed),
	underlying: this.reflect(underlying)
      };
  }

  // We pick 1 cell to be initiated,
  // and then ensure that row has no bombs...
  samplePragmatic (blocked) {
    const rowToReveal = _.sample([0,1,2]);
    const colToReveal = _.sample([0,1,2]);
    let initRevealed = this.allHidden();
    let underlying = this.allBombs();
    initRevealed[rowToReveal][colToReveal] = 'x';
    if(blocked) {
      const colToBlock = _.sample(_.without([0,1,2], colToReveal));
      const otherCol = _.sample(_.without([0,1,2], colToReveal, colToBlock)); 
      underlying[rowToReveal][colToBlock] = 'r';
      underlying[rowToReveal][colToReveal] = 'g';    
      underlying[rowToReveal][otherCol] = 'g';
      // But ensure this row is safe...
      const otherRow = _.sample(_.without([0,1,2], rowToReveal));
      underlying[otherRow][0] = 'g';
      underlying[otherRow][1] = 'g';    
      underlying[otherRow][2] = 'g';
    } else {
      underlying[rowToReveal][0] = 'g';
      underlying[rowToReveal][1] = 'g';    
      underlying[rowToReveal][2] = 'g';
    }
    return Math.random() < .5 ? {
      initRevealed, underlying
    } : {
      initRevealed: this.reflect(initRevealed),
      underlying: this.reflect(underlying)
    };
  }
  
  sampleEmpty () {
    let initRevealed = this.allHidden();
    let underlying = this.allBombs();
    const rowToBeOkay = _.sample([0,1,2]);
    underlying[rowToBeOkay][0] = 'g';
    underlying[rowToBeOkay][1] = 'g';    
    underlying[rowToBeOkay][2] = 'g';
    return Math.random() < .5 ? {
      initRevealed, underlying
    } : {
      initRevealed: this.reflect(initRevealed),
      underlying: this.reflect(underlying)
    };
  }

  allRevealed(initRevealed) {
    var completeRow = function(grid) {
      return _.some(grid, row => _.every(row, cellName => cellName == 'x'));
    };
    return completeRow(initRevealed) || completeRow(this.rotate(initRevealed));
  }
  
  allHidden() {
    return [
      ['o' ,'o', 'o'],
      ['o', 'o', 'o'],
      ['o', 'o', 'o']
    ];
  }
  
  allBombs() {
    return [
      [this.bomb(), this.bomb(), this.bomb()],
      [this.bomb(), this.bomb(), this.bomb()],
      [this.bomb(), this.bomb(), this.bomb()]
    ];
  }
  
  bomb() {
    return Math.random() < .5 ? 'g' : 'r';
  }

  rotate (grid) {
    return _.zip(...grid);
  }

  reflect (grid) {
    return _.map(grid, row => _.reverse(row.slice()));
  }
}

module.exports = ServerRefGame;
