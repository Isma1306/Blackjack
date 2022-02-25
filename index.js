//----------------------------- deck class -------------------------//
// I created a class deck so I can have the methods inside the class and
// the flexibility to use this class even in another game card.
class Deck {
  constructor(numOfDecks) {
//---------- deck properties
    this.numOfdecks = numOfDecks;
    this.suits = ["spades", "clubs", "diamonds", "hearts"];
    this.ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    this.createDeck(numOfDecks);
    this.shuffle();
  }

//---------- deck methods
  createDeck(numOfDecks = 1) {
    // create a deck with n decks inside (normally is played between 1 and 8)
    const { ranks, suits } = this;
    let cards = [];
    for (let i = 0; i < numOfDecks; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          cards.push({ rank, suit });
        }
      }
      this.cards = cards;
    }
    console.log("Deck created");
  }
  shuffle(times = 10) {
    // shuffle the deck, making shuffling look like real shuffling is quite complicated
    const { cards } = this;
    for (let i = 0; i < cards.length * times; i++) {
      let index = Math.floor(Math.random() * cards.length); // If I find some fancy function I will change this
      cards.push(cards[index]);
      cards.splice(index, 1);
    }
    console.log("Deck shuffled");
  }
}

//----------------------------- player class ----------------------//
class Player {
  constructor(name = "Player1", points = 200) {
//---------- player propieties
    this.name = name;
    this.points = points;
    this.hand = [];
  }

//---------- player methods
  drawCards(number = 1, deck) {
    const { hand } = this;
    for (let i = 0; i < number; i++) {
      let card = deck.cards.pop();
      hand.push(card);
    }
    this.countHand();
  }
  discardHand() {
    const { hand } = this;
    for (let i = hand.length; i > 0; i--) {
      hand.pop();
    }
  }

  countHand() {
    const { hand } = this;
    let handValue = 0;
    hand.forEach(function (card) {
      let rank = card.rank;
      if (rank === "K" || rank === "J" || rank === "Q") {
        handValue = handValue + 10;
      } else if (!isNaN(rank)) {
        handValue = handValue + rank;
      }
    });
    hand.forEach(function (card) {
      let rank = card.rank;
      if (rank === "A" && handValue + 11 <= 21) {
        handValue = handValue + 11;
      } else if (rank === "A" && handValue + 11 > 21) {
        handValue = handValue + 1;
      }
    });
    this.handValue = handValue;
    console.log(handValue);
  }

  isBlackjack() {
    const { handValue, hand } = this;
    let blackjack;
    if (hand.length === 2 && handValue === 21) {
      blackjack = true;
    } else {
      blackjack = false;
    }
    this.blackjack = blackjack;
    return blackjack;
  }
}

//----------------------------- game class ----------------------//
class Game {
  constructor(playerName = "Player", numOfDecks) {
//---------- game propieties
    this.playerName = playerName;
    this.numOfDecks = numOfDecks;
  }
//---------- game methods
  start() {
    const mainDeck = new Deck(this.numOfDecks);
    this.mainDeck = mainDeck;
    const cpu = new Player("cpu");
    this.cpu = cpu;
    const player = new Player(this.playerName);
    this.player = player;
    player.drawCards(2, mainDeck);
    player.isBlackjack();
    cpu.drawCards(1, mainDeck);
  }
  restart() {
    this.player.discardHand();
    this.cpu.discardHand();
    const mainDeck = new Deck(this.numOfDecks);
    this.mainDeck = mainDeck;
    this.player.drawCards(2, this.mainDeck);
    this.player.isBlackjack();
    this.cpu.drawCards(1, this.mainDeck);
  }
  hit() {
    this.player.drawCards(1, this.mainDeck);
    this.isBust(this.player);
  }
  stand() {
    while (this.cpu.handValue < 17) {
      this.cpu.drawCards(1, this.mainDeck);
    }
    this.cpu.isBlackjack();
    if (this.player.blackjack === true && this.cpu.blackjack === false) {
      console.log("you won with a Blackjack!");
      this.player.points = this.player.points + 20 * 1.5;
    } else if ((this.player.blackjack === true && this.cpu.blackjack === true) || this.player.handValue === this.cpu.handValue) {
      console.log("stand-off");
    } else if (this.player.handValue < this.cpu.handValue && this.cpu.handValue <= 21) {
      console.log("you lost");
      this.player.points = this.player.points - 20;
    } else {
      console.log("you win");
      this.player.points = this.player.points + 20;
    }console.log(this.player.points)
  }
  isBust(player) {
    if (player.handValue > 21) {
      return console.log("you went bust!");
    } else if (player.handValue <= 21) {
      return console.log("keep playing, what could go wrong?");
    }
  }
}

//----------------------------- controls? class? ----------------------//
$('#hitButton').on('click', function() {
  game.hit()
})

$('#standButton').on('click', function() {
  game.stand()
})
$('#startForm').on('submit', function(event) {
  event.preventDefault();
let name = $('#startForm').find('#name').val()
let numberOfDecks = $('#startForm').find('#numberOfDecks').val()
  game = new Game(name, numberOfDecks);
game.start()
})
//----------------------------- game start ----------------------//





// const circleType = new CircleType(document.getElementById('rules'));
// circleType.radius(200).dir(-1);