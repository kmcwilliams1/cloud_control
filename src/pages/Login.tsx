import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../CSS/Login.css';
import {useAuth} from '../contexts/AuthContext';

type Profile = {
    email: string;
    password: string;
    role: 'admin' | 'user' | 'guest' | string;
};

function parseCsv(text: string): Profile[] {
    console.debug('parseCsv - raw text (first 300 chars):', text.slice(0, 300));
    const noBOM = text.replace(/^\uFEFF/, '');
    const rawLines = noBOM.split(/\r?\n/);
    const lines = rawLines.map((l) => l.trim()).filter((l) => l !== '');
    console.debug('parseCsv - raw non-empty lines length:', lines.length, 'sample:', lines.slice(0, 10));

    if (lines.length === 0) return [];

    // Take first non-empty line as candidate for header.
    let first = lines.shift()!;
    const strippedCandidate = first.replace(/^[/#\s]+/, '').trim(); // remove leading // or # if present
    const candidateCols = strippedCandidate.split(',').map((c) => c.trim().toLowerCase());

    // If candidate contains at least one known header token, treat it as header.
    const hasHeaderToken = candidateCols.some((c) => ['email', 'password', 'role'].includes(c));
    let headers: string[];
    if (hasHeaderToken) {
        headers = candidateCols;
        console.debug('parseCsv - header detected (stripped if commented):', headers);
    } else {
        // Not a header: push candidate back as data row and use defaults.
        lines.unshift(first);
        headers = ['email', 'password', 'role'];
        console.debug('parseCsv - no header found, using default headers:', headers);
    }

    const profiles = lines.map((line) => {
        const cols = line.split(',').map((c) => c.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
            obj[h] = cols[i] ?? '';
        });
        return obj as Profile;
    });

    console.debug('parseCsv - parsed profiles count:', profiles.length, 'sample:', profiles.slice(0, 10));
    return profiles;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useAuth();

   const checkCredentials = async (emailInput: string, passwordInput: string) => {
       const url = `${process.env.PUBLIC_URL || ''}/profiles.csv`;
       console.debug('checkCredentials - fetching url:', url);
       const res = await fetch(url, { cache: 'no-store' });
       if (!res.ok) {
           console.error('checkCredentials - fetch failed with status', res.status);
           throw new Error('Failed to load profiles');
       }
       const text = await res.text();
       console.debug('checkCredentials - fetched text length:', text.length);

       // Detect HTML (index.html) being returned instead of CSV
       const contentType = (res.headers.get('content-type') || '').toLowerCase();
       if ((!contentType.includes('csv') && text.trim().startsWith('<')) || contentType.includes('html')) {
           console.error('checkCredentials - fetched HTML instead of CSV, url:', url);
           throw new Error('Profiles not found');
       }

       const profiles = parseCsv(text);
       console.debug('checkCredentials - profiles length:', profiles.length);

       console.debug('checkCredentials - normalized inputs:', {
           emailInput: emailInput.trim().toLowerCase(),
           passwordInput: passwordInput,
       });

       for (let i = 0; i < profiles.length; i++) {
           const p = profiles[i];
           const pEmail = (p.email ?? '').trim().toLowerCase();
           const pPassword = p.password ?? '';
           const emailMatch = pEmail === emailInput.trim().toLowerCase();
           const passwordMatch = pPassword === passwordInput;
           console.debug(`checkCredentials - profile[${i}]`, {
               pEmail,
               pPassword,
               emailMatch,
               passwordMatch,
               role: p.role,
           });
           if (emailMatch && passwordMatch) {
               console.debug('checkCredentials - match found at index', i, p);
               return p;
           }
       }

       console.debug('checkCredentials - no match found');
       return null;
   };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.debug('onSubmit - entered values', {email, password});
        setLoading(true);
        try {
            const match = await checkCredentials(email, password);
            if (!match) {
                alert('Invalid email or password');
                setLoading(false);
                return;
            }
            setUser({id: match.email, name: match.email, role: match.role as 'admin' | 'user' | 'guest'});
            setLoading(false);
            navigate('/home');
        } catch (err) {
            console.error('onSubmit - error', err);
            alert('Login failed: ' + ((err as Error).message || 'unknown error'));
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <h1 className="brand">Cloud Control</h1>

            <form className="login-form" onSubmit={onSubmit} aria-label="Login form">
                <input
                    className="pill-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <input
                    className="pill-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                <button className="pill-button" type="submit" disabled={loading}>
                    {loading ? 'Checking...' : 'Login'}
                </button>

                <div style={{marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center'}}>
                    <Link to="/forgotpassword" className="home-button">
                        Forgot Password
                    </Link>
                </div>
            </form>
        </main>
    );
};

export default Login;