import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      closeMenu();
      history.push("/");
    });
  };

  const dropdownClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="menu-button" onClick={openMenu}>
        <i className="fas fa-regular fa-bars fa-lg menu-button-icon" />
        <i className="fas fa-user-circle fa-lg menu-button-icon" />
      </button>
      <div className={dropdownClassName} ref={ulRef}>
        {user ? (
          <>
            <div style={{ padding: "5px 10px" }}>
              <div>Hello, {user.username}</div>
              {/* <div>
              {user.firstName} {user.lastName}
            </div> */}
              <div>{user.email}</div>
            </div>
            <NavLink className="manage-spot-link" exact to="/spots/current">
              Manage Spots
            </NavLink>
            <div className="logout-div">
              <button className="logout-button" onClick={logout}>
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
