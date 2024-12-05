import React from 'react';
import './styles/SignInPage.css';

const SignInPage = ({ signInWithGoogle }) => {
    return (
        <div className="sign-in-container">
            <h1 className="welcome-message">Welcome to TCS Participation App</h1>
            <p className="welcome-subtext">
                Engage with your class, earn rewards, and have fun!
            </p>
            <button className="sign-in-button" onClick={signInWithGoogle}>
                Sign In with Google
            </button>
            <div className="footer">
                <p>
                    By signing in, you agree to our{' '}
                    <a href="/terms" target="_blank">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank">
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
