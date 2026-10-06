import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Finance Tracker
            </Link>
            <div className="navbar-links">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/transactions"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                    Transactions
                </NavLink>
            </div>
        </nav>
    );
}