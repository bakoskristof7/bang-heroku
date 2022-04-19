import React from 'react'
import { useSelector } from 'react-redux';
import GeneralStoreModalCard from './GeneralStoreModalCard';

const GeneralStoreModal = ({setShowModal, showModal, mobile}) => {

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
                    Zsibvásár, {game.activePlayer.user} választ!
                  </h3>
                </div>

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className='row-span-2 grid grid-flow-col-dense items-center m-auto'>
                    {game.pickCardsFrom.map((card, index) => <GeneralStoreModalCard card={card} mobile={false} setShowModal={setShowModal} activePlayer={game.activePlayer} key={index}/>)}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
    )  
}

export default GeneralStoreModal