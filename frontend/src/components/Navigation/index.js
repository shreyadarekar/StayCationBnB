import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="nav-header">
      <NavLink activeClassName="home-button" exact to="/">
        <img src="./logo.png" alt="logo" className="logo" />
        StayCationBnB
      </NavLink>
      {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;
