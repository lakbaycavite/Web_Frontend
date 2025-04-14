import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import { useToast } from '../../hooks/useToast';
import { FaRegEye, FaRegEyeSlash, FaUserSlash } from "react-icons/fa";
import { FiMail, FiLock, FiAlertCircle, FiHelpCircle, FiX } from "react-icons/fi";
import moment from 'moment';

const Login = () => {
    const navigate = useNavigate();
    const { login, error, isLoading, deactivationInfo } = useLogin();
    const toast = useToast();
    const modalRef = useRef(null);

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessageUser, setErrorMessageUser] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('');

    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

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
        const result = await login(identifier, password);
    };

    useEffect(() => {
        if (deactivationInfo) {
            setShowDeactivatedModal(true);
        }
    }, [deactivationInfo]);

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

    const closeDeactivatedModal = () => {
        setShowDeactivatedModal(false);
        setPassword('');
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeDeactivatedModal();
            }
        };

        if (showDeactivatedModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDeactivatedModal]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100 p-4">
            <div className="card lg:card-side bg-base-100 shadow-xl w-full max-w-4xl">
                <div className="card-body p-8">
                    <div className='w-full max-w-md mx-auto'>
                        <div className="w-full flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold text-primary mb-2">Lakbay Cavite</h1>
                            <p className="text-base-content/60 text-sm">Log in to your account</p>
                        </div>

                        {error && !error.includes('deactivated') && (
                            <div className="label">
                                <span className="label-text-alt text-error">{error}</span>
                            </div>
                        )}

                        <div className="w-full space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiMail className="mr-2 text-primary" /> Email or Username
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full ${errorMessageUser || (error && !error.includes('deactivated')) ? 'input-error' : ''}`}
                                        value={identifier}
                                        placeholder="Enter your email or username"
                                        onChange={handleUserChange}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiLock className="mr-2 text-primary" /> Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={isOpenEye ? 'password' : 'text'}
                                        className={`input input-bordered w-full pr-10 ${errorMessagePass || (error && !error.includes('deactivated')) ? 'input-error' : ''}`}
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
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:underline flex items-center"
                                >
                                    <FiHelpCircle className="mr-1" /> Forgot password?
                                </Link>
                            </div>

                            <button
                                className={`btn btn-primary w-full mt-2`}
                                disabled={!identifier || !password || errorMessagePass || errorMessageUser || isLoading}
                                onClick={loginToggle}
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-primary card-body rounded-r-xl lg:w-2/5 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-xs space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">New here?</h2>
                            <p className="text-white/80 text-sm mb-6">
                                Create an account to explore the beauty of Imus City, Cavite with us!
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="btn btn-outline border-white text-white hover:bg-white hover:text-primary w-full"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>

            {showDeactivatedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div
                        ref={modalRef}
                        className="modal-box relative bg-base-100 p-6 rounded-lg shadow-xl max-w-md w-full animate-fadeIn"
                    >
                        <button
                            onClick={closeDeactivatedModal}
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                            <FiX />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-error bg-opacity-10 flex items-center justify-center mb-4">
                                <FaUserSlash className="text-error text-3xl" />
                            </div>

                            <h3 className="font-bold text-xl mb-2">Account Deactivated</h3>

                            <div className="py-2">
                                <p className="text-gray-600 mb-4">
                                    Your account has been deactivated by an administrator.
                                </p>

                                {deactivationInfo?.reason && (
                                    <div className="bg-base-200 p-4 rounded-lg mb-4 text-left">
                                        <p className="text-sm font-medium mb-1">Reason for deactivation:</p>
                                        <p className="text-sm italic">"{deactivationInfo.reason}"</p>

                                        {deactivationInfo.deactivatedAt && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Deactivated on: {moment(deactivationInfo.deactivatedAt).format('MMMM Do, YYYY')}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="bg-base-200 p-4 rounded-lg mb-4 text-left">
                                    <div className="flex items-center mb-2">
                                        <FiAlertCircle className="text-error mr-2" />
                                        <p className="font-medium">What can I do?</p>
                                    </div>
                                    <p className="text-sm">
                                        Please contact <a href="mailto:cavitelakbay@gmail.com" className="text-primary font-medium hover:underline">cavitelakbay@gmail.com</a> to request account reactivation or for further information.
                                    </p>
                                </div>

                                <p className="text-sm text-gray-500">
                                    If you believe this is an error, you can contact support with details about your account.
                                </p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={closeDeactivatedModal}
                                    className="btn btn-primary w-full"
                                >
                                    I understand
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;