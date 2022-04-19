import React from 'react'
import { useSelector } from 'react-redux';

const ThrowingDeck = ({mobile}) => {

    const game = useSelector((state) => state.game);

    const card = game.throwingDeck.length !== 0 ? game.throwingDeck[game.throwingDeck.length-1] : null;

    const cardName = card ? (card.type + '-' + card.pattern + '-' + card.number + '.JPG') : '';

    const image = cardName ? require('../../img/cards/action/' + cardName) : '';

    return (
            <img 
            src={image} 
            alt="" 
            className={`w-20 border-2 sm:w-24 md:w-32 rounded-xl -mr-4 ${!mobile ? 'hover:scale-110 hover:translate-y-3.5 transition-all w-48 -rotate-2' : ''}`}
            onClick={ () => console.log('ThrowingDeck Click') }
            />  
    )
}

export default ThrowingDeck