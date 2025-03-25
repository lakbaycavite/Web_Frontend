import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import useLogin from '../../hooks/useLogin';

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useToast } from '../../hooks/useToast';

const Login = () => {
    const navigate = useNavigate()
    const { login, error, isLoading } = useLogin()

    // credential states
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')

    // validators
    const [errorMessageUser, setErrorMessageUser] = useState('')
    const [errorMessagePass, setErrorMessagePass] = useState('')



    const validateInputUser = (value) => {
        if (!value) {
            setErrorMessageUser('Input invalid.');
            return false;
        } else if (value.length == 40) {
            setErrorMessageUser('Input invalid.');
            return false;
        } else {
            setErrorMessageUser('');
            return true;
        }
    };
    const validateInputPass = (value) => {
        if (!value) {
            setErrorMessagePass('Input invalid.');
            return false;
        } else if (value.length == 20) {
            setErrorMessagePass('Input invalid.');
            return false;
        } else {
            setErrorMessagePass('');
            return true;
        }
    };

    const [IsOpenEye, setIsOpenEye] = useState(true)
    // const [isError, setIsError] = useState(false)

    const handleToggle = () => {
        setIsOpenEye(!IsOpenEye)
    }

    const loginToggle = async () => {
        // setIsError(!isError)
        // const loginUser = {
        //     identifier,
        //     password
        // }

        // console.log(loginUser)

        // axios.post('http://localhost:4000/admin/user/login', loginUser)
        //     .then((response) => {

        //         if (response.data.role == 'admin') {
        //             navigate('/admin/user')
        //         }
        //         else if (response.data.role == 'user') {
        //             navigate('/home')
        //         }
        //         console.log(response.data)
        //     })
        //     .catch((err) => {
        //         setError(err.response.data.error)
        //         console.log(err.response)
        //     })

        console.log(identifier, password)
        await login(identifier, password)
    }

    const handleUserChange = (e) => {
        const value = e.target.value;
        if (value.length <= 40) {
            setIdentifier(value);
            validateInputUser(value);
        }
    };

    const handlePassChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setPassword(value)
            validateInputPass(value);
        }
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                loginToggle();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [identifier, password, errorMessageUser, errorMessagePass]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card lg:card-side bg-base-100 shadow-xl mb-20">
                <div className="card-body">
                    {/* <img
                        src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                        alt="Album" /> */}

                    {/* left side  */}
                    <div className='w-96 h-96'>
                        <div className="w-full h-6 flex justify-center items-center">
                            <label className="text-3xl font-bold text-primary">Lakbay Cavite</label>
                        </div>

                        {/* error message container */}

                        <div className={`w-full h-14 mt-2 mb-4 transition duration-150 ${error ? 'opacity-100' : 'opacity-0'}`}>
                            {error && (
                                <div role="alert" className="alert alert-error">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 shrink-0 stroke-current"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-bold text-xs">Login Failed!</h3>
                                        <div className="text-xs">{error}</div>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* login credentials */}
                        <div className="w-full h-48 space-y-2">
                            {/* email */}
                            <div className="w-full h-12">
                                <label className={`input input-bordered flex hover:shadow items-center gap-2 ${errorMessageUser && 'input-error'}`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path
                                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                        <path
                                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                    </svg>
                                    <input type="text" className="grow input-ghost" value={identifier} placeholder="Email" onChange={handleUserChange} />
                                    {errorMessageUser && <p className='text-error text-sm'>{errorMessageUser}</p>}

                                </label>
                            </div>
                            {/* password */}
                            <div className="w-full h-12">
                                <label className={`input input-bordered flex hover:shadow items-center gap-2 ${errorMessagePass && 'input-error'}`}>
                                    {
                                        (IsOpenEye === false) ? <FaRegEye className='cursor-pointer' onClick={handleToggle} /> : <FaRegEyeSlash className='cursor-pointer' onClick={handleToggle} />
                                    }
                                    <input type={IsOpenEye ? 'password' : 'text'} className='grow input-ghost' value={password} placeholder="Password" onChange={handlePassChange} />
                                    {errorMessagePass && <p className='text-error text-sm'>{errorMessagePass}</p>}
                                </label>

                            </div>
                            {/* login button */}
                            <div className="w-full h-12 flex items-center justify-center">
                                <button className={`btn-sm btn btn-block btn-outline btn-primary  }`} disabled={!identifier || !password || errorMessagePass || errorMessageUser} onClick={loginToggle} >Login</button>
                            </div>
                            {/* Forgot Password */}
                            <div className="w-full h-12 flex items-start justify-center">
                                <a className="link link-hover text-sm">Forgot password?</a>
                            </div>


                        </div>
                    </div>

                </div>
                {/* right side of the card */}
                <div className="bg-primary card-body rounded-r-xl w-96">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-full h-[8rem] space-y-1">
                            <div className="w-full h-1/3 flex items-end">
                                <p className="text-center text-2xl text-white font-bold">Welcome to Login</p>
                            </div>
                            <div className="w-full h-1/3  flex items-center justify-center ">
                                <p className="text-sm text-center text-white"> Do not have an account? Sign up now!</p>

                            </div>
                            <div className="w-full h-1/3 flex justify-center items-start">
                                <button onClick={() => navigate('/register')} className={`btn w-48 btn-outline border-white rounded-full text-white`}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login