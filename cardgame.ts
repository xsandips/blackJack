/// <reference path="playerList.ts"/>
/// <reference path="aidealer.ts"/>
/// <reference path="deck.ts"/>

class CardGame {
	players: Player[];
	deck: Deck;
	currentPlayerIndex: number;
	

	constructor() {
		this.players = [];
		this.deck = new Deck();
		this.currentPlayerIndex = 1;
		this.players.push(new AIDealer());
	}
	
	
	deal(numberOfCards?:number) {
		for (var i = 0; i < (numberOfCards||2); i++) {
			for (var p = 0; p < this.players.length; p++) {
				this.draw();
				this.incrementTurn();
			}
		}
	}
	
	
	draw(){
		var card = this.deck.draw();
		this.players[this.currentPlayerIndex].hand.push(card);
	}
	
	
	addPlayer(name?:string) {
		this.players.push(new Player((name||`Player ${this.players.length+1}`)));
	}
	
	
	printAllHands() {
		this.players.forEach(function(player){
			console.log(`${player.name}'s hand:`);
			player.hand.forEach(function(card){
				console.log(card.toString());
			});
		});	
	}
	
	
	clearHands() {
		for (var p = 0; p < this.players.length; p++) {
			this.players[p].hand = [];
			this.players[p].handValue = 0;
		}
	}
	
	
	incrementTurn() {
		this.currentPlayerIndex++;
		if (this.currentPlayerIndex === this.players.length) {
			this.currentPlayerIndex = 0;
		}
	}
}