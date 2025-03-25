import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { FiMail, FiArrowLeft, FiAlertCircle, FiSend } from "react-icons/fi";

const ForgotPassword = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await axios.post("http://localhost:4000/admin/user/request-reset", { email });
            setLoading(false);
            setEmailSent(true);
            toast("If your email exists in our system, you'll receive a reset code", "info");

            // Store email in localStorage for the reset password page
            localStorage.setItem('resetPasswordEmail', email);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.error || "Something went wrong. Please try again.");
            toast("Error sending reset code. Please try again.", "error");
        }
    };

    // Handle navigation to reset password
    const goToResetPassword = () => {
        navigate("/reset-password", { state: { email } });
    };

    // Initial request form
    const renderRequestForm = () => (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Forgot Password?</h2>
                <p className="text-base-content/70 text-sm">
                    Enter your email address and we'll send you a code to reset your password.
                </p>
            </div>

            {error && (
                <div className="alert alert-error mb-6">
                    <FiAlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loading}
                    />
                </div>

                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className={`btn btn-primary w-full`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Code"}
                        {!loading && <FiSend className="ml-2" />}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="btn btn-ghost btn-sm">
                    <FiArrowLeft className="mr-2" /> Back to Login
                </Link>
            </div>
        </div>
    );

    // Success message after email is sent
    const renderSuccessMessage = () => (
        <div className="w-full text-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMail className="h-10 w-10 text-success" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-base-content/70 mb-6">
                We've sent a password reset code to:
                <br />
                <span className="font-medium">{email}</span>
            </p>

            <div className="alert bg-base-200 mb-6">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h3 className="font-bold">Didn't receive the email?</h3>
                        <div className="text-sm">
                            Check your spam folder or try again in a few minutes.
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    className="btn btn-primary w-full"
                    onClick={goToResetPassword}
                >
                    Enter Reset Code
                </button>

                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEmailSent(false)}
                >
                    Try Another Email
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 flex justify-center items-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body p-6 md:p-8">
                    <div className="mb-4">
                        <Link to="/" className="text-2xl font-bold text-primary">Lakbay Cavite</Link>
                    </div>

                    {emailSent ? renderSuccessMessage() : renderRequestForm()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;