import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

const clog = (toLog) => {
  console.log(toLog);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0
    };
    this.deck = [];
    this.fillDeck();
    this.p1Hand = [];
    this.p2Hand = [];

    this.temp = true;
  }

  /**
   * fills the dek with 52 base cards (no joker, sorry)
   */
  fillDeck = () => {
    const suits = ["spades", "clubs", "diamonds", "hearts"];
    const cards = [...Array(13).keys()]; //0: two ... 12: ace
    suits.forEach((suit) => {
      cards.forEach((number) => {
        this.deck.push(new PlayingCard(suit, number));
      })
    });
  }

  shuffleDeck = () => {
    this.deck.sort(() => Math.random() - 0.5);
  }

  splitDeck = () => {
    this.shuffleDeck();
    const deckSize = this.deck.length;
    for (let i = 0; i < Math.ceil(deckSize / 2); i++) {
      this.p1Hand.push(this.deck.pop());
      this.p2Hand.push(this.deck.pop());
    }
  }

  playTurn = () => {
    if (!this.p1Hand.length) {
      //p1 loses
    } else if (!this.p2Hand.length) {
      //p2 loses
    } else {
      const p1play = this.p1Hand.pop();
      const p2play = this.p2Hand.pop();
      clog(p1play.toString());
      clog(p2play.toString());
      console.log(p1play.compare(p2play));
    }
  }

  render() {
    //how to make this run once?
    if (this.temp) {
      this.temp = false;
      clog(this.deck);
      this.shuffleDeck();
      clog(this.deck);
      this.splitDeck();
      clog(this.p1Hand);
      clog(this.p1Hand);
    }

    return (
      <Container className="woot">
        <h1>This is War</h1>
        <button onClick={this.playTurn}>play turn</button>
      </Container>
    )
  }
}

/**
 * POJO - card in a deck
 */
class PlayingCard {
  /**
   * creates a card
   * @param {String} suit 
   * @param {Number} num 0: two ... 12: ace
   */
  constructor(suit, num) {
    this.suit = suit;
    this.num = num;
  }

  /**
   * battle. +: this win; 0: tie; -:this lose
   * @param {Card} other 
   */
  compare(other) {
    return this.num - other.num;
  }

  toString = () => {
    return `${this.num + 2} of ${this.suit}`
  }
}

ReactDOM.render(<App />, document.getElementById('root'));