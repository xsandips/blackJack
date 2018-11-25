class Card {
	suit: string;
	rank: string;
	value: number;
	
	constructor(rank: string, suit: string) {
		this.rank = rank;
		this.suit = suit;
	
		switch(rank) {
			case 'A':
				this.value = 11;
				break;
			case 'K':
			case 'Q':
			case 'J':
				this.value = 10;
				break;
			default:
				this.value = parseInt(rank);
				break;
		}
	}
	
	
	rankToLongString(): string {
		switch(this.rank){
			case 'J':
				return "Jack";
			case 'Q':
				return "Queen";
			case 'K':
				return "King";
			case 'A':
				return "Ace";
			default:
				return this.value.toString();
		}
	}
	
	
	suitToLongString(): string {
		switch(this.suit){
			case '♥':
				return "Hearts";
			case '♦':
				return "Diamonds";
			case '♠':
				return "Spades";
			case '♣':
				return "Clubs";
			default:
				return this.value.toString();
		}
	}
	

	toString(): string {
		return `${this.rank}${this.suit}`;
	}

	toLongString(): string {
		return `${this.rankToLongString()} of ${this.suitToLongString()}`;
	}
}