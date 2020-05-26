import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import './app.css';

const clog = (toLog) => {
  console.log(toLog);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: [],
    };
    this.fillDeck();
    this.p1Hand = [];
    this.p2Hand = [];

    this.temp = true;
  }

  /**
   * fills the dek with 52 base cards (no joker, sorry)
   */
  fillDeck = () => {
    const tempDeck = [];
    const suits = ['spades', 'clubs', 'diamonds', 'hearts'];
    const cards = [...Array(13).keys()]; //0: two ... 12: ace
    suits.forEach((suit) => {
      cards.forEach((number) => {
        tempDeck.push(new PlayingCard(number, suit));
      })
    });
    this.setState(prevState => {
      return {deck: tempDeck};
    });
  }

  shuffleDeck = () => {
    const tempDeck = this.state.deck;
    tempDeck.sort(() => Math.random() - 0.5);
    this.setState(prevState => {
      return {deck: tempDeck};
    });
  }

  splitDeck = () => {
    this.shuffleDeck();
    const deckSize = this.state.deck.length;
    for (let i = 0; i < Math.ceil(deckSize / 2); i++) {
      this.p1Hand.push(this.state.deck.pop());
      this.p2Hand.push(this.state.deck.pop());
    }
    //ingores flexibility
    this.setState(prevState => {
      return {deck: []};
    });
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

    return (
      <Container>
        {/* <div className='woot'> */}
          <h1>This is War</h1>
          <button onClick={this.fillDeck}>fill deck</button>
          <button onClick={this.shuffleDeck}>shuffle deck</button>
          <button onClick={this.splitDeck}>split deck</button>
          <button onClick={this.playTurn}>play turn</button>
        {/* </div> */}
        <div className="deck">
          {this.state.deck.map((card) => {
            return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
          })}
        </div>
        {/* <div className="p1hand">
          <PlayingCardDisplay />
        </div>
        <div className="p2hand">
          <PlayingCardDisplay />
        </div> */}
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
   * @param {Number} num 0: two ... 12: ace
   * @param {String} suit 
   */
  constructor(num, suit) {
    this.colloquialNumbers = [2,3,4,5,6,7,8,9,10,"jack","queen","king","ace"];
    this.num = num;
    this.suit = suit;
  }

  /**
   * battle. +: this win; 0: tie; -:this lose
   * @param {Card} other 
   */
  compare(other) {
    return this.num - other.num;
  }

  colloqNum = () => {
    return this.colloquialNumbers[this.num];
  }

  toString = () => {
    return `${this.colloqNum} of ${this.suit}`
  }
}

const PlayingCardDisplay = (props) => {
  const {num, suit} = props;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{num}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">of {suit}</Card.Subtitle>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the bulk of
          the card's content.
        </Card.Text> */}
      </Card.Body>
    </Card>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));