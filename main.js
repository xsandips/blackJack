var Observer = require('observed');
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.hand = [];
        this.handValue = 0;
    }
    Player.prototype.toString = function () {
        return this.name;
    };
    Player.prototype.handToString = function () {
        var handString = '';
        for (var i = 0; i < this.hand.length; i++) {
            handString += this.hand[i].toString();
            if (i < this.hand.length - 1) {
                handString += ', ';
            }
        }
        return handString;
    };
    return Player;
})();
var Card = (function () {
    function Card(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        switch (rank) {
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
    Card.prototype.rankToLongString = function () {
        switch (this.rank) {
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
    };
    Card.prototype.suitToLongString = function () {
        switch (this.suit) {
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
    };
    Card.prototype.toString = function () {
        return "" + this.rank + this.suit;
    };
    Card.prototype.toLongString = function () {
        return this.rankToLongString() + " of " + this.suitToLongString();
    };
    return Card;
})();
/// <reference path="card.ts"/>
var Deck = (function () {
    function Deck() {
        this.cards = [];
        this.currentCardIndex = 0;
        for (var i = 0; i < 13; i++) {
            for (var s = 0; s < 4; s++) {
                this.cards.push(new Card(Deck.RANKS[i], Deck.SUITS[s]));
            }
        }
        this.shuffle(5);
    }
    Deck.prototype.shuffle = function (times) {
        for (var i = 0; i < (times || 1); i++) {
            this.cards.sort(function () { return (0.5 - Math.random()); });
        }
    };
    Deck.prototype.printAll = function () {
        this.cards.forEach(function (card) {
            console.log(card.toString());
        });
    };
    Deck.prototype.draw = function () {
        if (this.currentCardIndex == this.cards.length - 1) {
            this.shuffle();
            this.currentCardIndex = 0;
        }
        return this.cards[this.currentCardIndex++];
    };
    Deck.SUITS = ['♥', '♦', '♠', '♣'];
    Deck.RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return Deck;
})();
/// <reference path="playerList.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AIDealer = (function (_super) {
    __extends(AIDealer, _super);
    function AIDealer(name) {
        _super.call(this, name || 'The Dealer');
    }
    return AIDealer;
})(Player);
/// <reference path="playerList.ts"/>
/// <reference path="aidealer.ts"/>
/// <reference path="deck.ts"/>
var CardGame = (function () {
    function CardGame() {
        this.players = [];
        this.deck = new Deck();
        this.currentPlayerIndex = 1;
        this.players.push(new AIDealer());
    }
    CardGame.prototype.deal = function (numberOfCards) {
        for (var i = 0; i < (numberOfCards || 2); i++) {
            for (var p = 0; p < this.players.length; p++) {
                this.draw();
                this.incrementTurn();
            }
        }
    };
    CardGame.prototype.draw = function () {
        var card = this.deck.draw();
        this.players[this.currentPlayerIndex].hand.push(card);
    };
    CardGame.prototype.addPlayer = function (name) {
        this.players.push(new Player((name || "Player " + (this.players.length + 1))));
    };
    CardGame.prototype.printAllHands = function () {
        this.players.forEach(function (player) {
            console.log(player.name + "'s hand:");
            player.hand.forEach(function (card) {
                console.log(card.toString());
            });
        });
    };
    CardGame.prototype.clearHands = function () {
        for (var p = 0; p < this.players.length; p++) {
            this.players[p].hand = [];
            this.players[p].handValue = 0;
        }
    };
    CardGame.prototype.incrementTurn = function () {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex === this.players.length) {
            this.currentPlayerIndex = 0;
        }
    };
    return CardGame;
})();
/// <reference path="playerList.ts"/>
/// <reference path="aidealer.ts"/>
/// <reference path="deck.ts"/>
/// <reference path="cardgame.ts"/>
var inquirer = require('inquirer');
var Blackjack = (function (_super) {
    __extends(Blackjack, _super);
    function Blackjack() {
        _super.call(this);
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
    Blackjack.prototype.turnPrompt = function () {
        var turn = this;
        inquirer.prompt(this.turnQuestions, function (answers) {
            switch (answers.turn) {
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
    };
    Blackjack.prototype.roundPrompt = function () {
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
        ], function (answers) {
            switch (answers.keepPlaying) {
                case 'Yes':
                    game.clearHands();
                    game.start();
                    break;
                case 'No':
                    console.log('Thanks for playing. See you next time!');
                    break;
            }
        });
    };
    Blackjack.prototype.start = function () {
        this.currentPlayerIndex = 1;
        this.deal(2);
        this.printInitState();
        this.evaluateState();
    };
    Blackjack.prototype.quit = function () {
        console.log('Goodbye!');
    };
    Blackjack.prototype.hit = function () {
        this.draw();
        this.printLastDraw();
        console.log("Your hand value is now: " + this.players[this.currentPlayerIndex].handValue);
        this.evaluateState();
    };
    Blackjack.prototype.stay = function () {
        this.incrementTurn();
        this.evaluateState();
    };
    Blackjack.prototype.fold = function () {
        console.log("You folded. Better luck next time!");
        this.players[this.currentPlayerIndex].hand = [];
        this.players[this.currentPlayerIndex].handValue = this.calHandValue(this.players[this.currentPlayerIndex].hand);
        this.evaluateState();
    };
    Blackjack.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.players[this.currentPlayerIndex].handValue = this.calHandValue(this.players[this.currentPlayerIndex].hand);
    };
    Blackjack.prototype.evaluateState = function () {
        var winner = new Player("No One"), draw = false;
        if (this.currentPlayerIndex === 0) {
            console.log("The dealer reveals " + this.players[0].handToString());
            while (this.players[0].handValue < 16) {
                this.draw();
                this.printLastDraw();
                if (this.players[0].handValue > 21) {
                    console.log('The Dealer busted!');
                    this.players[0].handValue = 0;
                    break;
                }
            }
            this.players.forEach(function (player) {
                if (player.handValue > winner.handValue) {
                    winner = player;
                    draw = false;
                }
                else if (player.handValue === winner.handValue) {
                    draw = true;
                }
            });
            if (draw) {
                console.log("This round was a draw.");
            }
            else {
                console.log(winner.name + " won the round with " + winner.handValue + ".");
            }
            this.roundPrompt();
        }
        else {
            if (this.players[this.currentPlayerIndex].handValue === 21) {
                console.log('Blackjack!');
                this.currentPlayerIndex++;
                this.roundPrompt();
            }
            else if (this.players[this.currentPlayerIndex].handValue > 21) {
                console.log('Busted! You lose that one.');
                this.players[this.currentPlayerIndex].handValue = 0;
                this.currentPlayerIndex++;
                this.roundPrompt();
            }
            else {
                this.turnPrompt();
            }
        }
    };
    Blackjack.prototype.calHandValue = function (cards) {
        var value = 0;
        cards.forEach(function (card) {
            value += card.value;
            if (card.rank == 'A' && value > 21) {
                value -= 10;
            }
        });
        return value;
    };
    Blackjack.prototype.printInitState = function () {
        this.printDealerState();
        this.printPlayerState(1);
    };
    Blackjack.prototype.printDealerState = function () {
        console.log("The dealer has " + this.players[0].hand[0].toString() + " showing");
    };
    Blackjack.prototype.printPlayerState = function (playerIndex) {
        console.log("Your hand is: " + this.players[playerIndex].handToString());
        console.log("Your hand value is now: " + this.players[playerIndex].handValue);
    };
    Blackjack.prototype.printLastDraw = function () {
        console.log(this.players[this.currentPlayerIndex].name + " drew " + this.players[this.currentPlayerIndex].hand[this.players[this.currentPlayerIndex].hand.length - 1]);
    };
    return Blackjack;
})(CardGame);

/// <reference path='src/playerList.ts' />
/// <reference path='src/card.ts' />
/// <reference path='src/deck.ts' />
/// <reference path='src/blackjack.ts' />
var game, playerName;
var inquirer = require('inquirer');
console.log("Hi, welcome to the casino!");
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
    inquirer.prompt(initQuestions, function (answers) {
        playerName = answers.name;
        console.log("Alright " + answers.name + ", lets play " + answers.game);
        switch (answers.game) {
            case "Blackjack":
                game = new Blackjack;
                break;
        }
        game.addPlayer(playerName);
        game.start();
    });
}
init();
