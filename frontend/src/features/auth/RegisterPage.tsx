import { useState, type FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearError } from './authSlice';

export function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, token } = useAppSelector((s) => s.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirm) {
            setLocalError('Passwords do not match');
            return;
        }

        const result = await dispatch(register({ name, email, password }));
        if (register.fulfilled.match(result)) {
            navigate('/', { replace: true });
        }
    }

    const submitting = status === 'loading';
    const shownError = localError ?? error;

    return (
        <div className="auth-card">
            <h1>Create an account</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                    />
                </div>
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={72}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="confirm">Confirm password</label>
                    <input
                        id="confirm"
                        type="password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>

                {shownError && <div className="form-error">{shownError}</div>}

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="auth-alt">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}