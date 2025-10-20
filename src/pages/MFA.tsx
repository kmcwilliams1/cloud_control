import React, {useState} from 'react';
import '../CSS/LoginSignup.css';

const MFA: React.FC = () => {
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle MFA code submission logic here
        console.log('MFA Code submitted:', code);

    }
    return (
        <main className="login-page">
            <h1 className="brand">Cloud Control</h1>

            <form className="login-form" onSubmit={handleSubmit} aria-label="MFA Code Form">
                <input
                    className="pill-input"
                    type="text"
                    placeholder="Phone number"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <input
                    className="pill-input"
                    type="text"
                    placeholder="Authentication Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <input
                    className="pill-input"
                    type="text"
                    placeholder="Backup Email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />


                <button className="pill-button" type="submit">Submit</button>
            </form>
        </main>
    );

};

export default MFA;