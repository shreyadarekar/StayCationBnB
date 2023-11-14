import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import { useHistory } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(() => {
          history.push("/");
          closeModal();
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <div>
        <h1 className="modal-header">Sign Up</h1>
      </div>

      {errors.firstName && <p className="error">{errors.firstName}</p>}
      {errors.lastName && <p className="error">{errors.lastName}</p>}
      {errors.email && <p className="error">{errors.email}</p>}
      {errors.username && <p className="error">{errors.username}</p>}
      {errors.password && <p className="error">{errors.password}</p>}
      {errors.confirmPassword && (
        <p className="error">{errors.confirmPassword}</p>
      )}

      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <input
            className="signup-form-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="signup-form-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="signup-form-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="signup-form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="signup-form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="signup-form-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="button-div">
          <button
            className="signup-button"
            type="submit"
            disabled={
              !firstName ||
              !lastName ||
              !email ||
              !username ||
              !password ||
              !confirmPassword
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
