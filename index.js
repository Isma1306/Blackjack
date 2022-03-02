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
    this.discarded = [];
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
    // I did something simple and at 10 times the deck looks always well mixed
    const { cards } = this;
    for (let i = 0; i < cards.length * times; i++) {
      let index = Math.floor(Math.random() * cards.length);
      cards.push(cards[index]);
      cards.splice(index, 1);
    }
  }

  reshuffle() {
    this.cards = this.cards.concat(this.discarded); // put back the discarded to the pile
    this.discarded = []; // clean discarded array
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
    this.handValue = 0;
    this.isBlackjack = false;
    this.isDealer = isDealer;
    this.divId = "#" + this.divId();
  }

  //---------- player methods
  divId() {
    // create a refence id used later to decide where to render
    let divId;
    if (this.isDealer) {
      divId = "cpu";
    } else {
      divId = "player";
    }
    return divId;
  }

  drawCards(number = 1, deck) {
    // take cards from the deck and put them in the hand
    const { hand } = this;
    let newCards = [];
    for (let i = 0; i < number; i++) {
      let card = deck.cards.pop();
      hand.push(card);
      newCards.push(card);
    }
    this.countHand();
    this.checkBlackjack();
    return newCards; // return the new cards so the gui can render them later
  }

  discardHand(deck) {
    // take the cards from the player's hand and put them back to the deck
    const { hand } = this;
    for (let i = hand.length; i > 0; i--) {
      deck.discarded.push(hand.pop());
    }
  }

  countHand() {
    // update the value of the hand
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
    return handValue;
  }

  checkBlackjack() {
    // check if the player has blackjack
    if (this.hand.length === 2 && this.handValue === 21) {
      return (this.isBlackjack = true);
    } else {
      return (this.isBlackjack = false);
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
    // start the game and send the to the gui
    gui.renderCard(this.player, 2, this.mainDeck);
    gui.renderCard(this.cpu, 1, this.mainDeck);
    if (this.player.checkBlackjack()) {
      this.stand(gui);
    } else {
      gui.btnOn("#hitBtn");
      gui.btnOn("#standBtn");
    }
  }

  dealCards(gui) {
    // discard the hands, take them from the gui too
    this.player.discardHand(this.mainDeck);
    this.cpu.discardHand(this.mainDeck);
    gui.destroyCards();
    if (this.mainDeck.discarded.length >= 26 * this.numOfDecks) {
      this.mainDeck.reshuffle();
    } // check if more than half of the deck is discarded and shuffle both togheter
    gui.renderCard(this.player, 2, this.mainDeck);
    gui.renderCard(this.cpu, 1, this.mainDeck);
    if (this.player.checkBlackjack()) {
      this.stand(gui);
    }
  }

  hit(gui) {
    gui.renderCard(this.player, 1, this.mainDeck);
    this.isBust(gui);
  }

  stand(gui) {
    console.log("stand");
    const { player, cpu } = this;
    while (cpu.countHand() < 17) {
      // dealer take cards until is above 16
      gui.renderCard(cpu, 1, this.mainDeck);
    }
    this.cpu.checkBlackjack();
    // logic that decides the result and send it back to gui so it can render it
    if (player.handValue > cpu.handValue && !player.isBlackjack) {
      gui.renderRestart("win"); // win
      this.player.points = player.points + 20;
    } else if (player.isBlackjack && !cpu.isBlackjack) {
      gui.renderRestart("winBj"); // win with blackjack
      this.player.points = player.points + 30;
    } else if (cpu.isBlackjack && !player.isBlackjack) {
      gui.renderRestart("loseBj"); // lose with blackjack
      this.player.points = player.points - 20;
    } else if (player.handValue < cpu.handValue && cpu.handValue <= 21) {
      gui.renderRestart("lose"); // lose
      this.player.points = player.points - 20;
    } else if (cpu.handValue > 21) {
      gui.renderRestart("cpuBust"); // cpu busted
      this.player.points = player.points + 20;
    } else if (player.handValue === cpu.handValue) {
      gui.renderRestart("tie"); // stand off
    } else if (player.isBlackjack && cpu.isBlackjack) {
      gui.renderRestart("tieBj"); // stand off with blackjack
    }
    gui.renderPoints(player);
  }

  isBust(gui) {
    // check is the player go bust
    if (this.player.countHand() > 21) {
      this.player.points = this.player.points - 20;
      gui.renderPoints(this.player);
      gui.renderRestart("bust"); // bust
    }
  }
}

//----------------------------- render GUI ----------------------//
class Gui {
  constructor() {}
  //---------- gui methods
  renderCard(player, number, deck) {
    // render a card and add padding to spread them
    const { hand } = player;
    const newCards = player.drawCards(number, deck);
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
    console.log(player.points);
    $("#points").text(player.points + " Points left!");
  }

  destroyCards() {
    $(".cardSpace").remove();
  }

  btnOn(id) {
    $(id).prop("disabled", false);
  }

  renderRestart(result) {
    $("#menu").empty();
    $("#restartBtn").show();
    $("#hitBtn").hide();
    $("#standBtn").hide();
    switch (
      result // take the results and generate a "funny" comment about it
    ) {
      case "win":
        $("#menu").append(`<h1 class="win">${game.playerName} won!</h1> <h2>Deep Blue will play the next hand.</h2>`);
        break;
      case "winBj":
        $("#menu").append(`<h1 class="win">${game.playerName} won!</h1> <h2>With Blackjack! Lucky me!</h2>`);
        break;
      case "lose":
        $("#menu").append(`<h1 class="lost">${game.playerName} lost!</h1> <h2>Against five lines of code.</h2>`);
        break;
      case "loseBj":
        $("#menu").append(`<h1 class="lost">The dealer got Blackjack</h1>
        <h2>To be honest ${game.playerName}, it is skill.</h2>`);
        break;
      case "bust":
        $("#menu").append(`<h1 class="lost">${game.playerName} went bust!</h1>
        <h2>The next one is a ${game.player.hand[game.player.hand.length - 1].rank}, Oh! is it too late?</h2>`);
        break;
      case "cpuBust":
        $("#menu").append(`<h1 class="win">The dealer went bust!</h1>
        <h2>${game.cpu.hand[game.cpu.hand.length - 2].rank} and ${game.cpu.hand[game.cpu.hand.length - 1].rank} is...</h2>`);
        break;
      case "tie":
        $("#menu").append(`<h1>Stand-Off</h1> <h2>At least you didn't lose.</h2>`);
        break;
      case "tieBj":
        $("#menu").append(`<h1>Stand-Off</h1> <h2>Two blackjacks at the same time!?</h2>`);
        break;
    }
    $("#menu").show(100);
  }
}

function init() {
  // function containing all the event listeners for the form and the buttons
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
    $("#menu").hide(200);
    game = new Game(name, numberOfDecks);
    gui = new Gui();
    game.start(gui);
    gui.renderPoints(game.player);
  });

  $("#restartBtn").on("click", function () {
    $("#menu").hide(200);
    $("#restartBtn").hide();
    $("#hitBtn").show();
    $("#standBtn").show();
    game.dealCards(gui);
  });
}

//----------------------------- start script ----------------------//
$(init()); // wait for the page to be fully loaded before run the code
