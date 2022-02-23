//----------------------------- deck model ----------------------//
// I have based the structure of my model in a model made by Colt Steel in his 
// javaScript codecamp that I have done in Udemy. 
const deckModel = {
    //----------------------------- properties ------------------//
    suits: ['spades', 'clubs', 'diamonds', 'hearts'],
    ranks: ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'],
    deck: [],
    playerHand: [],
    dealerHand: [],

    //--------------------------- methods ------------------------//
    createDeck(number = 1) { // create a deck with n decks inside (normally is played between 1 and 8)
        const { ranks, suits, deck } = this;
        for (let i = 0; i < number; i++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    deck.push({ rank, suit })
                }
            }
        } console.log('Deck created')

    },
    shuffle(times = 10) { // shuffle the deck, making shuffling look like real shuffling is quite complicated 
        const { deck } = this;
        for (let i = 0; i < deck.length * times; i++) {
            let index = Math.floor(Math.random() * (deck.length)) // If I find some fancy function I will change this
            deck.push(deck[index])
            deck.splice(index, 1)
        } console.log('Deck shuffled')
    },
    dealPlayerCards(number = 1) {
        const { deck, playerHand } = this
        for (let i = 0; i < number; i++) {
        let card = deck.pop()
             playerHand.push(card)
            }
        },

    dealDealerCards(number = 1) {
            const { deck, dealerHand } = this
            for (let i = 0; i < number; i++) {
            let card = deck.pop()
            dealerHand.push(card)
            }
        }, 
}

deckModel.createDeck()
deckModel.shuffle()

