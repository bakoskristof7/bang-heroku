import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { draw } from '../../actions/game';
import game from '../../reducers/game';

const DrawingDeck = ({mobile}) => {

    const dispatch = useDispatch();
    const image = require('../../img/cards/back-2.JPG');
    const game = useSelector((state) => state.game);

    return (
            <img 
            src={image} 
            alt="" 
            className={`w-24 border-2 md:w-32 rounded-xl -mr-4 ${!mobile ? 'hover:scale-110 hover:translate-y-3.5 transition-all w-48 rotate-2' : ''}`}
            onClick={ () => {
                if (game.activePlayer.user === localStorage.getItem('auth_username') || game.activePlayer.isRobot) {
                    dispatch(draw({from : 'DECK'}))
                }
            } }
            />  
    )
}

export default DrawingDeck