import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';

const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <div className="bg-primary text-primary-content shadow-md">
                <div className="container mx-auto py-4 px-4 md:px-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Lakbay Cavite</h1>
                        <Link to="/" className="btn btn-ghost btn-sm normal-case">
                            <FiArrowLeft className="mr-2" /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="prose max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Terms of Use</h1>
                    <p className="text-sm text-base-content/70 text-center mb-8">
                        Last Updated: March 25, 2025
                    </p>

                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <p className="text-sm">
                                Please read these Terms of Use ("Terms", "Terms of Use") carefully before using the Lakbay Cavite website and mobile application (the "Service") operated by Lakbay Cavite ("us", "we", or "our").
                            </p>
                            <p className="text-sm">
                                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
                            </p>
                            <p className="text-sm font-bold">
                                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">1. Accounts</h2>
                    {/* <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p> */}
                    <p>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                    <p>
                        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">2. Content</h2>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p>
                        By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
                    </p>
                    <p>
                        We reserve the right to terminate the account of any user found to be infringing on a copyright.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">3. Prohibited Uses</h2>
                    <p>You agree not to use the Service:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>In any way that violates any applicable national or international law or regulation.</li>
                        <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate Lakbay Cavite, a Lakbay Cavite employee, another user, or any other person or entity.</li>
                        <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4">4. Intellectual Property</h2>
                    <p>
                        The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Lakbay Cavite and its licensors. The Service is protected by copyright, trademark, and other laws of both the Philippines and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Lakbay Cavite.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                    <p>
                        Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
                    <p>
                        In no event shall Lakbay Cavite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">7. Disclaimer</h2>
                    <p>
                        Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                    </p>
                    <p>
                        Lakbay Cavite, its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">8. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
                    </p>
                    <p>
                        Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">9. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p>
                        By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">10. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="font-medium mt-2">
                        Email: cavitelakbay@gmail.com<br />
                        {/* Address: Lakbay Cavite Headquarters, Trece Martires City, Cavite, Philippines */}
                    </p>

                    <div className="flex justify-center mt-12 mb-8">
                        <Link to="/privacy-policy" className="btn btn-outline btn-primary">
                            View Privacy Policy <FiExternalLink className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-neutral text-neutral-content p-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <span className="font-bold">© 2025 Lakbay Cavite. All rights reserved.</span>
                        </div>
                        <div className="flex gap-4">
                            <Link to="/terms-of-use" className="link link-hover">Terms of Use</Link>
                            <Link to="/privacy-policy" className="link link-hover">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfUse;