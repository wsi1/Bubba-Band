import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import "./Home.css";

const Home = (props) => {
    const history = useHistory();
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome to Bubba Band!</h1>
          <p>Select a mode below to begin</p>
          <div class="flex-container">
            <button variant="btn btn-success" class="homeButton" onClick={() => history.push('/calibration')}>Calibration</button>
            <button variant="btn btn-success" class="homeButton" onClick={() => history.push('/interpretation')}>Interpretation</button>
          </div>
        </div>
      </div>
    );
};

export default Home;
