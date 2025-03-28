// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'
// import useLogin from '../../hooks/useLogin';

// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// import { useToast } from '../../hooks/useToast';

// const Login = () => {
//     const navigate = useNavigate()
//     const { login, error, isLoading } = useLogin()

//     // credential states
//     const [identifier, setIdentifier] = useState('')
//     const [password, setPassword] = useState('')

//     // validators
//     const [errorMessageUser, setErrorMessageUser] = useState('')
//     const [errorMessagePass, setErrorMessagePass] = useState('')



//     const validateInputUser = (value) => {
//         if (!value) {
//             setErrorMessageUser('Input invalid.');
//             return false;
//         } else if (value.length == 40) {
//             setErrorMessageUser('Input invalid.');
//             return false;
//         } else {
//             setErrorMessageUser('');
//             return true;
//         }
//     };
//     const validateInputPass = (value) => {
//         if (!value) {
//             setErrorMessagePass('Input invalid.');
//             return false;
//         } else if (value.length == 20) {
//             setErrorMessagePass('Input invalid.');
//             return false;
//         } else {
//             setErrorMessagePass('');
//             return true;
//         }
//     };

//     const [IsOpenEye, setIsOpenEye] = useState(true)
//     // const [isError, setIsError] = useState(false)

//     const handleToggle = () => {
//         setIsOpenEye(!IsOpenEye)
//     }

//     const loginToggle = async () => {


//         console.log(identifier, password)
//         await login(identifier, password)
//     }

//     const handleUserChange = (e) => {
//         const value = e.target.value;
//         if (value.length <= 40) {
//             setIdentifier(value);
//             validateInputUser(value);
//         }
//     };

//     const handlePassChange = (e) => {
//         const value = e.target.value;
//         if (value.length <= 20) {
//             setPassword(value)
//             validateInputPass(value);
//         }
//     };

//     useEffect(() => {
//         const handleKeyPress = (event) => {
//             if (event.key === 'Enter') {
//                 loginToggle();
//             }
//         };

//         document.addEventListener('keydown', handleKeyPress);
//         return () => {
//             document.removeEventListener('keydown', handleKeyPress);
//         };
//     }, [identifier, password, errorMessageUser, errorMessagePass]);

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="card lg:card-side bg-base-100 shadow-xl mb-20">
//                 <div className="card-body">
//                     {/* <img
//                         src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
//                         alt="Album" /> */}

//                     {/* left side  */}
//                     <div className='w-96 h-96'>
//                         <div className="w-full h-6 flex justify-center items-center">
//                             <label className="text-3xl font-bold text-primary">Lakbay Cavite</label>
//                         </div>

//                         {/* error message container */}

//                         <div className={`w-full h-14 mt-2 mb-4 transition duration-150 ${error ? 'opacity-100' : 'opacity-0'}`}>
//                             {error && (
//                                 <div role="alert" className="alert alert-error">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-6 w-6 shrink-0 stroke-current"
//                                         fill="none"
//                                         viewBox="0 0 24 24">
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth="2"
//                                             d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     <div>
//                                         <h3 className="font-bold text-xs">Login Failed!</h3>
//                                         <div className="text-xs">{error}</div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>


//                         {/* login credentials */}
//                         <div className="w-full h-48 space-y-2">
//                             {/* email */}
//                             <div className="w-full h-12">
//                                 <label className={`input input-bordered flex hover:shadow items-center gap-2 ${errorMessageUser && 'input-error'}`}>
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 16 16"
//                                         fill="currentColor"
//                                         className="h-4 w-4 opacity-70">
//                                         <path
//                                             d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                                         <path
//                                             d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//                                     </svg>
//                                     <input type="text" className="grow input-ghost" value={identifier} placeholder="Email" onChange={handleUserChange} />
//                                     {errorMessageUser && <p className='text-error text-sm'>{errorMessageUser}</p>}

//                                 </label>
//                             </div>
//                             {/* password */}
//                             <div className="w-full h-12">
//                                 <label className={`input input-bordered flex hover:shadow items-center gap-2 ${errorMessagePass && 'input-error'}`}>
//                                     {
//                                         (IsOpenEye === false) ? <FaRegEye className='cursor-pointer' onClick={handleToggle} /> : <FaRegEyeSlash className='cursor-pointer' onClick={handleToggle} />
//                                     }
//                                     <input type={IsOpenEye ? 'password' : 'text'} className='grow input-ghost' value={password} placeholder="Password" onChange={handlePassChange} />
//                                     {errorMessagePass && <p className='text-error text-sm'>{errorMessagePass}</p>}
//                                 </label>

//                             </div>
//                             {/* login button */}
//                             <div className="w-full h-12 flex items-center justify-center">
//                                 <button className={`btn-sm btn btn-block btn-outline btn-primary  }`} disabled={!identifier || !password || errorMessagePass || errorMessageUser} onClick={loginToggle} >Login</button>
//                             </div>
//                             {/* Forgot Password */}
//                             <div className="w-full h-12 flex items-start justify-center">
//                                 <a className="link link-hover text-sm">Forgot password?</a>
//                             </div>


//                         </div>
//                     </div>

//                 </div>
//                 {/* right side of the card */}
//                 <div className="bg-primary card-body rounded-r-xl w-96">
//                     <div className="w-full h-full flex flex-col items-center justify-center">
//                         <div className="w-full h-[8rem] space-y-1">
//                             <div className="w-full h-1/3 flex items-end">
//                                 <p className="text-center text-2xl text-white font-bold">Welcome to Login</p>
//                             </div>
//                             <div className="w-full h-1/3  flex items-center justify-center ">
//                                 <p className="text-sm text-center text-white"> Do not have an account? Sign up now!</p>

//                             </div>
//                             <div className="w-full h-1/3 flex justify-center items-start">
//                                 <button onClick={() => navigate('/register')} className={`btn w-48 btn-outline border-white rounded-full text-white`}>Register</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Login



import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import { useToast } from '../../hooks/useToast';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiMail, FiLock, FiAlertCircle, FiHelpCircle } from "react-icons/fi";

const Login = () => {
    const navigate = useNavigate();
    const { login, error, isLoading } = useLogin();
    const toast = useToast();

    // credential states
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    // validators
    const [errorMessageUser, setErrorMessageUser] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('');

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

    const [isOpenEye, setIsOpenEye] = useState(true);

    const handleToggle = () => {
        setIsOpenEye(!isOpenEye);
    };

    const loginToggle = async () => {
        console.log(identifier, password);

        await login(identifier, password)


    };

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
            setPassword(value);
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
        <div className="flex justify-center items-center min-h-screen bg-base-100 p-4">
            <div className="card lg:card-side bg-base-100 shadow-xl w-full max-w-4xl">
                {/* Left side - Login form */}
                <div className="card-body p-8">
                    <div className='w-full max-w-md mx-auto'>
                        <div className="w-full flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold text-primary mb-2">Lakbay Cavite</h1>
                            <p className="text-base-content/60 text-sm">Log in to your account</p>
                        </div>

                        {/* Error message container */}
                        {/* {error && (
                            <div className="alert alert-error mb-6 transition-all duration-300 animate-fadeIn">
                                <FiAlertCircle className="w-6 h-6 shrink-0 stroke-current" />
                                <div>
                                    <h3 className="font-bold">Login Failed!</h3>
                                    <div className="text-sm">{error}</div>
                                </div>
                            </div>
                        )} */}

                        {error && (
                            <div className="label">
                                <span className="label-text-alt text-error">{error}</span>
                            </div>
                        )}

                        {/* Login credentials */}
                        <div className="w-full space-y-4">
                            {/* Email/Username */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiMail className="mr-2 text-primary" /> Email or Username
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full ${errorMessageUser || error && 'input-error'}`}
                                        value={identifier}
                                        placeholder="Enter your email or username"
                                        onChange={handleUserChange}
                                    />
                                    {/* {error && (
                                        <div className="label">
                                            <span className="label-text-alt text-error">{error}</span>
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiLock className="mr-2 text-primary" /> Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={isOpenEye ? 'password' : 'text'}
                                        className={`input input-bordered w-full pr-10 ${errorMessagePass || error && 'input-error'}`}
                                        value={password}
                                        placeholder="Enter your password"
                                        onChange={handlePassChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                                        onClick={handleToggle}
                                    >
                                        {isOpenEye ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                {/* {error && (
                                    <div className="label">
                                        <span className="label-text-alt text-error">{error}</span>
                                    </div>
                                )} */}
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:underline flex items-center"
                                >
                                    <FiHelpCircle className="mr-1" /> Forgot password?
                                </Link>
                            </div>

                            {/* Login button */}
                            <button
                                className={`btn btn-primary w-full mt-2`}
                                disabled={!identifier || !password || errorMessagePass || errorMessageUser || isLoading}
                                onClick={loginToggle}
                            >
                                {isLoading ? 'Loggiing in...' : 'Log in'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side - Register CTA */}
                <div className="bg-primary card-body rounded-r-xl lg:w-2/5 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-xs space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">New here?</h2>
                            <p className="text-white/80 text-sm mb-6">
                                Create an account to explore the beauty of Cavite with us!
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="btn btn-outline border-white text-white hover:bg-white hover:text-primary w-full"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;