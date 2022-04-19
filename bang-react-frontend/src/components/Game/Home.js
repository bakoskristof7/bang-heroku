import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Menu from '../Menu/Menu';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const Home = () => {

  const navigate = useNavigate();

  const state = useSelector((state) => state);

  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = async () => axios.get('/api/isAuthenticated').then(res => {
    setIsLoading(false);
  });

  const logOut = async (e) => {
    e.preventDefault();
    axios.post('api/logout').then(res => {
      if (res.status === 200) {
        localStorage.removeItem('auth_token', res.data.token);
        localStorage.removeItem('auth_username', res.data.username);
      } 
      navigate('/login');

      return () => {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    //socket.connect();
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
    {localStorage.getItem('auth_token') && (<button type='button' className='font-bold' onClick={ (e)=> {
      logOut(e);
      window.Echo.disconnect();
    }}
      >Kijelentkezés Gomb</button>) }
    <Menu />
    </>
  )
}

export default Home;