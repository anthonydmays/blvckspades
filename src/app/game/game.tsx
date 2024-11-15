'use client';

import React, { useState, useEffect } from 'react';

import './game.css';
import Card from './card/card';

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS: Suit[] = ['spades', 'hearts', 'diams', 'clubs'];

type Suit = 'spades' | 'hearts' | 'diams' | 'clubs';

type Card = {
  suit: Suit;
  rank: string;
};

export default function Game() {

  let cards: Card[] = RANKS.flatMap(rank => SUITS.map(suit => ({ rank, suit })));
  cards = cards.sort(() => Math.random() - 0.5);
  const playerHandCards = cards.slice(0, 5);
  cards = cards.slice(5);

  const [flipped, setFlipped] = useState([false, false, false]);
  const [pool, setPool] = useState(cards);
  const [playerHand, setPlayerHand] = useState(playerHandCards);
  const [spadesBroken, setSpadesBroken] = useState<boolean>(false);
  const [wonTricks, setWonTricks] = useState<number>(0);

  const chooseThreeCards = () => {
    // Discard first three cards from the pool
    let pendingPool = pool.slice(3);

    // Choose the first three cards of the same suit from the pool
    const firstNonTrumpCard = pendingPool.find(({suit}) => suit !== 'spades');
    let trickCards: Card[] = [];

    if (firstNonTrumpCard) {
      const matchingIndices = pendingPool.map(({suit}, i) => suit === firstNonTrumpCard.suit ? i : -1);
      const firstThreeMatchingIndices = matchingIndices.filter(index => index !== -1).slice(0, 3);
      trickCards = firstThreeMatchingIndices.map(index => pendingPool[index]);
      pendingPool = pendingPool.filter((_, i) => !firstThreeMatchingIndices.includes(i));
    } 
    
    if(pool.length < 3) {
      trickCards = pendingPool.slice(0, 3);
      pendingPool = pendingPool.splice(3);
    }

    setPool([...trickCards, ...pendingPool]);
    setFlipped([false, false, false]);

    flipped.forEach((_, index) =>
      setTimeout(() => {
        setFlipped((prev) => {
          const newFlipped = [...prev];
          newFlipped[index] = true;
          return newFlipped;
        });
      }, index * 500) // Adjust the delay as needed
    );
  };

  const canPlayCard = (
    playerHand: Card[],
    playedCard: Card,
    leadSuit: Suit,
    spadesBroken: boolean
  ): boolean => {
    const {suit, rank} = playedCard;

    // Rule 1: If leadSuit is null (first card of the trick), allow any card
    if (leadSuit === null) {
        // Can't lead spades unless they're broken, or you only have spades
        if (suit === "spades" && !spadesBroken && playerHand.some(({suit}) => suit !== "spades")) {
            return false;
        }
        return true;
    }

    // Rule 2: If the player has a card in the lead suit, they must play it
    if (playerHand.some(({suit}) => suit === leadSuit)) {
        return suit === leadSuit;
    }

    // Rule 3: If the player doesn't have the lead suit, they can play any card
    return true;
  };

  const determineTrickWinner = (trickCards: Card[]) => {
    const rankOrder: Record<string, number> = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    const leadSuit = trickCards[0].suit;

    // Filter cards into trump and lead suit categories
    const trumpCards = trickCards.filter(({suit}) => suit === "spades");
    const leadSuitCards = trickCards.filter(({suit}) => suit === leadSuit);

    // Determine the highest card
    if (trumpCards.length > 0) {
        // If there are trump cards, the highest trump wins
        return trumpCards.reduce((highest, card) =>
            rankOrder[card.rank] > rankOrder[highest.rank] ? card : highest
        );
    } else if (leadSuitCards.length > 0) {
        // Otherwise, the highest card in the lead suit wins
        return leadSuitCards.reduce((highest, card) =>
            rankOrder[card.rank] > rankOrder[highest.rank] ? card : highest
        );
    } else {
        // Fallback (shouldn't occur in normal play)
        return null;
    }
  }

  const choosePlayerCard = (index: number): void => {
    const playedCard = playerHand[index];
    let tricksWon = wonTricks;

    if (!canPlayCard(playerHand, playedCard, pool[0].suit, spadesBroken)) {
      alert('You must follow suit!');
      return;
    }

    if (playerHand[index].suit === 'spades') {
      setSpadesBroken(true);
    }

    const trickCards = [pool[0], pool[1], pool[2], playedCard];
    const winningCard = determineTrickWinner(trickCards);
    
    if (winningCard === playedCard) {
      tricksWon++;
      setWonTricks(tricksWon);
      alert('Player wins the trick!');
    }

    setPlayerHand(playerHand.filter((_, i) => i !== index));

    if (playerHand.length > 1) {
      chooseThreeCards();
    } else {
      // Deploy the algorithm!!!
      fetch(`/api?wonTricks=${tricksWon}`);
    }
  };
  
  useEffect(() => {
    chooseThreeCards();
  }, []);

  return (
      <div>
        <span>Tricks won: {wonTricks}</span>
        <div className="playingCards simpleCards">
          {flipped.map((isFlipped, index) => (
              <Card suit={pool[index]?.suit} rank={pool[index]?.rank} isFlipped={isFlipped} key={index} />
          ))}
        </div>
        <div className="playingCards simpleCards rotateHand">
          {playerHand.map((card, index) => (
              <Card suit={card.suit} rank={card.rank} isFlipped={true} key={index} onClick={() => choosePlayerCard(index)} />
          ))}
        </div>
      </div>
  )
}