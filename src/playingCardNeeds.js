/**
 * This file is for all of your playing card needs
 */
import React from 'react'

import Card from 'react-bootstrap/Card';

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
    this.colloquialNumbers = [2,3,4,5,6,7,8,9,10,'jack','queen','king','ace'];
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
        <Card.Subtitle className='mb-2 text-muted'>of {suit}</Card.Subtitle>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the bulk of
          the card's content.
        </Card.Text> */}
      </Card.Body>
    </Card>
  )
}

export default PlayingCard;
export { PlayingCardDisplay };