import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import './app.css';
import PlayingCard, { PlayingCardDisplay } from './playingCardNeeds'

// debug console.log REMOVE LATER
const clog = (toLog) => {
  console.log(toLog);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: '',
      gameLen: 0,
      cheater: false,
      deck: [],
      p1Hand: [],
      p2Hand: []
    };
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
      return {
        gameState: '',
        gameLen: 0,
        cheater: false,
        deck: tempDeck,
        p1Hand: [],
        p2Hand: []
      };
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
   * shuffles your hand
   */
  shuffleHand = () => {
    const tempDeck = this.state.p1Hand;
    tempDeck.sort(() => Math.random() - 0.5);
    this.setState(prevState => {
      return {p1Hand: tempDeck};
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
    if (!this.state.p1Hand.length || !this.state.p2Hand.length) {
      return Number.NaN;
    }
    //assume both players have cards
    let tempP1Hand = this.state.p1Hand;
    let tempP2Hand = this.state.p2Hand;
    const p1play = tempP1Hand.pop();
    const p2play = tempP2Hand.pop();
    let outcome = p1play.compare(p2play);

    clog(p1play + ' vs ' + p2play);
    if (outcome > 0) {
      //p1 win
      clog('p1 win');
      tempP1Hand.unshift(p1play);
      tempP1Hand.unshift(p2play);
    } else if (outcome < 0) {
      //p2 win
      clog('p2 win');
      tempP2Hand.unshift(p1play);
      tempP2Hand.unshift(p2play);
    } else {
      // it's a tie
      clog('THIS IS WAR');
      if (tempP1Hand.length < 3) { //p1 is too poor to war
        tempP2Hand.unshift(p1play);
        tempP2Hand.unshift(p2play);
        tempP2Hand = tempP2Hand.concat(tempP1Hand);
        tempP1Hand = [];
      } else if (tempP2Hand.length < 3) { //p2 is too poor to war
        tempP1Hand.unshift(p1play);
        tempP1Hand.unshift(p2play);
        tempP1Hand = tempP1Hand.concat(tempP2Hand);
        tempP2Hand = [];
      } else {
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
          clog('p1 win war');
          tempP1Hand.unshift(p1play);
          tempP1Hand.unshift(p2play);
          tempP1Hand.unshift(p1lay1);
          tempP1Hand.unshift(p2lay1);
          tempP1Hand.unshift(p1lay2);
          tempP1Hand.unshift(p2lay2);
        } else if (outcome < 0) {
          //p2 won war
          clog('p2 win war');
          tempP2Hand.unshift(p1play);
          tempP2Hand.unshift(p2play);
          tempP2Hand.unshift(p1lay1);
          tempP2Hand.unshift(p2lay1);
          tempP2Hand.unshift(p1lay2);
          tempP2Hand.unshift(p2lay2);
        }
      }
    }

    if (!tempP1Hand.length) {
      clog('Game Length: ' + this.state.gameLen);
      this.setState((prevState) => {
        return {gameState: 'the app wins'}
      })
      this.recordScore();
    } else if (!tempP2Hand.length) {
      clog('Game Length: ' + this.state.gameLen);
      this.setState((prevState) => {
        return {gameState: 'you win'}
      })
      this.recordScore();
    } else {
      this.setState(prevState => {
        return {
          gameLen: prevState.gameLen + 1,
          p1Hand: tempP1Hand,
          p2Hand: tempP2Hand
        }
      });
    }
    
    clog(outcome);
    return outcome; // cant't return 0
  }

  recordScore = () => {
    if (!this.state.cheated) {
      
    }
  }

  render() {
    //how to make this run once?

    return (
        <Container>
          <Row className="justify-content-md-center">
            <h1>THIS IS WAR</h1>
          </Row>
          <Row className="justify-content-md-center">
            <Button
              onClick={this.fillDeck}
              variant="secondary" >fill deck</Button>
            <Button
              onClick={this.splitDeck}
              variant="secondary"> split deck</Button>
          </Row>
          <Row className="justify-content-md-center">
            <OverlayTrigger
              placement="left"
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip id="button-tooltip">
                  Sometimes the game get's stuck in a loop (due to the nature of the game)
                </Tooltip>
              } >
              <Button
                variant="success"
                onClick={this.shuffleHand} >
                shuffle hand
              </Button>
            </OverlayTrigger>
            <Button
              onClick={this.playTurn}
              variant='primary' >play turn</Button>
            <Button
              onClick={() => {
                for (let i = 0; i < 5; i++) {
                  this.playTurn();
                }
              }}
              variant='primary' >play 5 turns</Button>
            <Button
              onClick={() => {
                for (let i = 0; i < 25; i++) {
                  this.playTurn();
                }
              }}
              variant='primary' >play 25 turns</Button>
            <Button
              onClick={() => {
                for (let i = 0; i < 100; i++) {
                  this.playTurn();
                }
              }}
              variant='primary' >play 100 turns</Button>
          </Row>
          <Row className="justify-content-md-center">
            <h1 style={{color: "green"}}>{this.state.gameState}</h1>
          </Row>
          <Row className="justify-content-md-center">
            <h3 style={{color: "red"}}>{this.state.cheater && "you cheated. your score will not be recorded"}</h3>
          </Row>
          <Row className="justify-content-md-center">
            <Col className='deck'>
              <h1>Deck</h1>
              <h3>count: {this.state.deck.length}</h3>
              {this.state.deck.map((card) => {
                return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
              })}
            </Col>
            <Col className='p1hand'>
              <h1>Your Hand</h1>
              <h3>count: {this.state.p1Hand.length}</h3>
              {this.state.p1Hand.slice().reverse().map((card) => { // slice reverse rerverses display of list w/o changing contents
                return <PlayingCardDisplay num={card.colloqNum()} suit={card.suit}/>
              })}
            </Col>
            <Col className='p2hand'>
              <h1>The App's Hand</h1>
              <h3>count: {this.state.p2Hand.length}</h3>
              {this.state.p2Hand.slice().reverse().map((card) => {
                return <PlayingCardDisplay num={
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id="button-tooltip">
                        {card.colloqNum()}
                      </Tooltip>
                    } >
                    <Button
                      variant="success"
                      onClick={() => {
                        this.setState(prev => {
                          return {cheater: true};
                        });
                      }} >Click to Cheat</Button>
                  </OverlayTrigger>
                } suit={card.suit}/>
              })}
            </Col> 
          </Row>
        </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));