import { Game, Card, Suit } from "./game";

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['spades', 'hearts', 'diams', 'clubs'];

export const Home: React.FC = () => {
  let cards: Card[] = RANKS.flatMap(rank => SUITS.map(suit => ({ rank, suit })));
  cards = cards.sort(() => Math.random() - 0.5);

  return (
    <div className="game-container">
      <Game cards={cards} />
    </div>
  );
}

export default Home;
