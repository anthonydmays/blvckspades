'use client';

import { FunctionComponent } from "react";

export type CardProps = {
    onClick?: () => void;
    rank?: string;
    suit?: string;
    isFlipped?: boolean;
}

const getHtmlEntity = (suit?: string) => {
    switch (suit) {
        case 'spades':
            return <>&spades;</>;
        case 'hearts':
            return <>&hearts;</>;
        case 'diams':
            return <>&diams;</>;
        case 'clubs':
            return <>&clubs;</>;
        default:
            return '';
    }
};

export const Card: FunctionComponent<CardProps> = ({rank, suit, isFlipped, onClick}) => {
    return isFlipped ? (
        <div className={"card rank-" + rank + " " + suit} onClick={onClick}>
            <span className="rank">{rank}</span>
            <span className="suit">{getHtmlEntity(suit)}</span>
        </div>
    ) : (
        <div className="card back">
            &nbsp;
        </div>
    );
}

export default Card;