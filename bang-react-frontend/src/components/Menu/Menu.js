import React, { useEffect, useState } from 'react'
import MenuItem from './MenuItem/MenuItem';
import { addPlayer, addWaitingPlayer, removeWaitingPlayer, setPageState, setWaitingPlayers, syncState } from '../../actions/game';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from "pusher-js";
import Cookies from 'js-cookie';
import game from '../../reducers/game';

const Menu = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const game = useSelector((state) => state.game);

    const createRoom = () => {  

        axios.get('/sanctum/csrf-cookie').then(response => {

            const data = {
                username : localStorage.getItem('auth_username'),
                token : localStorage.getItem('auth_token')
            }

            axios.post(`api/create-room`, data).then(res => {

                window.channel = window.Echo.join(`Room.Test.${res.data.roomId}`)
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
                    console.log('Szerver:', message);
                })
                .listenForWhisper("StateChanged", (message) => {
                    console.log('Kliens:', message);
                    dispatch(syncState(message));
                });

                console.log('Listening on:'+`presence-Room.Test.${res.data.roomId} `);

                navigate('/create');

            });

        });

    }

    const joinRoom = () => {
        navigate('/join');
    }

    return (
        <>
            <div className='menu w-screen h-screen flex justify-center items-center'>
                <div className='w-96 h-96 flex flex-col justify-center items-center'>
                    
                    <MenuItem 
                    text="Játék létrehozása" 
                    createRoom={createRoom}
                    />
                    
                    <MenuItem 
                    text="Csatlakozás szobához" 
                    joinRoom={joinRoom}
                    />

                    <MenuItem 
                    text="Szabályzat" 
                    //displayRules = {showRules}
                    />

                </div>
            </div>
        </>
    )
}

export default Menu