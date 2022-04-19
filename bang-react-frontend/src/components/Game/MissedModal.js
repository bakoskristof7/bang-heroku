import React from 'react'
import { useSelector } from 'react-redux';
import Card from './Card';
import MissedModalCard from './MissedModalCard';

const MissedModal = () => {
    const game = useSelector((state) => state.game);

    return (
    <>
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-6 transition-opacity duration-75"
        >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-orange-100 outline-none focus:outline-none">
            {/*header*/}

            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                Meglőttek, térj ki előle ha szeretnél!
                </h3>
            </div>

            {/*body*/}
            <div className="relative p-6 grid-flow-row grid place-content-center">
                <div className='grid grid-flow-col-dense items-center m-auto'>
                {/* Attacked players' missed cards */}
                {game.players.find(player => player.user === localStorage.getItem('auth_username')).cardsInHand.filter(card => card.type === 'missed').map((card, index) => <MissedModalCard card={card} player={localStorage.getItem('auth_username')} mobile={false} key={index}/>)}
                </div>
            </div>

            <div className='grid place-content-center py-4'>
                    <button
                        className={`
                        w-48
                        mt-2
                        p-2
                        rounded-md
                        bang-red-button
                        focus:outline-none 
                        focus:ring 
                        focus:ring-red-300 
                        text-white
                        font-bold
                        border-4
                        border-black
                        `}
                        onClick= { () => {
                            console.log('INKÁBB A GOLYÓ BUTTON.')
                        } }
                    >
                        Lövés elszenvedése
                    </button>
                </div>

            </div>
        </div>
        </div>
        <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
    )
}

export default MissedModal