import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="nav-header">
      <NavLink className="home-button" exact to="/">
        <i
          class="fa-brands fa-airbnb fa-rotate-180 fa-lg"
          style={{ color: "#ff0000" }}
        ></i>{" "}
        StayCationBnB
      </NavLink>
      {isLoaded && (
        <div>
          {sessionUser && (
            <NavLink className="create-new-spot-link" exact to="/spots/new">
              Create a new spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
