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
  }

  fillDeck = () => {
    const suits = ["spades", "clubs", "diamonds", "hearts"];
    const cards = [...Array(13).keys()]; //0: ace ... 12: kings
    suits.forEach((suit) => {
      cards.forEach((number) => {
        this.deck.push(new Card(suit, number));
      })
    });
  }

  componentDidMount = () => {
    this.fillDeck();
    clog(this.deck);
  }

  render() {
    return (
      <Container className="woot">
        <h1>This is War</h1>
      </Container>
    )
  }
}

/**
 * POJO - card in a deck
 */
class Card {
  /**
   * creates a card
   * @param {String} suit 
   * @param {Number} num 0: ace ... 12: kings
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
}

ReactDOM.render(<App />, document.getElementById('root'));