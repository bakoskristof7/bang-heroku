import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { actionByType, actionCardEffect } from '../../actions/game';
import swal from 'sweetalert';

const Card = ({card, mobile, onTheTable, player, range}) => {

    const dispatch = useDispatch();
    const game = useSelector((state) => state.game);


    let image = '', cardName;

    if (card !== undefined && card.type !== undefined && card.pattern !== undefined && card.number !== undefined) {
        cardName = card.type + '-' + card.pattern + '-' + card.number + '.JPG';
        image = require('../../img/cards/action/'+ cardName );
    } else {
        console.log('NINCS KÁRTYA, UNDEFINED');
    }

    return (
            <img 
            src={image} 
            alt="" 
            className=
            {`${mobile && onTheTable ? 'w-14 border-2 border-white sm:w-24 rounded-xl ' : 'w-20 border-2 sm:w-24 md:w-32 rounded-xl -mr-4 ' } ${!mobile ? 'hover:scale-150 hover:translate-y-3.5 transition-all w-48' : ''}`}
            onClick={ () => { 
                if (game.activePlayer.user === localStorage.getItem('auth_username') || game.activePlayer.isRobot ) {
                    if (!onTheTable) {
                        if (game.gamePhase === 'ACTION' ){
                            dispatch(actionCardEffect(card))
                        } else {
                            swal('Nem-nem!', 'Előbb be kell fejezned a jelenlegi játékfázist!', 'warning');
                        }
                    } else {
                        dispatch(actionByType(player, card, range))
                    }
                }
            } }
            />  
    )
}

export default Card