import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../img/bang-logo.png'

const Register = () => {


    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/');
        }
    }, []);


    const [registerData, setRegisterData] = useState({
        email : '',
        username: '',
        password : '',
        password_confirmation: '',
        errors : []
    });

    const handleInputChange = (e) => {
        setRegisterData({...registerData, [e.target.name] : e.target.value});
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = {
            email : registerData.email,
            username : registerData.username,
            password : registerData.password,
            password_confirmation : registerData.password_confirmation
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            // Login...      

            axios.post(`/api/register`, data).then(res => {
                if (res.data.status === 200) {

                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_username', res.data.username);
                    swal("Siker!", res.data.message, "success");

                    navigate('/');
                } else {
                    setRegisterData({ ...registerData, errors : res.data.errors});
                }
            });
        });
    };

    return (
        <div className='h-screen flex home'>
            <div className='w-full max-w-md m-auto rounded-lg border-2 shadow-black shadow-md py-5 px-16 form-background'>

                <div className='text-2xl font-medium mt-4 mb-10 text-center'>
                    <img 
                    src={Logo} 
                    alt="" 
                    className='w-3/4 m-auto' />
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className='mb-3'>

                        <label htmlFor ='email' className='text-l font-extrabold'>Email cím</label>

                        <input
                            name='email'
                            id='email'
                            type='email'
                            value={registerData.email}
                            onChange={handleInputChange}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            placeholder='Email cím'
                        />

                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { registerData.errors ? registerData.errors.email ?? '' : ''}
                        </span>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor ='username' className='text-l font-extrabold'>Felhasználónév</label>
                        <input
                            name='username'
                            id='username'
                            type='text'
                            value={registerData.username}
                            onChange={handleInputChange}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            placeholder='Felhasználónév'
                        />
                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { registerData.errors ? registerData.errors.username ?? '' : ''}
                        </span>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor ='password' className='text-l font-extrabold'>Jelszó</label>
                        <input
                            name='password'
                            id='password'
                            type='password'
                            value={registerData.password}
                            onChange={handleInputChange}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            placeholder='Jelszó'
                        />
                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { registerData.errors ? registerData.errors.password ? registerData.errors.password.length > 0 ? registerData.errors.password[0] : ''  : '' : ''}
                        </span>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor ='password_confirmation' className='text-l font-extrabold'>Jelszó megerősítése</label>
                        <input
                            name='password_confirmation'
                            id='password_confirmation'
                            type='password'
                            value={registerData.password_confirmation}
                            onChange={handleInputChange}
                            className={`w-full p-2 mt-1 block rounded-md text-sm shadow-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black`}
                            placeholder='Jelszó megerősítése'
                        />
                        <span className='flex items-center font-bold tracking-wide text-red-500 text-m mt-1 ml-1'>
                            { registerData.errors ? registerData.errors.password_confirmation ?? '' : ''}
                        </span>
                    </div>

                    <div className='flex justify-center items-center mt-6 mb-8'>
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
                            Regisztráció
                        </button>
                    </div>

                    <div className='mt-4 text-center'>
                        <span className='mb-2'>Már van fiókod?</span>
                        <Link 
                        to='/login'
                        className='font-semibold hover:text-orange-700'
                        > Jelentkezz be!</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;