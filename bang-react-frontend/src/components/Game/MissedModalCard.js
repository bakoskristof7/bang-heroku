import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { actionCardEffect } from '../../actions/game';

const MissedModalCard = ({card, mobile, player}) => {
    const dispatch = useDispatch();
    const game = useSelector((state) => state.game);

    const cardName = card.type + '-' + card.pattern + '-' + card.number + '.JPG';
    const image = require('../../img/cards/action/'+ cardName );

    return (
            <img 
            src={image} 
            alt="" 
            className={`px-1 w-20 sm:w-24 md:w-32 rounded-xl mx-2 ${!mobile ? 'hover:rotate-1 hover:translate-y-4 transition-all w-48' : ''}`}
            onClick={() => { 
                dispatch(actionCardEffect(card, player));
            }}
            />  
    )
}

export default MissedModalCard