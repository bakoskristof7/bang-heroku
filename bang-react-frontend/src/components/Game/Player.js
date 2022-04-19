import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { actionByType } from '../../actions/game';
import Card from './Card';

const Player = ({player, mobile}) => {

    const dispatch = useDispatch();
    const game = useSelector((state) => state.game);

    const imgFileName = player.character.name.split(' ').map(name => name.toLowerCase()).join('_') + '.JPG';
    const image = require('../../img/cards/character/'+ imgFileName )

    const lives = () => {
        let livesToRender = [];

        for (let i = 0; i < player.health; i++) {
            livesToRender.push(<img src={require('../../img/heart.png') } alt="" className={`w-5 h-5 my-1`} key={i}/>);
        }

        return livesToRender;
    }

    const getPlayerRangeByActivePlayer = () => {
        return game.activePlayer.ranges.filter(ranged => ranged.playerName === player.user)[0].rangeFromMe;
    }

    const isInRange = (otherPlayer) => {
        let playerInRanges = game.activePlayer.ranges.find(player => player.playerName === otherPlayer.user && player.rangeFromMe !== 0);
        
        if (playerInRanges === undefined) {
            return false;
        }

        if (game.activePlayer.range >= playerInRanges.rangeFromMe && otherPlayer.health > 0) {
            return true;
        }

        return false;
    }

    if (mobile) {
        return (
            <>
                <div className={`border-2 row-span-3 grid place-content-center ${player.isActive ? 'bg-green-300' : ''} ${player.health === 0 ? 'opacity-25' : ''}`}>   

                    <div className="relative inline-block">
                        <button
                            className={`hover:opacity-90 ${(game.gamePhase === 'ACTION_BANG' && isInRange(player) ? 'animate-wiggle' : '')}`}
                            
                        >
                            <img className="inline-block object-cover w-28 h-28 rounded-full" src={image} alt="Profile image"/>
                        </button>

                        <span className={`font-semibold text-xl absolute -top-0 -right-3 w-10 h-10 border-2 border-black rounded-full grid place-items-center bg-white ${player.isActive ? 'animate-spin bg-orange-300' : ''}`}>{getPlayerRangeByActivePlayer() === 0 ? '🔥' : getPlayerRangeByActivePlayer()}</span>
                        
                        <button 
                        className={`font-semibold text-xl absolute bottom-0 -left-3 w-8 h-10 bg-white border-2 border-orange-900 rounded-md grid place-items-center ${game.gamePhase === 'ACTION_CAT_BALOU' ? 'animate-wiggle' : ''}`}
                        onClick={() => dispatch(actionByType(player, null, getPlayerRangeByActivePlayer()))}
                        >
                            {player.cardsInHand.length}
                        </button>
                    </div>

                    <div className='mt-1 overflow-hidden text-center font-semibold'>{player.user}</div>

                    <div className='grid grid-flow-col place-items-center'> { lives() } </div> 

                </div>

                {
                localStorage.getItem('auth_username') !== player.user ?
                <div className='border-2 row-span-2 flex flex-row overflow-scroll no-scrollbar w-11/12 items-center m-auto'>
                    {player.cardsOnTable.map((card, index) => <Card card={card} player={player} mobile={true} onTheTable={true} key={index} />)}
                </div>
                :
                ''
                }
            </>
        );
    }

    return (
        <>  
            <div className={`${game.playersBeingAttacked.includes(player.user) ? 'animate-bounce' : ''}`}>
                <div className={`border-2 border-orange-400 row-span-3 grid place-content-center`}>   
                    <div className="relative inline-block border-4 m-auto">
                        <button
                            className={`border-2 border-red-500 hover:opacity-90 ${(game.gamePhase === 'ACTION_BANG' && isInRange(player) ? 'animate-wiggle' : '')}`}
                            onClick={() => {
                                if (game.gamePhase === 'ACTION_BANG' && isInRange(player)) {
                                    dispatch(actionByType(player, null, null));
                                }
                            }}
                        >
                            <img className="inline-block object-cover w-16 h-16 2xl:w-24 2xl:h-24 rounded-full" src={image} alt="Profile image"/>
                        </button>

                        <span className={`font-semibold text-xl absolute -top-0 -right-3 w-10 h-10 border-2 border-black rounded-full grid place-items-center bg-white ${player.isActive ? 'animate-spin bg-orange-300' : ''}`}>{getPlayerRangeByActivePlayer() === 0 ? '🔥' : getPlayerRangeByActivePlayer()}</span>
                        
                        <button 
                        className={`font-semibold text-xl absolute bottom-0 -left-3 w-8 h-10 bg-white border-2 border-orange-900 rounded-md grid place-items-center ${(game.gamePhase === 'ACTION_CAT_BALOU' || (game.gamePhase === 'ACTION_PANIC' && getPlayerRangeByActivePlayer() === 1)) && game.activePlayer.user !== player.user ? 'animate-wiggle' : ''}`}
                        onClick={() => {
                            if (game.gamePhase === 'ACTION_CAT_BALOU' || (game.gamePhase === 'ACTION_PANIC' && getPlayerRangeByActivePlayer() === 1) && game.activePlayer.user !== player.user ){
                                dispatch(actionByType(player, null, getPlayerRangeByActivePlayer()))
                            } else { console.log('No action needed to dispatch.')}
                            
                        }}
                        >{player.cardsInHand.length}
                        </button>
                    </div>


                    <div className='grid grid-flow-col place-items-center '>
                    {lives()}
                    </div>

                    <div className='mt-1 overflow-hidden text-center font-semibold text-white'>{player.user}</div>
                    <div className='mt-1 overflow-hidden text-center font-semibold text-white'>{player.role}</div>
                </div>

                {
                localStorage.getItem('auth_username') !== player.user ?
                <div className='border-2 row-span-2 grid grid-flow-col w-11/12 place-items-center m-auto mt-2'>
                        {player.cardsOnTable.map((card, index) => <Card card={card} player={player} range={getPlayerRangeByActivePlayer()} mobile={false} onTheTable={true} key={index} />)}
                </div>
                :
                ''
                }
                    
            </div>
        </>
    )
}

export default Player