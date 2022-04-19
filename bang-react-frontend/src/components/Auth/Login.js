import axios from 'axios';
import Cookies from 'js-cookie';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Logo from '../../img/bang-logo.png'

const Login = () => {

    const navigate = useNavigate();
    //Pusher.logToConsole = true;

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/');
        }
    }, []);

    const [loginData, setLoginInput] = useState({
        email : '',
        password : '',
        errors : []
    });

    const handleInputChange = (e) => {
        e.preventDefault();
        setLoginInput({...loginData, [e.target.name] : e.target.value});
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = {
            email : loginData.email,
            password : loginData.password
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/login`, data).then(res => {
                switch (res.data.status) {
                    case 200 : {
                        localStorage.setItem('auth_token', res.data.token);
                        localStorage.setItem('auth_username', res.data.username);
                        //swal("Siker!", res.data.message, "success");


                        let token = res.data.token;

                        console.log('TOKEN: ', token);

                        axios.get('api/user').then(({ data }) => {

                            console.log('Logged in user data:', data);
                            console.log('Cookie I send is:', Cookies.get('XSRF-TOKEN'));

                          window.Echo = new Echo({
                            broadcaster: "pusher",
                            key: "bangKey",
                            wsHost: "127.0.0.1",
                            wsPort: 6001,
                            forceTLS: false,
                            cluster: "eu",
                            disableStats: true,
                            csrfToken: Cookies.get('XSRF-TOKEN'),
                            authorizer: (channel, options) => {
                              console.log('options:', options);
                              return {
                                authorize: (socketId, callback) => {
                                  axios({
                                    method: "POST",
                                    url: "http://127.0.0.1:8000/api/broadcasting/auth",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      //Accept : 'application/json',
                                      //'csrf-token': Cookies.get('XSRF-TOKEN')
                                    },
                                    data: {
                                      socket_id: socketId,
                                      channel_name: channel.name,
                                    },
                                  })
                                    .then((response) => {
                                      callback(false, response.data);
                                    })
                                    .catch((error) => {
                                      callback(true, error);
                                    });
                                },
                              };
                            },
                          });
                            /*            
                            window.Echo.private(`Room.Test.1`).listen("StateChanged", (message) => {
                                console.log(message);
                            });
                            */
                        });


                        navigate('/');
                        break;
                    }

                    case 401 : {
                        swal("Hiba!", res.data.message, "warning");
                        break;
                    }

                    default : setLoginInput({...loginData, errors : res.data.errors});
                }

            });
        });
    };

    return (
        <div 
        className='h-screen flex home'
        >
            <div 
            className='w-full max-w-md m-auto rounded-lg border-2 shadow-black shadow-md py-5 px-16 form-background'
            >
                <div className='text-2xl font-medium mt-4 mb-10 text-center'>
                    <img 
                    src={Logo} 
                    alt="" 
                    className='w-3/4 m-auto' />
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className='mb-3'>
                        <label 
                        htmlFor ='email'
                        className='text-l font-extrabold'
                        >
                            Email
                        </label>
                        
                        <input
                            type='email'
                            name='email'
                            onChange={handleInputChange}
                            value = {loginData.email}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            id='email'
                            placeholder='Email cím'
                        />
                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { loginData.errors ? loginData.errors.email ?? '' : ''}
                        </span>
                    </div>

                    <div>
                        <label 
                        htmlFor ='password'
                        className='text-l font-extrabold'
                        >
                            Jelszó
                        </label>
                        <input
                            type='password'
                            name='password'
                            onChange={handleInputChange}
                            value = {loginData.password}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            id='password'
                            placeholder='Jelszó'
                        />
                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { loginData.errors ? loginData.errors.password ?? '' : ''}
                        </span>
                    </div>

                    <div className='flex justify-center items-center mt-6 mb-8'>
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
                        >
                            Bejelentkezés
                        </button>
                    </div>

                    <div className='text-center text-l'>
                        <span className='mb-2'>Még nincs fiókod?</span>
                        <Link 
                        to='/register'
                        className='font-semibold hover:text-orange-700'
                        > Regisztrálj itt!</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;