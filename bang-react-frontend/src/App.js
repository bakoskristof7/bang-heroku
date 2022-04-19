import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";

import {Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Game from "./components/Game/Game";
import Lobby from "./components/Game/Lobby";
import JoinRoom from "./components/Game/JoinRoom";
import Home from "./components/Game/Home";
import Echo from 'laravel-echo';
import { useEffect } from "react";
import Cookies from "js-cookie";

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;


const App = () => {

  /*
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  */

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return (
          <Routes>

            <Route exact path='/' element={<Home/>}/>

            <Route exact path='login' element={<Login/>}/>

            <Route exact path='register' element={<Register/>}/>

            <Route exact path='create' element={<Lobby/>}/>

            <Route exact path='join' element={<JoinRoom/>}/>

            <Route exact path='game' element={<Game/>}/>

            <Route path='*' element={ <Navigate replace to="/" />
            }/>

          </Routes>
  );
}

export default App;
