import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { addWaitingPlayer, removeWaitingPlayer, setWaitingPlayers, syncState } from '../../actions/game';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';

const JoinRoom = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const [roomId, setRoomId] = useState('');

    const checkAuthentication = async () => axios.get('/api/isAuthenticated').then(res => {
        setIsLoading(false);
      });      

    useEffect(() => {
        checkAuthentication();
    }, []);

    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        if (err.response.status === 401) {
          navigate('/login');
        }
        return Promise.reject(err);
    });


    const handleInputChange = (e) => {
        e.preventDefault();
        setRoomId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.get('/sanctum/csrf-cookie').then(response => {

            const data = {
                playerName : localStorage.getItem('auth_username'),
                roomId : roomId,
                isRobot : false
            }

            axios.post(`api/join-room`, data).then(res => {

                window.channel = window.Echo.join(`Room.Test.${roomId}`)
                .here((users) => {
                    console.log('Here');
                    console.log(users);
                    dispatch(setWaitingPlayers(users));
                })
                .joining((user) => {
                    console.log('joining');
                    console.log(user);
                    dispatch(addWaitingPlayer(user));
                })
                .leaving((user) => {
                    console.log('leaving');
                    console.log(user);
                    dispatch(removeWaitingPlayer(user));
                })
                .listen("StateChanged", (message) => {
                    console.log('Szervertől:', message);
                })
                .listenForWhisper("StateChanged", (message) => {
                    console.log('Klienstől:', message);
                    dispatch(syncState(message));
                });

                console.log('Listening on:'+`presence-Room.Test.${roomId} `);

                navigate('/create');

                //dispatch(addWaitingPlayer(data));

            });

        });

    }

    if (isLoading) {
    return <LoadingAnimation isLoading={isLoading}/>
    }

    return (
        <div className='h-screen flex home'>
            <div className='w-full max-w-md m-auto rounded-lg border-2 shadow-black shadow-md py-5 px-16 form-background'>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3 text-center p-12'>
                        <label 
                        htmlFor ='roomId'
                        className='text-xl font-extrabold'
                        >
                            Szobakód a csatlakozáshoz
                        </label>
                        
                        <input
                            type='roomId'
                            name='roomId'
                            onChange={handleInputChange}
                            value = {roomId}
                            className={`w-full p-2 mt-12 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            id='roomId'
                            placeholder='Szobakód'
                        />
                    </div>
                    <div className='flex justify-center items-center mb-8'>
                        <button
                            type='submit'
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
                        >
                            Csatlakozás
                        </button>
                    </div>
                </form>

                <div className='flex justify-center items-center mb-8'>
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
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Vissza a menübe
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default JoinRoom