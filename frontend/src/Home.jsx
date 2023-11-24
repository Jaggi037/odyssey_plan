import React, { useState } from "react";
import "./Home.css";
import Icon from './assets/icon_dark.png';
import Background from './assets/homepage.png';
import App from './App';  // Import the App component
import { LocalLoging } from "./pages/auth/components/LocalLogin";
import Auth from "./pages/auth/auth";

export const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="homepage">
      <div className="home">
        <div className="header">
          <img src={Icon} alt="Icon" className="logo" />
          <button className="button" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
        <hr className="divider" />
        <div className="content">
          <div className="details">
            <h5 className="des">Empower Your Productivity with a Single App</h5>
            <h1 className="name">WORKSPACES</h1>
            <button className="GetStarted" onClick={handleLogin}>Get Started</button>
          </div>
        </div>
      </div>
      <div className="background">
        <img src={Background} alt="background" />
      </div>
    </div>
  );
};
