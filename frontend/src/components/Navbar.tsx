// import { Link, NavLink } from 'react-router-dom';

// export function Navbar() {
//     return (
//         <nav className="navbar">
//             <Link to="/" className="navbar-brand">
//                 Finance Tracker
//             </Link>
//             <div className="navbar-links">
//                 <NavLink
//                     to="/"
//                     end
//                     className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
//                 >
//                     Dashboard
//                 </NavLink>
//                 <NavLink
//                     to="/transactions"
//                     className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
//                 >
//                     Transactions
//                 </NavLink>
//             </div>
//         </nav>
//     );
// }

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((s) => s.auth);

    function handleLogout() {
        dispatch(logout());
        navigate('/login', { replace: true });
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Finance Tracker
            </Link>

            <div className="navbar-links">
                {user ? (
                    <>
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
                        <span className="navbar-user">Hi, {user.name}</span>
                        <button type="button" className="btn-link" onClick={handleLogout}>
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Log in
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}