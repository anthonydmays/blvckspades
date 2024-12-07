import Image from "next/image";
import { FunctionComponent } from "react";

export type CardProps = {
    onClick?: () => void;
    rank?: string;
    suit?: string;
    isFlipped?: boolean;
}

export const Card: FunctionComponent<CardProps> = ({rank, suit, isFlipped, onClick}) => {
    return isFlipped ? (
        <Image className={"card"} onClick={onClick} src={`/standard-deck/${suit}/${rank}${suit![0]}.png`} alt={`${rank} of ${suit}`} width={168} height={234} />
    ) : (
        <Image className={"card back"}  src={`/standard-deck/back.png`} alt={`${rank} of ${suit}`} width={168} height={234} />
    );
}

export default Card;