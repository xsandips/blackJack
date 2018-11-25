/// <reference path="card.ts"/>

class Deck {
	static SUITS = ['♥', '♦', '♠', '♣'];
    static RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	
	cards: Card[];
	currentCardIndex: number;
	
	
	constructor() {
		this.cards = [];
		this.currentCardIndex = 0;
		for (var i = 0; i < 13; i++) {
			for (var s = 0; s < 4; s++) {
				this.cards.push(new Card(Deck.RANKS[i], Deck.SUITS[s]));
			}
		}
		this.shuffle(5);
	}
	
	
	shuffle(times?:number) {
		for (var i = 0; i < (times||1); i++) {
			this.cards.sort(function() { return (0.5 - Math.random()); });
		}
	}
	
	
	printAll() {
		this.cards.forEach(function(card: Card){
			console.log(card.toString());
		});
	}
	
	
	draw(): Card{
		if (this.currentCardIndex == this.cards.length-1) {
			this.shuffle();
			this.currentCardIndex = 0;
		}
		return this.cards[this.currentCardIndex++];
	}
}