import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import {
    FiMail,
    FiLock,
    FiKey,
    FiAlertCircle,
    FiArrowLeft,
    FiCheck
} from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const toast = useToast();
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI states
    const [step, setStep] = useState(1); // 1: Verify code, 2: Set new password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate reset code
    const validateCode = (code) => {
        return code.length === 6 && /^\d+$/.test(code);
    };

    // Handle reset code verification
    const handleVerifyCode = (e) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!resetCode) {
            setError("Please enter the reset code");
            return;
        }

        if (!validateCode(resetCode)) {
            setError("Reset code must be 6 digits");
            return;
        }

        setError("");
        // Move to password reset step
        setStep(2);
    };

    // Handle password reset submission
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword) {
            setError("Please enter a new password");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await axios.post("http://localhost:4000/admin/user/reset", {
                email,
                token: resetCode,
                newPassword
            });

            setLoading(false);
            toast("Password reset successful! You can now login with your new password.", "success");
            navigate("/login");
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.error || "Failed to reset password. Please try again.");
            toast("Failed to reset password. Please try to send code again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex justify-center items-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body p-6 md:p-8">
                    <div className="mb-4">
                        <Link to="/" className="text-2xl font-bold text-primary">Lakbay Cavite</Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-2">Reset Your Password</h2>
                        <p className="text-base-content/70 text-sm">
                            {step === 1 ? 'Verify your identity with the code sent to your email' : 'Create a new password for your account'}
                        </p>

                        {/* Steps indicator */}
                        <div className="w-full flex mt-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-base-200'} mr-2`}>
                                <FiKey />
                            </div>
                            <div className={`h-1 flex-grow mt-5 ${step >= 1 ? 'bg-primary' : 'bg-base-200'}`}></div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-base-200'} ml-2`}>
                                <FiLock />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-6">
                            <FiAlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Step 1: Verify code */}
                    {step === 1 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiMail className="mr-2 text-primary" /> Email Address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="input input-bordered w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiKey className="mr-2 text-primary" /> Reset Code
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="input input-bordered w-full text-center tracking-widest text-lg"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    maxLength={6}
                                />
                            </div>

                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={!email || !resetCode || !validateEmail(email) || !validateCode(resetCode)}
                                >
                                    Continue
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <Link to="/forgot-password" className="btn btn-ghost btn-sm">
                                    <FiArrowLeft className="mr-2" /> Back to Request Page
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Set new password */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiLock className="mr-2 text-primary" /> New Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="input input-bordered w-full pr-10"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                <label className="label">
                                    <span className="label-text-alt">Password must be at least 8 characters</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center">
                                        <FiCheck className="mr-2 text-primary" /> Confirm Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="input input-bordered w-full pr-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full`}
                                    disabled={loading || !newPassword || !confirmPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setStep(1)}
                                >
                                    <FiArrowLeft className="mr-2" /> Back
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;