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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <div>
        <h1 className="modal-header">Log In</h1>
      </div>
      <div className="form-div">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="form-input"
              type="text"
              placeholder="Username or Email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            {errors.password && <p>{errors.credential}</p>}
          </div>

          <div>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p>{errors.password}</p>}
          </div>

          {errors.credential && <p>{errors.credential}</p>}

          <div className="button-div">
            <button className="form-button" type="submit">
              Log In
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
