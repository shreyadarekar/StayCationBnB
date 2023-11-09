import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const loginUser = (credential, password) =>
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    loginUser(credential, password);
  };

  return (
    <>
      <div>
        <h1 className="modal-header">Log In</h1>
      </div>
      <div className="form-div">
        {errors.message && <p className="error">{errors.message}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="form-input"
              type="text"
              placeholder="Username or Email"
              value={credential}
              onChange={(e) => {
                setErrors({});
                setCredential(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setErrors({});
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <div className="login-button-div">
            <button
              className="login-button"
              type="submit"
              disabled={credential.length <= 3 || password.length <= 5}
            >
              Log In
            </button>
          </div>
        </form>

        <div>
          <button
            className="demo-user-button"
            onClick={() => loginUser("Demo-lition", "password")}
          >
            Demo User
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginFormModal;
