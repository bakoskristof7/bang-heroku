import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { initializeGame, nextPlayer, setGamePhase, setIsPlaying, startGame } from '../../actions/game';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import Card from './Card';
import DrawingDeck from './DrawingDeck';
import RoleModal from './RoleModal';
import Player from './Player';
import ThrowingDeck from './ThrowingDeck';
import GeneralStoreModal from './GeneralStoreModal';
import MissedModal from './MissedModal';
import swal from 'sweetalert';

const Game = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const game = useSelector((state) => state.game);

  const [isLoading, setIsLoading] = useState(true);
  const [handOrTable, sethandOrTable] = useState('hand');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showGeneralStoreModal, setShowGeneralStoreModal] = useState(false);
  const [showMissedModal, setShowMissedModal] = useState(false);

  const [currentShownPlayer, setCurrentShownPlayer] = useState(game.players[1])

  //Mobile pager
  const getMobilePlayer = (which) => {
    if (which === 'previous') {

      if (game.players[currentShownPlayer.id-1] /*&& game.players[currentShownPlayer.id-1].user !== localStorage.getItem('auth_username')*/) {
        return game.players[currentShownPlayer.id-1];
      } else {
        return currentShownPlayer;
      }

    }

    if (which === 'next') {

      if (game.players[currentShownPlayer.id+1]) {
        return game.players[currentShownPlayer.id+1];
      } else {
        return currentShownPlayer;
      }

    }


  }

  const checkAuthentication = async () => axios.get('/api/isAuthenticated').then(res => {
      setIsLoading(false);
    });      

  useEffect(() => {
      checkAuthentication();
  }, []);

  useEffect(() => {
    if (game.activePlayer.isRobot && localStorage.getItem('auth_username') === game.gameMaster) {
      console.log('Robot round.');
    }
  }, [game.activePlayer.user]);

  useEffect(() => {
    //RoleModal
    if (game.roles.length !== 0) {
      setShowRoleModal(true);
    } else {
      dispatch(startGame());
    }

  }, [game.roles.length]);

  useEffect(() => {
    //General Store Picking
    if (game.pickCardsFrom.length !== 0) {
      setShowGeneralStoreModal(true);
    } else {
      setShowGeneralStoreModal(false);
    }

  }, [game.pickCardsFrom.length]);

  useEffect(() => {
      if (game.playersBeingAttacked.includes(localStorage.getItem('auth_username'))){
        setShowMissedModal(true);
      } else {
        setShowMissedModal(false);
        //Várakozás a többi játékosra modal ide esetleg !!!!!!!!!!!!!!!!!!!!
      }
  }, [game.playersBeingAttacked.length]);

  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    if (err.response.status === 401) {
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
    return Promise.reject(err);
  });


  if (isLoading) {
    return <LoadingAnimation isLoading={isLoading}/>
  }

  return (
    <>
    <div className='h-screen flex justify-center items-center game-background py-6'>

    {showRoleModal && game.gamePhase === 'CHOOSING_ROLE' ? <RoleModal showModal={showRoleModal} setShowModal={setShowRoleModal} /> : ''}

    {showGeneralStoreModal ? <GeneralStoreModal showModal={showGeneralStoreModal} setShowModal={setShowGeneralStoreModal} /> : ''}

    {showMissedModal ? <MissedModal setShowModal={setShowMissedModal}/> : ''}

      {/*---------------------------- Desktop ------------------------*/}
      <div className='h-full w-5/6 table-background hidden lg:grid lg:grid-rows-3 rounded-full'>

        <div className={`grid grid-flow-col border-2 h-full`}>
          {game.players.slice(1,game.players.length).map((player, index) => <Player player={player} mobile={false} key={index} />)}
        </div>

        <div className="grid grid-cols-12 border-2 border-red-600">

          <div className="border-2 border-yellow-500 col-span-5 m-auto">
            <DrawingDeck mobile={false} />
          </div>

          <div className='grid grid-flow-row-dense col-span-2 place-items-center border-2 border-purple-600'>
            <Player player={game.players[0]} mobile={false} />
            <button
              className={`
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
              onClick={() => 
                {
                  if (game.activePlayer.user === localStorage.getItem('auth_username') || game.activePlayer.isRobot) {
                    if (game.playersBeingAttacked.length === 0) {
                      dispatch(nextPlayer())
                    } else {
                      swal('Pillanat!', 'Játékostársad még reagál a támadásra!', 'warning');
                    }
                  }
                }
              }
          >
              Kör befejezése
            </button>
          </div>

          <div className="border-2 border-yellow-500 col-span-5 m-auto">
            <ThrowingDeck mobile={false} />
          </div>

        </div>

        <div className="grid grid-cols-2 border-2 h-full">

          <div className='border-2 border-green-600 grid place-items-center text-white'>
            <div className='grid grid-flow-col'>
              { game.activePlayer.cardsInHand.map((card, index) => <Card card={card} mobile={false} key={index} onTheTable={false}/>) }
            </div>
          </div>

          <div className='border-2 border-green-600 grid place-items-center text-white'>
            <div className='grid grid-flow-col'>
                { game.activePlayer.cardsOnTable.map((card, index) => <Card card={card} mobile={false} key={index} onTheTable={true}/>) }
            </div>
          </div>

        </div>

      </div>
      {/*---------------------------- Desktop ------------------------*/}

      {/*---------------------------- Mobile ------------------------*/}
      <div className='h-full w-5/6 table-background grid grid-rows-12 rounded-full lg:hidden'>
        
      {showRoleModal ? <RoleModal showModal={showRoleModal} setShowModal={setShowRoleModal} /> : ''}

        <div className="border-2 h-full grid grid-cols-12 row-span-6">
          
          <div className="col-span-2 grid place-items-center">
            <button 
            className={`h-12 text-white font-extrabold text-xl bg-gray-300 bg-opacity-50 rounded-lg`}
            onClick={() => setCurrentShownPlayer(getMobilePlayer('previous')) }
            >
            👈
            </button>
          </div>

          <div className="form-background border-4 border-black rounded-2xl col-span-8 grid grid-rows-5">
            <Player player={currentShownPlayer} mobile={true} />
          </div>

          <div className="col-span-2 grid place-items-center">
            <button 
            className={`h-12 text-white font-extrabold text-xl bg-gray-300 bg-opacity-50 rounded-lg`}
            onClick={() => setCurrentShownPlayer(getMobilePlayer('next'))}
            >
            👉
            </button>
          </div>
        
        
        </div>

        <div className="grid grid-cols-3 border-2 border-red-600">

          <div className="border-2 border-yellow-500 grid place-content-center">
            <DrawingDeck mobile={true} />
          </div>

          <div className='grid place-items-center'>
            <button
              className={`
              mt-2
              p-2
              w-20
              h-20
              rounded-full
              text-center
              bang-red-button
              focus:outline-none 
              focus:ring 
              focus:ring-red-300 
              text-white
              font-bold
              border-4
              border-black
              `}
              onClick={() => 
                {
                  if (game.activePlayer.user === localStorage.getItem('auth_username') || game.activePlayer.isRobot) {
                    if (game.playersBeingAttacked.length === 0) {
                      dispatch(nextPlayer())
                    } else {
                      swal('Pillanat!', 'Játékostársad még reagál a támadásra!', 'warning');
                    }
                  }
                }
              }
          >
              Kör vége
            </button>
          </div>

          <div className="border-2 border-yellow-500 grid place-content-center">
            <ThrowingDeck mobile={true} />
          </div>

        </div>

        <div className="border-2 grid grid-flow-col row-span-2 grid-cols-12 place-items-center">

          <button 
          className={`h-12 text-white font-extrabold text-xl bg-gray-300 bg-opacity-50 rounded-lg ${handOrTable === 'hand' ? 'invisible' : ''}`}
          onClick={() => sethandOrTable('hand')}
          >
          🤲
          </button>

          <div className='flex flex-row overflow-scroll no-scrollbar w-11/12 h-auto justify-items-center items-center text-center col-span-10'>
            { /* game.players.find(player => player.user === localStorage.getItem('auth_username')).cardsInHand.map */
              handOrTable === 'hand' ? 
              game.activePlayer.cardsInHand.map((card, index) => <Card card={card} mobile={true} key={index} onTheTable={false}/>)
              :
              game.activePlayer.cardsOnTable.map((card, index) => <Card card={card} mobile={true} key={index} onTheTable={true}/>)
            }
          </div>

          <button 
          className={`h-12 text-white font-extrabold text-xl bg-gray-300 bg-opacity-50 rounded-lg ${handOrTable === 'table' ? 'invisible' : ''}`}
          onClick={() => sethandOrTable('table')}
          >
          🃏
          </button>

        </div>

      </div>
      {/*--------------------------- Mobile ------------------------------*/}

    </div>
    </>
  )
}

export default Game