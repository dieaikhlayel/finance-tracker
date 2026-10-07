import { useState, type FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from './authSlice';

interface LocationState {
    from?: { pathname: string };
}

export function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { status, error, token } = useAppSelector((s) => s.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirectTo = (location.state as LocationState)?.from?.pathname ?? '/';

    useEffect(() => {
        if (token) {
            navigate(redirectTo, { replace: true });
        }
    }, [token, navigate, redirectTo]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate(redirectTo, { replace: true });
        }
    }

    const submitting = status === 'loading';

    return (
        <div className="auth-card">
            <h1>Log in</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <p className="auth-alt">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}