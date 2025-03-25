import { Link } from "react-router-dom"

const FooterComponent = () => {
    return (
        <footer className="footer bg-base-100 text-base-content p-10 mt-auto">

            <nav>
                <h6 className="footer-title">Company</h6>
                <Link to="/about" className="link link-hover">About us</Link>
                <Link to="/contacts" className="link link-hover">Contact</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <Link to="/terms-of-use" className="link link-hover">Terms of Use</Link>
                <Link to="/privacy-policy" className="link link-hover">Privacy Policy</Link>
            </nav>
        </footer>
    )
}

export default FooterComponent
