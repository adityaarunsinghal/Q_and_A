var ClientGame = require('./game.js')['ClientGame'];
var _ = require('lodash');

window.onload = function(){
  var customConfig = require('../config.json');
  var customEvents = require('../game.client.js');
  
  var game = new ClientGame(customConfig, customEvents);
  game.listen();
};

