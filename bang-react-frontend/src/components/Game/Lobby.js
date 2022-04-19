import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import AddRobotTag from './Lobby/AddRobotTag/AddRobotTag';
import PlayerTag from './Lobby/PlayerTag/PlayerTag';
import { useDispatch, useSelector } from "react-redux";
import { createRobot } from './Robot';
import { initializeGame } from '../../actions/game';
import swal from 'sweetalert';

const Lobby = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const game = useSelector((state) => state.game);

    const [isLoading, setIsLoading] = useState(true);
    const [robotPlaceHolders, setRobotPlaceHolders] = useState([]);

    const checkAuthentication = async () => axios.get('/api/isAuthenticated').then(res => {
        setIsLoading(false);
      });      

      useEffect(() => {
        createRobots();
      }, [game.waitingPlayers.length]);

      useEffect(() => {
        if (game.isPlaying === true) {
          navigate('/game');
        }
      }, [game.isPlaying]);

    //Később szétszedni
    
    window.onbeforeunload = function(){
      return 'Are you sure you want to leave?';
    };

    const createRobots = () => {
      let robots = [];
      for (let i = 0; i < 7 - game.waitingPlayers.length; i++) {
        robots.push({ username : 'Robot', id : game.waitingPlayers.length-i });
      }
      setRobotPlaceHolders(robots);
    }

    useEffect(() => {
        checkAuthentication();
    }, []);

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
        <div className='h-screen flex home justify-center items-center '>
            <div className='w-10/12 rounded-lg border-2 shadow-black shadow-md lobby-background px-16'>

              <div className='my-10 m-auto'>
                <h1 className='bg-orange-900 font-bold text-4xl text-center p-3 text-white rounded-md'> A szoba kódja : {game.waitingPlayers[0]?.roomId ?? 'Generating code..'} </h1>
              </div>

              <div className='grid gap-x-8 gap-y-4 sm:grid-cols-4 lg:grid-cols-7 rounded-lg h-full'>
                {game.waitingPlayers.map(player => <PlayerTag key={player.username} username={player.username} />)}

                {robotPlaceHolders.map(robot => 
                  <AddRobotTag 
                  key={robot.id}
                  username={robot.username}
                  robotId={robot.id}
                  reRenderRobots = {createRobots}
                  />)
                }
              </div>

              <div className='flex justify-center items-center mt-16 mb-8'>
                        <button
                            type='submit'
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
                              if (game.waitingPlayers.length >= 4 && game.waitingPlayers[0].username === localStorage.getItem('auth_username')) {
                                setIsLoading(true);
                                dispatch(initializeGame());
                                navigate('/game');
                              } else {
                                if (game.waitingPlayers[0].username === localStorage.getItem('auth_username')){
                                  swal('Sikertelen!', 'A játék indításához legalább 4 játékos szükséges!', 'warning');
                                } else {
                                  swal('Sikertelen!', 'A játékot csak a játékmester indíthatja!', 'warning');
                                }
                              }
                            } }
                        >
                            Játék indítása
                        </button>
                    </div>

            </div>
        </div>
        </>
    )
}

export default Lobby