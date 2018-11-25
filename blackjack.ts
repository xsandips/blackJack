/// <reference path="playerList.ts"/>
/// <reference path="aidealer.ts"/>
/// <reference path="deck.ts"/>
/// <reference path="cardgame.ts"/>
declare function require(name:string);
var inquirer = require('inquirer');

class Blackjack extends CardGame {
	turnQuestions: Object[];
	
	
	constructor() {
		super();
		this.turnQuestions = [
			{
			    type: "list",
			    name: "turn",
			    message: "What do you want to do?",
			    choices: [
			      "Hit",
			      "Stay",
			      "Fold"
			    ]
			}
		];
	}
	
	
	turnPrompt() {
		var turn = this;
		inquirer.prompt( this.turnQuestions, function( answers ) {
			switch(answers.turn){
				case 'Hit':
					turn.hit();
					break;
				case 'Stay':
					turn.stay();
					break;
				case 'Fold':
					turn.fold();
					break;
			}
		});	
	}
	

	roundPrompt() {
		var game = this;
		inquirer.prompt([
			{
			    type: "list",
			    name: "keepPlaying",
			    message: "Do you want to keep playing?",
			    choices: [
			      "Yes",
			      "No"
			    ]
			}
		], function(answers){
			switch(answers.keepPlaying){
				case 'Yes':
					game.clearHands();
					game.start();
					break;
				case 'No':
					console.log('Thanks for playing. See you next time!');
					break;
			}
		});
	}
	
	
	start() {
		this.currentPlayerIndex = 1;
		this.deal(2);
		this.printInitState();
		this.evaluateState();
	}

	quit() {
		console.log('Goodbye!');
	}
	
	
	hit() {
		this.draw();
		this.printLastDraw();
		console.log(`Your hand value is now: ${this.players[this.currentPlayerIndex].handValue}`);
		this.evaluateState();
	}
	
	
	stay() {
		this.incrementTurn();
		this.evaluateState();
	}
	

	fold() {
		console.log("You folded. Better luck next time!");
		this.players[this.currentPlayerIndex].hand = [];
		this.players[this.currentPlayerIndex].handValue = this.calHandValue(this.players[this.currentPlayerIndex].hand);
		this.evaluateState();
	}
	
	
	draw() {
		super.draw();
		this.players[this.currentPlayerIndex].handValue = this.calHandValue(this.players[this.currentPlayerIndex].hand);
	}

	evaluateState() {
		var winner = new Player("No One"), draw = false;
		// If turns have gone back around to the dealer
		if (this.currentPlayerIndex === 0) {
			// The dealer takes his actions
			console.log(`The dealer reveals ${this.players[0].handToString()}`);
			while (this.players[0].handValue < 16) {
				this.draw();
				this.printLastDraw();
				if(this.players[0].handValue > 21) {
					console.log('The Dealer busted!');
					this.players[0].handValue = 0;
					break;
				}
			}
			// Then check for a winner
			this.players.forEach(function(player){
				if (player.handValue > winner.handValue) {
					winner = player;
					draw = false;
				}
				else if(player.handValue === winner.handValue) {
					draw = true;
				}
			});
			if(draw) {
				console.log(`This round was a draw.`);	
			}
			else {
				console.log(`${winner.name} won the round with ${winner.handValue}.`);
			}
			this.roundPrompt();
		} else {
			if (this.players[this.currentPlayerIndex].handValue === 21) {
				console.log('Blackjack!');
				this.currentPlayerIndex++;
				this.roundPrompt();
			} 
			else if (this.players[this.currentPlayerIndex].handValue > 21) {
				console.log('Busted! You lose that one.');
				this.players[this.currentPlayerIndex].handValue = 0;
				this.currentPlayerIndex++;
				//TODO: needs to be modified to support more players
				this.roundPrompt();
			} else {
				this.turnPrompt();
			}
		}
	}
	
	
	calHandValue(cards:Card[]): number {
		var value = 0;
		cards.forEach(function(card){
			value += card.value;
			if(card.rank == 'A' && value > 21) {
				value -= 10;
			}
		});
		return value;
	}
	
	
	printInitState() {
		
		this.printDealerState();
		this.printPlayerState(1);
	}
	
	
	printDealerState() {
		console.log(`The dealer has ${this.players[0].hand[0].toString()} showing`);
	}
	

	printPlayerState(playerIndex:number) {
		
		console.log(`Your hand is: ${this.players[playerIndex].handToString()}`);
		console.log(`Your hand value is now: ${this.players[playerIndex].handValue}`);
	}
	
	
	printLastDraw() {
		console.log(`${this.players[this.currentPlayerIndex].name} drew ${this.players[this.currentPlayerIndex].hand[this.players[this.currentPlayerIndex].hand.length-1]}`);
	}
}