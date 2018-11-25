

/// <reference path='src/playerList.ts' />
/// <reference path='src/card.ts' />
/// <reference path='src/deck.ts' />
/// <reference path='src/blackjack.ts' />

//Use these to keep state
var game, playerName;


declare function require(name:string);

var inquirer = require('inquirer');
console.log("Hi, welcome !");

var initQuestions = [
  {
    type: "input",
    name: "name",
    message: "What's your name?"
  },
  {
    type: "list",
    name: "game",
    message: "What do you want to play?",
    choices: [
      "Blackjack"
    ]
  }
];

function init() {
  inquirer.prompt( initQuestions, function( answers ) {
    playerName = answers.name;
    console.log(`Alright ${answers.name}, lets play ${answers.game}`);
    switch(answers.game){
  		case "Blackjack":
  			game = new Blackjack;
        break;
  	}
    game.addPlayer(playerName);
    game.start();
  });
}

init();



