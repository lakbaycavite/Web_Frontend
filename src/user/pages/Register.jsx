import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { FiMail, FiUser, FiLock, FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import api from "../../lib/axios";


const Register = () => {
    const toast = useToast();
    const navigate = useNavigate();

    // Step tracking
    const [step, setStep] = useState(1); // 1: Registration form, 2: Verification code

    // user credentials
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [userError, setUserError] = useState('');

    // verification
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // error Messages
    const [errorEmail, setErrorEmail] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [errorConfirmPass, setErrorConfirmPass] = useState('');
    const [isMismatch, setIsMismatch] = useState(false);
    const [takenMessage, setTakenMessage] = useState([]);

    // validators
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            setErrorEmail('Invalid input');
            return false;
        } else if (!emailRegex.test(value)) {
            setErrorEmail('Invalid email format');
            return false;
        } else {
            setErrorEmail('');
            return true;
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    //username
    const validateUsername = (value) => {
        const noSpecialCharRegex = /^[a-zA-Z0-9]*$/
        if (value.length < 3) {
            setErrorUsername('Username must be at least 3');
            return false;
        } else if (value.length == 20) {
            setErrorUsername('Username reached max limit of 20 characters');
            return false;
        } else if (!noSpecialCharRegex.test(value)) {
            setErrorUsername('Only letters and numbers are allowed');
        }
        else {
            setErrorUsername('');
            return true;
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setUsername(value);
            validateUsername(value);
        }
    };

    // password
    const validatePassword = (value) => {
        if (value.length < 9 || value.length == 0) {
            setErrorPass('Password must be at least 8 characters');
            return false;
        } else if (value.length == 30) {
            setErrorPass('Password reached max limit of 30 characters');
            return false;
        } else {
            setErrorPass('');
            return true;
        }
    };

    const handlePassChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setPassword(value);
            validatePassword(value);
        }
    };

    // confirm pass
    const validateConfirmPassword = (value) => {
        if (!value) {
            setErrorConfirmPass('Invalid Input');
            return false;
        } else if (value.length == 30) {
            setErrorConfirmPass('Invalid Input');
            return false;
        } else {
            setErrorConfirmPass('');
            return true;
        }
    };

    const handleConfirmPassChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setConfirmPass(value);
            validateConfirmPassword(value);
        }
    };

    // Start the verification countdown
    const startResendCountdown = () => {
        setResendDisabled(true);
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Handle initial registration step
    const handleInitialRegister = (e) => {
        e.preventDefault();
        setIsMismatch(false);
        setUserError('');
        setTakenMessage([]);




        if (password !== confirmPass) {
            setIsMismatch(true);
            setConfirmPass('');
            toast('Registration failed', 'error');
            return;
        }


        // First step - send registration data and get verification code sent
        const registerUser = {
            username,
            email,
            firstName,
            lastName,
            password
        };

        setIsVerifying(true);



        // {(isMismatch || userError) && (
        //     <div className="alert alert-error shadow-lg mb-4">
        //         <div>
        //             <FiAlertCircle className="stroke-current h-6 w-6" />
        //             <div>
        //                 <h3 className="font-bold">Registration Error</h3>
        //                 <div className="text-xs">
        //                     {isMismatch && "Passwords don't match"}
        //                     {userError && !isMismatch && userError}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // )}


        // Update this to call your verification initiation endpoint
        api.post("/admin/user/register", registerUser)
            .then((res) => {
                setIsVerifying(false);
                // If successful, move to verification step
                if (res.data.message && res.data.message.includes('Verification code sent')) {
                    toast('Verification code sent to your email', 'info');
                    setStep(2);
                    startResendCountdown();
                } else {
                    toast('Registration initiated successfully', 'info');
                    setStep(2);
                    startResendCountdown();
                }
            })
            .catch((err) => {
                setIsVerifying(false);
                console.log(err.response);
                setUserError(err.response?.data?.error || 'Registration failed');
                setTakenMessage(err.response?.data?.errorMessages || []);
                toast('Registration failed', 'error');
            });
    };

    // Handle verification code submission
    const handleVerifyCode = (e) => {
        e.preventDefault();
        setVerificationError('');

        if (!verificationCode || verificationCode.length < 6) {
            setVerificationError('Please enter a valid verification code');
            return;
        }

        setIsVerifying(true);

        // Call the verification endpoint
        api.post("/admin/user/verify", {
            email,
            verificationCode,
            username,
            password,
            firstName,
            lastName
        })
            .then((res) => {
                setIsVerifying(false);
                toast('Account verified and created successfully', 'success');
                navigate('/home');
            })
            .catch((err) => {
                setIsVerifying(false);
                setVerificationError(err.response?.data?.error || 'Verification failed');
            });
    };

    // Handle resend verification code
    const handleResendCode = () => {
        if (resendDisabled) return;

        setIsVerifying(true);

        // Call resend verification endpoint
        api.post("/admin/user/resend-verification", { email })
            .then((res) => {
                setIsVerifying(false);
                toast('Verification code resent to your email', 'info');
                startResendCountdown();
            })
            .catch((err) => {
                setIsVerifying(false);
                setVerificationError(err.response?.data?.error || 'Failed to resend verification code');
            });
    };

    // Registration form (Step 1)
    const renderRegistrationForm = () => (
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-col space-y-2 mb-6">
                <h3 className="text-3xl font-bold text-primary">Create Your Account</h3>
                <p className="text-sm text-gray-500">Fill in your details to get started</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full w-1/2"></div>
                </div>
            </div>

            {/* Email and Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Email */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm flex items-center">
                                <FiMail className="mr-1" /> Email Address
                            </span>
                            <span className="label-text-alt text-error">Required</span>
                        </div>
                        <input
                            type="text"
                            placeholder="your.email@example.com"
                            className={`input input-bordered w-full ${errorEmail && 'input-error'}`}
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <div className="label h-6">
                            {errorEmail && <span className="label-text-alt text-error">{errorEmail}</span>}
                            {takenMessage.some(message => message.toLowerCase().includes('email is already taken')) && (
                                <span className="label-text-alt text-error">Email is already taken</span>
                            )}
                        </div>
                    </label>
                </div>

                {/* Username */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm flex items-center">
                                <FiUser className="mr-1" /> Username
                            </span>
                            <span className="label-text-alt text-error">Required</span>
                        </div>
                        <input
                            type="text"
                            placeholder="username"
                            className={`input input-bordered w-full ${errorUsername || takenMessage.some(message => message.includes('username')) ? 'input-error' : ''}`}
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <div className="label h-6">
                            {errorUsername && <span className="label-text-alt text-error">{errorUsername}</span>}
                            {takenMessage.some(message => message.toLowerCase().includes('username')) && (
                                <span className="label-text-alt text-error">Username is already taken</span>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm">First Name</span>
                            <span className="label-text-alt text-primary">Optional</span>
                        </div>
                        <input
                            type="text"
                            placeholder="John"
                            className="input input-bordered w-full"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                </div>

                {/* Last Name */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm">Last Name</span>
                            <span className="label-text-alt text-primary">Optional</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Doe"
                            className="input input-bordered w-full"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Password */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm flex items-center">
                                <FiLock className="mr-1" /> Password
                            </span>
                            <span className="label-text-alt text-error">Required</span>
                        </div>
                        <input
                            type="password"
                            placeholder="Min. 8 characters"
                            className={`input input-bordered w-full ${errorPass && 'input-error'}`}
                            value={password}
                            onChange={handlePassChange}
                        />
                        <div className="label h-6">
                            {errorPass && <span className="label-text-alt text-error">{errorPass}</span>}
                            {isMismatch && <span className="label-text-alt text-error">Passwords don't match</span>}
                        </div>
                    </label>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-bold text-sm flex items-center">
                                <FiCheckCircle className="mr-1" /> Confirm Password
                            </span>
                            <span className="label-text-alt text-error">Required</span>
                        </div>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className={`input input-bordered w-full ${errorConfirmPass && 'input-error'}`}
                            value={confirmPass}
                            onChange={handleConfirmPassChange}
                        />
                        <div className="label h-6">
                            {errorConfirmPass && <span className="label-text-alt text-error">{errorConfirmPass}</span>}
                            {isMismatch && <span className="label-text-alt text-error">Passwords don't match</span>}

                        </div>
                    </label>
                </div>
            </div>

            {/* Button and Error Messages */}
            <div className="w-full mb-4">
                {/* Continue Button */}
                <button
                    className={`btn btn-primary btn-lg w-full ${!username || errorEmail || errorUsername || errorPass || errorConfirmPass || !password || !confirmPass ? 'btn-disabled' : ''}`}
                    onClick={handleInitialRegister}
                    disabled={isVerifying || !username || errorEmail || errorUsername || errorPass || errorConfirmPass}
                >
                    {isVerifying ? 'Processing...' : 'Continue to Verification'}
                    {!isVerifying && <FiArrowRight className="ml-2" />}
                </button>
            </div>

            {/* Error Messages */}
            {/* {(isMismatch || userError) && (
                <div className="alert alert-error shadow-lg mb-4">
                    <div>
                        <FiAlertCircle className="stroke-current h-6 w-6" />
                        <div>
                            <h3 className="font-bold">Registration Error</h3>
                            <div className="text-xs">
                                {isMismatch && "Passwords don't match"}
                                {userError && !isMismatch && userError}
                            </div>
                        </div>
                    </div>
                </div>
            )} */}



            {/* Login Link */}
            <div className="text-center mt-4">
                <p>Already have an account? <Link to='/login' className='link link-hover text-primary font-semibold'>Log in</Link></p>
            </div>
        </div>
    );

    // Verification form (Step 2)
    const renderVerificationForm = () => (
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-col space-y-2 mb-6">
                <h3 className="text-3xl font-bold text-primary">Verify Your Email</h3>
                <p className="text-sm text-gray-500">We've sent a verification code to {email}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full w-full"></div>
                </div>
            </div>

            {/* Verification Code */}
            <div className="form-control w-full mb-6">
                <label className="label">
                    <span className="label-text font-bold text-sm">Enter Verification Code</span>
                </label>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        className={`input input-bordered input-lg text-center text-2xl tracking-widest ${verificationError && 'input-error'}`}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        maxLength={6}
                    />
                    {verificationError && (
                        <div className="alert alert-error shadow-lg">
                            <div>
                                <FiAlertCircle className="stroke-current h-6 w-6" />
                                <span>{verificationError}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <button
                    className={`btn btn-primary btn-lg w-full`}
                    onClick={handleVerifyCode}
                    disabled={isVerifying || verificationCode.length !== 6}
                >
                    {isVerifying ? 'Verifying...' : 'Verify and Create Account'}
                </button>

                <div className="flex justify-between items-center">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setStep(1)}
                    >
                        Back to Form
                    </button>
                    <button
                        className={`btn btn-outline btn-sm ${resendDisabled ? 'btn-disabled' : ''}`}
                        onClick={handleResendCode}
                        disabled={resendDisabled}
                    >
                        {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                    </button>
                </div>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-base-200 rounded-box">
                <h4 className="font-semibold mb-2 flex items-center">
                    <FiMail className="mr-2" /> Can't find the email?
                </h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure your email address is correct</li>
                    <li>Wait a few minutes and check again</li>
                    <li>Try clicking the resend button above</li>
                </ul>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 flex justify-center items-center p-4">
            {/* Form Container - Now full width */}
            <div className="card bg-base-100 shadow-xl w-full max-w-3xl">
                <div className="card-body p-6 md:p-10">
                    {/* Header with app name */}
                    <div className="mb-4">
                        <a href='/home' className="btn btn-ghost text-2xl font-bold text-primary p-0">Lakbay Cavite</a>
                    </div>

                    {step === 1 ? renderRegistrationForm() : renderVerificationForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;