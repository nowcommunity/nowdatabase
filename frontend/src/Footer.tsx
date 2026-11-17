import { Link } from 'react-router-dom'
import './styles/Footer.css'

export const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <span>© The NOW Database {new Date().getFullYear()}</span>
        <nav aria-label="Legal information">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/accessibility-statement">Accessibility Statement</Link>
        </nav>
      </div>
    </footer>
  )
}
