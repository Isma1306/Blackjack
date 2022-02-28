//----------------------------- deck class -------------------------//
// I created a class deck so I can have the methods inside the class and
// the flexibility to use this class even in another game card.
class Deck {
  constructor(numOfDecks) {
    //---------- deck properties
    this.numOfdecks = numOfDecks;
    this.suits = ["&spades;", "&clubs;", "&diams;", "&hearts;"];
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
  }
  shuffle(times = 10) {
    // shuffle the deck, making shuffling look like real shuffling is quite complicated
    const { cards } = this;
    for (let i = 0; i < cards.length * times; i++) {
      let index = Math.floor(Math.random() * cards.length); // If I find some fancy function I will change this
      cards.push(cards[index]);
      cards.splice(index, 1);
    }
  }
}

//----------------------------- player class ----------------------//
class Player {
  constructor(name = "Player", points = 200) {
    //---------- player propieties
    this.name = name;
    this.points = points;
    this.hand = [];
  }

  //---------- player methods
  drawCards(number = 1, deck) {
    const { hand, name } = this;
    for (let i = 0; i < number; i++) {
      let card = deck.cards.pop();
      hand.push(card);

      gui.renderCard(name, hand, card);
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
    gui.renderHandValue(this.name, handValue);
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
    cpu.drawCards(1, mainDeck);
    player.isBlackjack();
    if (this.player.blackjack) {
      this.stand();
    } else {
      gui.btnOn("hitBtn");
      gui.btnOn("standBtn");
    }
  }
  restart() {
    this.player.discardHand();
    this.cpu.discardHand();
    gui.destroyCards();
    const mainDeck = new Deck(this.numOfDecks);
    this.mainDeck = mainDeck;
    this.player.drawCards(2, this.mainDeck);
    this.player.isBlackjack();
    this.cpu.drawCards(1, this.mainDeck);
    if (this.player.blackjack) {
      this.stand();
    }
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
      gui.renderRestart("win", this.player.blackjack); // win with blackjack
      this.player.points = this.player.points + 30;
    } else if ((this.player.blackjack === true && this.cpu.blackjack === true) || this.player.handValue === this.cpu.handValue) {
      gui.renderRestart("tie", this.player.blackjack); // stand off
    } else if (this.player.handValue < this.cpu.handValue && this.cpu.handValue <= 21) {
      gui.renderRestart("lose", this.player.blackjack); // lost
      this.player.points = this.player.points - 20;
    } else {
      gui.renderRestart("win", this.player.blackjack); // win
      this.player.points = this.player.points + 20;
    }
    gui.renderPoints();
  }
  isBust(player) {
    if (player.handValue > 21) {
      player.points = this.player.points - 20;
      gui.renderPoints();
      gui.renderRestart("bust", this.player.blackjack); // bust
    }
  }
}

//----------------------------- render GUI ----------------------//
class Gui {
  constructor() {}
  
  renderCard(name, hand, card) {
    let padding = hand.indexOf(card) * 30;
    let divId = "";
    if (name === "cpu") {
      divId = "cpu";
    } else {
      divId = "player";
    }
    $(`<div class="cardSpace"><div class="card">
      <div class="cardText"><h3>${card.rank}<br>${card.suit}</h3></div>
      <div class="cardSuit">${card.suit}</div></div></div>`)
      .css("padding-left", padding)
      .appendTo(`#${divId} .cardHolder`);
    $(".card:contains('♦')").addClass("red");
    $(".card:contains('♥')").addClass("red");
  }

  renderHandValue(name, handValue) {
    let divId;
    if (name === "cpu") {
      divId = "#cpuHandValue";
    } else {
      divId = "#playerHandValue";
    }
    $(divId).text(handValue);
  }

  renderPoints() {
    $("#points").text(game.player.points + " Points left!");
  }

  destroyCards() {
    $(".cardSpace").remove();
  }

  btnOn(id) {
    $("#" + id).prop("disabled", false);
  }

  btnOff(id) {
    $("#" + id).prop("disabled", true);
  }

  renderRestart(result, blackjack) {
    $("#menu").empty();
    $("#restartBtn").show();
    $("#hitBtn").hide();
    $("#standBtn").hide();
    if (result === "win" && blackjack) {
      $("#menu").append(`<h1>${game.playerName} won!</h1> <h2>With Blackjack! Lucky me!</h2>`);
    } else if (result === "tie" && blackjack) {
      $("#menu").append(`<h1>Stand-Off</h1> <h2>Two blackjacks at the same time!?</h2>`);
    } else if (result === "tie" && !blackjack) {
      $("#menu").append(`<h1>Stand-Off</h1> <h2>At least you didn't lose.</h2>`);
    } else if (result === "win") {
      $("#menu").append(`<h1>${game.playerName} won!</h1> <h2>Deep Blue will play the next hand.</h2>`);
    } else if (result === "lose") {
      $("#menu").append(`<h1>${game.playerName} lost!</h1> <h2>Against five lines of code.</h2>`);
    } else if (result === "bust") {
      $("#menu").append(`<h1>${game.playerName} went bust!</h1> <h2>The next one is a ${game.player.hand[game.player.hand.length - 1].rank}, Oh! is it too late?</h2>`);
    }
    $("#menu").show(200);

    $("#restartBtn").on("click", function () {
      $("#menu").hide(200);
      $("#restartBtn").hide();
      $("#hitBtn").show();
      $("#standBtn").show();
      game.restart();
    });
  }
}

function init() {
  $("#hitBtn").on("click", function () {
    game.hit();
  });

  $("#standBtn").on("click", function () {
    game.stand();
    gui.renderPoints();
  });

  $("#startForm").on("submit", function (event) {
    event.preventDefault();
    let name = $("#startForm").find("#name").val();
    let numberOfDecks = $("#startForm").find("#numberOfDecks").val();
    $("#menu").hide(300);
    game = new Game(name, numberOfDecks);
    gui = new Gui();
    game.start();
    gui.renderPoints();
  });
}

init();

//----------------------------- circleType code -----------------//
const rulesBj = new CircleType(document.getElementById("rulesBj"));
rulesBj.radius(400).dir(-1);
const rulesDealer = new CircleType(document.getElementById("rulesDealer"));
rulesDealer.radius(500).dir(-1);
