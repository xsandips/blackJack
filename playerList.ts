declare function require(name:string);
var Observer = require('observed');

class Player {
	name: string;
	hand: Card[];
	handValue: number;
	
	
	constructor(name:string) {
		this.name = name;
		this.hand = [];
		this.handValue = 0;
	}
	
	
	toString(): string {
		return this.name;
	}
	
	
	handToString(): string {
		var handString = '';
		for (var i = 0; i<this.hand.length; i++) {
			handString += this.hand[i].toString();
			if (i<this.hand.length-1) {
				handString += ', ';
			}
		}
		return handString;
	}
}