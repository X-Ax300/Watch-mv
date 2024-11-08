import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import LOGOPRIN from './assets/logoWMV.png';
import Carousel from './Carrousel';
import { collection, addDoc, increment } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { app, firestoreInstance } from './firestore';
import './PrivateRoute'

const auth = getAuth(app);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const payment = 0;
    const [tryPassword, setTryPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    function VerificarMail() {
        if (auth.currentUser) {
            var mail = auth.currentUser.emailVerified;
            if (mail) {
                navigate("/HomePage");

            } else {
                alert('Usuario mo verificado');
                auth.signOut();

            }
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSignUp) {
            if (password !== tryPassword) {
                showError('Passwords do not match');
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userID = userCredential.user.uid;
                const usuariosRef = collection(firestoreInstance, 'User');
                sendEmailVerification(auth.currentUser);
                await addDoc(usuariosRef, {
                    ID: increment(1),
                    userID: userID,
                    nombre: name,
                    email: email,
                    password: password,
                    payment: payment
                });

                showSuccess('Registered successfully');
                setTimeout(() => {
                    setIsSignUp(false); // Cambia a la vista de iniciar sesion despues del registro
                }, 3000);
            } catch (error) {
                showError("Error during registration");
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                VerificarMail();
            } catch (error) {
                showError("Invalid credentials");
            }
        }
    };

    const showError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const showSuccess = (successMessage) => {
        setSuccess(successMessage);
        setTimeout(() => {
            setSuccess('');
        }, 5000);
    };

    return (
        <div className=''>
            <div className='LogoWMV'>
                <img src={LOGOPRIN} alt='Logo' />
            </div>

            <div className={`LogIName ${isSignUp ? 'expanded' : ''}`}>
                <h1 className='titleLogin'>{isSignUp ? 'Register' : 'Log In'}</h1>
            </div>

            <div className={`inputContainer ${isSignUp ? 'expanded' : ''}`}>
                {isSignUp && (
                    <div className='inputField'>
                        <div className={`inputWrapper ${name ? 'focus' : ''}`}>
                            <label className='name'>Name</label>
                        </div>
                        <input
                            type='text'
                            id='name'
                            className='nameInput'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className='inputField'>
                    <div className={`inputWrapper ${email ? 'focus' : ''}`}>
                        <label className='email'>E-mail</label>
                    </div>
                    <input
                        type='email'
                        id='email'
                        className='emailInput'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='inputField'>
                    <div className={`inputWrapper ${password ? 'focus' : ''}`}>
                        <label className='password'>Password</label>
                    </div>
                    <input
                        type='password'
                        id='password'
                        className='passwordInput'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {isSignUp && (
                    <div className='inputField'>
                        <div className={`inputWrapper ${tryPassword ? 'focus' : ''}`}>
                            <label className='tryPassword'>Confirm Password</label>
                        </div>
                        <input
                            type='password'
                            id='tryPassword'
                            className='tryPasswordInput'
                            value={tryPassword}
                            onChange={(e) => setTryPassword(e.target.value)}
                        />
                    </div>
                )}

                <button onClick={handleSubmit} className='loginButton' id='btnLogIn'>
                    {isSignUp ? 'Register' : 'Log In'}
                </button>

                {!isSignUp ? (
                    <div className='signUpMessage'>
                        <p>First time on Watch.MV? </p>
                        <button
                            id='btnSignUp1'
                            className='BtnSignUp'
                            onClick={() => setIsSignUp(true)}
                        >
                            Sign up now
                        </button>
                    </div>
                ) : (
                    <div className='signUpMessage'>
                        <p>Already have an account? </p>
                        <button
                            id='btnSignIn'
                            className='BtnSignUp'
                            onClick={() => setIsSignUp(false)}
                        >
                            Sign in
                        </button>
                    </div>
                )}
            </div>

            <div className={`containerCarrousel ${isSignUp ? 'expanded' : ''}`}>
                <Carousel />
            </div>

            {error && (
                <div className="errorPopup">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="successPopup">
                    <p>{success}</p>
                </div>
            )}
        </div>
    );
}

export default Login;
