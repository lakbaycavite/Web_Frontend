import { Link } from "react-router-dom";

const FooterComponent = () => {
    return (
        <div className="bg-gradient-to-r from-base-200 to-base-300 text-base-content py-10 px-8 mt-auto border-t border-base-300">
            {/* Main footer content */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company section */}
                <div className="mb-6 md:mb-0">
                    <h5 className="footer-title font-bold mb-4">Company</h5>
                    <ul className="space-y-3">
                        <li><Link to="/about" className="link link-hover hover:text-primary transition-colors">About us</Link></li>
                        <li><Link to="/contacts" className="link link-hover hover:text-primary transition-colors">Contacts</Link></li>
                    </ul>
                </div>

                {/* Resources & Legal section */}
                <div className="mb-6 md:mb-0">
                    <h5 className="footer-title font-bold mb-4">Resources</h5>
                    <ul className="space-y-3">
                        <li><Link to="/terms-of-use" className="link link-hover hover:text-primary transition-colors">Terms of Use</Link></li>
                        <li><Link to="/privacy-policy" className="link link-hover hover:text-primary transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact section */}
                <div>
                    <h5 className="footer-title font-bold mb-4">Contact</h5>
                    <p className="text-base-content">
                        Email: <a href="mailto:cavitelakbay@gmail.com" className="link link-hover hover:text-primary transition-colors">cavitelakbay@gmail.com</a>
                    </p>
                </div>
            </div>

            {/* Bottom copyright section - separate from the footer grid */}
            <div className="border-t border-base-300 mt-8 pt-6 w-full">
                <div className="container mx-auto text-center">
                    <p className="text-sm text-base-content/70">
                        © {new Date().getFullYear()} Lakbay Cavite. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FooterComponent;