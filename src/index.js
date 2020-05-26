import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import './app.css';

// debug console.log REMOVE LATER
const clog = (toLog) => {
  console.log(toLog);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameLen: 0,
      deck: [],
      p1Hand: [],
      p2Hand: []
    };

    // for clog-ing
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

  /**
   * shuffles deck
   */
  shuffleDeck = () => {
    const tempDeck = this.state.deck;
    tempDeck.sort(() => Math.random() - 0.5);
    this.setState(prevState => {
      return {deck: tempDeck};
    });
  }

  /**
   * splits deck
   */
  splitDeck = () => {
    //lose a degree of flexibility
    if (this.state.deck.length) {
      this.shuffleDeck();
      const deckSize = this.state.deck.length;
      const p1Hand = [];
      const p2Hand = [];
      for (let i = 0; i < Math.ceil(deckSize / 2); i++) {
        p1Hand.push(this.state.deck.pop());
        p2Hand.push(this.state.deck.pop());
      }
      //lose a degree of flexibility
      this.setState(prevState => {
        return {
          deck: [],
          p1Hand: p1Hand,
          p2Hand: p2Hand,
        };
      });
    }
  }

  /**
   * plays a turn
   * @return {Number} outcome fo fight {+: p1 win, -: p2 win, 0: impossible (recurse on WAR), NaN: no fight}
   */
  playTurn = () => {
    if (!this.state.p1Hand.length) {
      clog("Game Length: " + this.state.gameLen);
    } else if (!this.state.p2Hand.length) {
      clog("Game Length: " + this.state.gameLen);
    } else {
      const tempP1Hand = this.state.p1Hand;
      const tempP2Hand = this.state.p2Hand;
      const p1play = tempP1Hand.pop();
      const p2play = tempP2Hand.pop();
      let outcome = p1play.compare(p2play);

      clog(p1play + " vs " + p2play);
      if (outcome > 0) {
        //p1 win
        clog("p1 win");
        tempP1Hand.unshift(p1play);
        tempP1Hand.unshift(p2play);
      } else if (outcome < 0) {
        //p2 win
        clog("p2 win");
        tempP2Hand.unshift(p1play);
        tempP2Hand.unshift(p2play);
      } else {
        // it's a tie
        clog("THIS IS WAR");
        //This
        const p1lay1 = tempP1Hand.pop();
        const p2lay1 = tempP2Hand.pop();
        //Is
        const p1lay2 = tempP1Hand.pop();
        const p2lay2 = tempP2Hand.pop();
        //War
        outcome = this.playTurn(); //will handle its own card shifting
        if (outcome > 0) {
          //p1 won war
          clog("p1 win war");
          tempP1Hand.unshift(p1play);
          tempP1Hand.unshift(p2play);
          tempP1Hand.unshift(p1lay1);
          tempP1Hand.unshift(p2lay1);
          tempP1Hand.unshift(p1lay2);
          tempP1Hand.unshift(p2lay2);
        } else if (outcome < 0) {
          //p2 won war
          clog("p2 win war");
          tempP2Hand.unshift(p1play);
          tempP2Hand.unshift(p2play);
          tempP2Hand.unshift(p1lay1);
          tempP2Hand.unshift(p2lay1);
          tempP2Hand.unshift(p1lay2);
          tempP2Hand.unshift(p2lay2);
        }
      }

      this.setState(prevState => {
        return {
          gameLen: prevState.gameLen + 1,
          p1Hand: tempP1Hand,
          p2Hand: tempP2Hand
        }
      });

      clog(outcome);
      return outcome; // cant't return 0
    }

    return Number.NaN;
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
          <button onClick={() => {
            for (let i = 0; i < 5; i++) 
              this.playTurn();
            }
          }>play 5 turns</button>
          <button onClick={() => {
            for (let i = 0; i < 25; i++) 
              this.playTurn();
            }
          }>play 25 turns</button>
        {/* </div> */}
        <Row>
          <Col className="deck">
            <h1>Deck</h1>
            <h3>count: {this.state.deck.length}</h3>
            {this.state.deck.map((card) => {
              return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
            })}
          </Col>
          <Col className="p1hand">
            <h1>Player 1 Hand</h1>
            <h3>count: {this.state.p1Hand.length}</h3>
            {this.state.p1Hand.slice().reverse().map((card) => { // slice reverse rerverses display of list w/o changing contents
              return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
            })}
          </Col>
          <Col className="p2hand">
            <h1>Player 2 Hand</h1>
            <h3>count: {this.state.p2Hand.length}</h3>
            {this.state.p2Hand.slice().reverse().map((card) => {
              return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
            })}
          </Col>
        </Row>
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
    return `${this.colloqNum()} of ${this.suit}`
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