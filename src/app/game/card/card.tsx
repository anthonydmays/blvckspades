import Image from "next/image";
import { FunctionComponent, useEffect, useState } from "react";

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
    const [rankValue, setRankValue] = useState<string>('');
    const [suitValue, setSuitValue] = useState<string>('');

    useEffect(() => {
        setRankValue(rank ?? '');
        setSuitValue(suit ?? '');
    }, []);

    suit = suit || '';
    return isFlipped ? (
        <div onClick={onClick}>
            <Image src={`/standard-deck/${suitValue}/${rankValue}${suitValue[0]}.png`} alt="Card back" width={158} height={220} />
        </div>
    ) : (
        <div className="">
            <Image src="/standard-deck/back.png" alt="Card back" width={158} height={220} />
            &nbsp;
        </div>
    );
}

export default Card;