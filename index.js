//----------------------------- deck class -------------------------//
// I created a class deck so I can have the methods inside the class and
// the flexibility to use this class even in another game card.
class Deck {
  constructor(numOfDecks) {
    //---------- deck properties
    this.numOfDecks = numOfDecks;
    this.suits = ["♠", "♣", "♦", "♥"];
    this.ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    this.colors = ["red", "black"];
    this.cards = this.createDeck(numOfDecks);

    this.shuffle();
  }

  //---------- deck methods
  createDeck(numOfDecks = 1) {
    // create a deck with n decks inside (normally is played between 1 and 8)
    const { ranks, suits, colors } = this;
    let cards = [];
    for (let i = 0; i < numOfDecks; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          if (suit === "♦" || suit === "♥") {
            cards.push({ rank, suit, color: colors[0] });
          } else {
            cards.push({ rank, suit, color: colors[1] });
          }
        }
      }
    }
    return cards;
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
  restartDeck() {
    this.cards = this.createDeck(this.numOfDecks);
    this.shuffle();
  }
}

//----------------------------- player class ----------------------//
class Player {
  constructor(playerName = "Player", isDealer = false, points = 200) {
    //---------- player attributes
    this.playerName = playerName;
    this.points = points;
    this.hand = [];
    this.isDealer = isDealer;
    this.divId = "#" + this.divId();
  }

  //---------- player methods
  divId() {
    let divId;
    if (this.isDealer) {
      divId = "cpu";
    } else {
      divId = "player";
    }
    return divId;
  }

  drawCards(number = 1, deck) {
    const { hand } = this;
    let newCards = [];
    for (let i = 0; i < number; i++) {
      let card = deck.cards.pop();
      hand.push(card);
      newCards.push(card);
    }
    this.countHand();
    this.checkBlackjack();
    return newCards;
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
    return handValue;
  }

  checkBlackjack() {
    if (this.hand.length === 2 && this.countHand() === 21) {
      return true;
    } else {
      return false;
    }
  }
}

//----------------------------- game class ----------------------//
class Game {
  constructor(playerName = "Player", numOfDecks = 1) {
    //---------- game attributes
    this.playerName = playerName;
    this.numOfDecks = numOfDecks;
    this.mainDeck = new Deck(this.numOfDecks);
    this.cpu = new Player("cpu", true, 0);
    this.player = new Player(this.playerName, false);
  }
  //---------- game methods
  start(gui) {
    gui.renderCard(this.player, this.player.drawCards(2, this.mainDeck));
    gui.renderCard(this.cpu, this.cpu.drawCards(1, this.mainDeck));
    if (this.player.checkBlackjack()) {
      this.stand(gui);
    } else {
      gui.btnOn("hitBtn");
      gui.btnOn("standBtn");
    }
  }
  restart(gui) {
    this.player.discardHand();
    this.cpu.discardHand();
    gui.destroyCards();
    this.mainDeck.restartDeck();
    gui.renderCard(this.player, this.player.drawCards(2, this.mainDeck));
    gui.renderCard(this.cpu, this.cpu.drawCards(1, this.mainDeck));
    if (this.player.checkBlackjack()) {
      this.stand(gui, this.player, this.cpu, this.mainDeck);
    }
  }
  hit(gui) {
    gui.renderCard(this.player, this.player.drawCards(1, this.mainDeck));
    this.isBust(gui);
  }
  stand(gui) { // check this part, decide how to refactor this
    while (this.cpu.countHand() < 17) {
      gui.renderCard(this.cpu, this.cpu.drawCards(1, this.mainDeck));
    }
    const isPlayerBlackjack = this.player.checkBlackjack()
    const playerHand = this.player.countHand()
    const isCpuBlackjack = this.cpu.checkBlackjack()
    const cpuHand = this.cpu.countHand()
    
      if (isPlayerBlackjack && isCpuBlackjack === false) {
      gui.renderRestart("win", isPlayerBlackjack); // win with blackjack
      player.points = player.points + 30;
    } else if ((isPlayerBlackjack && isCpuBlackjack) || playerHand === cpuHand) {
      gui.renderRestart("tie", isPlayerBlackjack); // stand off
    } else if (playerHand < cpuHand && cpuHand <= 21) {
      gui.renderRestart("lose", isPlayerBlackjack); // lost
      player.points = player.points - 20;
    } else {
      gui.renderRestart("win", isPlayerBlackjack); // win
      player.points = player.points + 20;
    }
    gui.renderPoints(player);
  }
  isBust(gui) {
    if (this.player.countHand() > 21) {
      this.player.points = this.player.points - 20;
      gui.renderPoints(player);
      gui.renderRestart("bust", this.player.checkBlackjack()); // bust
    }
  }
}

//----------------------------- render GUI ----------------------//
class Gui {
  constructor() {}
  renderCard(player, newCards) {
    const { hand } = player;
    for (let i = 0; i < newCards.length; i++) {
      let padding = hand.indexOf(newCards[i]) * 30;
      $(`<div class="cardSpace"><div class="card ${newCards[i].color}">
        <div class="cardText"><h3>${newCards[i].rank}<br>${newCards[i].suit}</h3></div>
        <div class="cardSuit">${newCards[i].suit}</div></div></div>`)
        .css("padding-left", padding)
        .appendTo(`${player.divId} .cardHolder`);
    }
    this.renderHandValue(player);
  }

  renderHandValue(player) {
    $(`${player.divId} .handValue h2`).text(player.countHand());
  }

  renderPoints(player) {
    $("#points").text(player.points + " Points left!");
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

  renderRestart(result, isPlayerBlackjack) {
    $("#menu").empty();
    $("#restartBtn").show();
    $("#hitBtn").hide();
    $("#standBtn").hide();
    if (result === "win" && isPlayerBlackjack) {   // maybe I could use switch ?
      $("#menu").append(`<h1>${game.playerName} won!</h1> <h2>With Blackjack! Lucky me!</h2>`);
    } else if (result === "tie" && isPlayerBlackjack) {
      $("#menu").append(`<h1>Stand-Off</h1> <h2>Two blackjacks at the same time!?</h2>`);
    } else if (result === "tie" && !isPlayerBlackjack) {
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
      game.restart(gui);
    });
  }
}

function init() {
  $("#hitBtn").on("click", function () {
    game.hit(gui);
  });

  $("#standBtn").on("click", function () {
    game.stand(gui);
    gui.renderPoints(game.player);
  });

  $("#startForm").on("submit", function (event) {
    event.preventDefault();
    let name = $("#startForm").find("#name").val();
    let numberOfDecks = $("#startForm").find("#numberOfDecks").val();
    $("#menu").hide(300);
    game = new Game(name, numberOfDecks);
    gui = new Gui();
    game.start(gui);
    gui.renderPoints(game.player);
  });
}

$(init());
