//----------------------------- deck class -------------------------//
// I created a class deck so I can have the methods inside the class and
// the flexibility to use this class even in another game card.
class Deck {
  constructor(numOfDecks) {
    //--------------------------- deck properties ---------------------//
    this.numOfdecks = numOfDecks;
    this.suits = ["spades", "clubs", "diamonds", "hearts"];
    this.ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    this.createDeck(numOfDecks);
    this.shuffle();
  }
  //--------------------------- deck methods ------------------------//
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
    //----------------------------- player propieties -----------------//
    this.name = name;
    this.points = points;
    this.hand = [];
  }

  //----------------------------- player methods --------------------//
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

  checkBusted() {
    const { handValue } = this;
    if (handValue > 21) {
      return console.log("you went busted!");
    } else if (handValue <= 21) {
      return console.log("keep playing, what could go wrong?");
    }
  }
  checkBlackjack() {
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

//-----------------------------  game setup --------------------//
const mainDeck = new Deck(1);
const player1 = new Player();
const cpu = new Player("cpu");

//-----------------------------  game actions --------------------//
function start() {
  player1.drawCards(2, mainDeck);
  player1.checkBlackjack();
  cpu.drawCards(1, mainDeck);
}

function restart() {
  player1.discardHand();
  cpu.discardHand();
  mainDeck.createDeck(mainDeck.numOfDecks);
  mainDeck.shuffle();
  start();
}

function hit(player) {
  player.drawCards(1, mainDeck);
  player.checkBusted();
}

function stand() {
  while (cpu.handValue < 17) {
    cpu.drawCards(1, mainDeck);
  }
  cpu.checkBlackjack();
  if (player1.blackjack === true && cpu.blackjack === false) {
    console.log("you won with a Blackjack!");
  } else if ((player1.blackjack === true && cpu.blackjack === true) || player1.handValue === cpu.handValue) {
    console.log("stand-off");
  } else if (player1.handValue < cpu.handValue && cpu.handValue <= 21) {
    console.log("you lost");
  } else {
    console.log("you win");
  }
}

//-----------------------------  game start --------------------//
start();
