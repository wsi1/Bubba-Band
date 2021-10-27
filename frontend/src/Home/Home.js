import React, { Component, useState } from "react";
import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import useSound from 'use-sound';
import calibration from "../audios/calibration.mp3";
import interpretation from "../audios/interpretation.mp3";
import frogs from "../images/frog.gif"

import "./Home.css";
function setViewToSettings(state, setState) {

}
const Home = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        view: "home",
    });
    const [playCalibration] = useSound(calibration);
    const [playInterpretation] = useSound(interpretation);
    return (
      <div className="Home">
        <div className="lander">

            {/*
            {state.view == "settings" ? <Settings setter={setState} parentState={state} : }
            <button id="settings" >⚙ Settings</button> 
            */}
            <h1>Welcome to Bubba Band!</h1>
            <img src={frogs} alt="Logo"/>
            <p>Select a mode below to begin</p>
            <div class="flex-container">

            <button 
            variant="btn btn-success" 
            class="homeButton" 
            onMouseEnter={() => playCalibration()}
            onClick={() => history.push('/calibration')}> 
            Calibration
            </button>

            <button 
            variant="btn btn-success" 
            class="homeButton" 
            onMouseEnter={() => playInterpretation()}
            onClick={() => history.push('/interpretation')}>
            Interpretation
            </button>
          </div>
        </div>
      </div>
    );
};

export default Home;
