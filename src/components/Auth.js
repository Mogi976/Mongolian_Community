import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // For Signup
  const [lastName, setLastName] = useState(""); // For Signup
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // Default to Login mode

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        // Signup
        await createUserWithEmailAndPassword(auth, email, password);
        setIsLoginMode(true); // Switch to Login mode after successful signup
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{isLoginMode ? "Login" : "Signup"}</h2>
        <form onSubmit={handleAuth}>
          {!isLoginMode && (
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">
            {isLoginMode ? "Login" : "Signup"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</p>
          <button
            className="btn btn-link"
            onClick={() => {
              setIsLoginMode(!isLoginMode); // Toggle between Login and Signup
              setError(""); // Clear any existing errors
            }}
          >
            {isLoginMode ? "Signup" : "Login"}
          </button>
        </div>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="mx-2">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <div className="text-center">
          <button className="btn btn-danger w-100 mb-2" onClick={handleGoogleLogin}>
            <i className="bi bi-google me-2"></i> Continue with Google
          </button>
          <button className="btn btn-primary w-100" onClick={handleFacebookLogin}>
            <i className="bi bi-facebook me-2"></i> Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;