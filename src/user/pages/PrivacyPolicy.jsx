import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiShield, FiLock, FiMail, FiMap } from 'react-icons/fi';

const PrivacyPolicy = () => {
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
                    <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
                    <p className="text-sm text-base-content/70 text-center mb-8">
                        Effective/Updated Date: October 01, 2024
                    </p>

                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <div className="flex items-center justify-center mb-4">
                                <FiShield className="text-primary w-16 h-16" />
                            </div>
                            <p className="text-sm text-center">
                                Lakbay Cavite ("we," "our," or "us") respects your privacy and is committed to protecting your data. This Privacy Policy explains how we collect, use, and disclose information when you use the Lakbay Cavite web and mobile application ("App").                            </p>
                            <p className="text-sm text-center font-bold mt-4">
                                By using our Service, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">1. Information Collection</h2>
                    <div className="flex items-start mb-4">
                        <FiMail className="text-primary mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium">Personal Information</h3>
                            <p>
                                We collect personal information that you voluntarily provide to us when registering for the Service, including but not limited to your name, email address, phone number, and profile picture.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start mb-4">
                        <FiMap className="text-primary mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium">Location Information</h3>
                            <p>
                                With your consent, we may collect your device's precise location data to provide you with location-based services, such as finding nearby attractions, restaurants, and accommodations in Cavite.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start mb-4">
                        <FiLock className="text-primary mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium">Usage Data</h3>
                            <p>
                                We may also collect information about how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">2. Use of Information</h2>
                    <p>Lakbay Cavite uses the collected information for various purposes:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>To provide and maintain our Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                        <li>To provide customer support</li>
                        <li>To gather analysis or valuable information so that we can improve our Service</li>
                        <li>To monitor the usage of our Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4">3. Data Security</h2>
                    We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no security measures are entirely foolproof, and we cannot guarantee the absolute security of your data.

                    {/* <h2 className="text-xl font-bold mt-8 mb-4">4. Cookies</h2>
                    <p>
                        Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
                    </p>
                    <p>
                        We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                    </p>
                    <p>Examples of Cookies we use:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
                        <li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
                        <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
                    </ul> */}

                    <h2 className="text-xl font-bold mt-8 mb-4">4. Your choices</h2>
                    <p>
                        You have control over your information and can exercise the following rights:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Account Settings: You can update your personal information or delete your account through the settings menu.</li>
                        <li>Location Sharing: You can enable or disable location services at any time in your device's settings.</li>
                        <li>Deleting Data: You may request the deletion of your data by contacting us at lakbaycavite@gmail.com.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4">5. Service Providers</h2>
                    <p>
                        We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.
                    </p>
                    <p>
                        These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">6. Children's Privacy</h2>
                    <p>
                        Lakbay Cavite is not intended for children under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will take steps to delete such information.                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">7. Data Retention</h2>
                    <p>
                        We will retain your data for as long as your account is active or as necessary to provide you with services. We may also retain data to comply with legal obligations, resolve disputes, or enforce agreements.                    </p>
                    {/* <ul className="list-disc pl-5 mb-4">
                        <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                        <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                        <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                        <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                        <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                        <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                    </ul>
                    <p>
                        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                    </p> */}

                    <h2 className="text-xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                    </p>
                    <p>
                        You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <p className="font-medium mt-2">
                        Email: cavitelakbay@gmail.com<br />
                        {/* Address: Lakbay Cavite Headquarters, Trece Martires City, Cavite, Philippines */}
                    </p>

                    <div className="flex justify-center mt-12 mb-8">
                        <Link to="/terms-of-use" className="btn btn-outline btn-primary">
                            View Terms of Use <FiExternalLink className="ml-2" />
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

export default PrivacyPolicy;