//----------------------------- deck model ----------------------//
// I have based the structure of my model in a model made by Colt Steel in his
// javaScript codecamp that I have done in Udemy.
const deckModel = {
  //----------------------------- properties ------------------//
  suits: ["spades", "clubs", "diamonds", "hearts"],
  ranks: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
  deck: [],
  playerCards: [],
  dealerCards: [],
  playerHandValue: 0,
  dealerHandValue: 0,

  //--------------------------- methods ------------------------//
  createDeck(number = 1) {
    // create a deck with n decks inside (normally is played between 1 and 8)
    const { ranks, suits, deck } = this;
    for (let i = 0; i < number; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          deck.push({ rank, suit });
        }
      }
    }
    console.log("Deck created");
  },
  shuffle(times = 10) {
    // shuffle the deck, making shuffling look like real shuffling is quite complicated
    const { deck } = this;
    for (let i = 0; i < deck.length * times; i++) {
      let index = Math.floor(Math.random() * deck.length); // If I find some fancy function I will change this
      deck.push(deck[index]);
      deck.splice(index, 1);
    }
    console.log("Deck shuffled");
  },
  dealPlayerCards(number = 1) {
    const { deck, playerCards } = this;
    for (let i = 0; i < number; i++) {
      let card = deck.pop();
      playerCards.push(card);
    }
  },

  dealDealerCards(number = 1) {
    const { deck, dealerCards } = this;
    for (let i = 0; i < number; i++) {
      let card = deck.pop();
      dealerCards.push(card);
    }
  },

  countPlayerHand() {
    const { playerCards } = this;
    this.playerHandValue = 0;
    playerCards.forEach((card) => {
      let value = card.rank;
      if (value === "K" || value === "J" || value === "Q") {
        this.playerHandValue = this.playerHandValue + 10;
      } else if (!isNaN(value)) {
        this.playerHandValue = this.playerHandValue + value;
      }
    });
    playerCards.forEach((card) => {
      let value = card.rank;
      if (value === "A" && this.playerHandValue + 11 <= 21) {
        this.playerHandValue = this.playerHandValue + 11;
      } else if (value === "A" && this.playerHandValue + 11 > 21) {
        this.playerHandValue = this.playerHandValue + 1;
      }
    });
    console.log(this.playerHandValue);
  },

  countDealerHand() {
    const { dealerCards } = this;
    this.dealerHandValue = 0;
    dealerCards.forEach((card) => {
      let value = card.rank;
      if (value === "K" || value === "J" || value === "Q") {
        this.dealerHandValue = this.dealerHandValue + 10;
      } else if (!isNaN(value)) {
        this.dealerHandValue = this.dealerHandValue + value;
      }
    });
    dealerCards.forEach((card) => {
      let value = card.rank;
      if (value === "A" && this.dealerHandValue + 11 <= 21) {
        this.dealerHandValue = this.dealerHandValue + 11;
      } else if (value === "A" && this.dealerHandValue + 11 > 21) {
        this.dealerHandValue = this.dealerHandValue + 1;
      }
    });
    console.log(this.dealerHandValue);
  },
};

deckModel.createDeck();
deckModel.shuffle();
deckModel.dealPlayerCards(2);
deckModel.countPlayerHand();
deckModel.dealDealerCards(2);
deckModel.countDealerHand();
console.log(deckModel.playerCards);
deckModel.playerHandValue;
console.log(deckModel.dealerCards);
deckModel.dealerHandValue;

function checkhand() {
  let { playerHandValue } = deckModel;
  if (playerHandValue > 21) {
    return console.log("you lost");
  } else if (playerHandValue <= 21) {
    return console.log("keep playing");
  }
}
function hit() {
  deckModel.dealPlayerCards();
  deckModel.countPlayerHand();
  checkhand();
}
function stand() {
  let { playerHandValue, dealerHandValue } = deckModel;
  while (deckModel.dealerHandValue < 17) {
    deckModel.dealDealerCards();
    deckModel.countDealerHand();
  }
  if (playerHandValue < dealerHandValue && dealerHandValue < 21) {
    console.log("you lost");
  } else {
    console.log("you win");
  }
}

// const game = {
//   playerPoints: 100,
//   bet: 10,
//   playerHandValue: 0,
//   dealerHandValue: 0,

// };
