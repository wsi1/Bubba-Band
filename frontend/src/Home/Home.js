import React, { Component, useState } from "react";
import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import useSound from 'use-sound';
import calibration from "../audios/calibration.mp3";
import interpretation from "../audios/interpretation.mp3";
import selectMode from "../audios/select_mode_below.mp3";
import welcome from "../audios/welcome.mp3"
import frogs from "../images/frog.gif"
import "./Home.css";

function setViewToSettings(state, setState) {

}

let calibrationAudio = new Audio(calibration);
let interpretationAudio = new Audio(interpretation);
let selectModeAudio = new Audio(selectMode);
let welcomeAudio = new Audio(welcome);

let allAudios = [calibrationAudio, interpretationAudio, selectModeAudio, welcomeAudio];

function playAudio(audio) {
  // if the mouse moves to another element before the previous sound finishes,
  // stop the previous sound before playing the new sound
  // this is to prevent sounds from overlapping one another with quick mouse movement
  allAudios.forEach(function(a) {
    a.pause();
    a.currentTime = 0;
  })

  audio.play();
}

const Home = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        view: "home",
    });

    //const [playCalibration] = useSound(calibration);
    const [playInterpretation] = useSound(interpretation);

    return (
      <div className="Home">
        <div className="lander">

            {/*
            {state.view == "settings" ? <Settings setter={setState} parentState={state} : }
            <button id="settings" >⚙ Settings</button> 
            */}
            <h1
              onMouseEnter={() => playAudio(welcomeAudio)}>
              Welcome to Bubba Band!</h1>
            <img src={frogs} id="homeImage" alt="Logo"/>
            <p id="home"
            onMouseEnter={() => playAudio(selectModeAudio)}>
              Select a mode below to begin
            </p>
            <div class="flex-container">

            <button 
              variant="btn btn-success" 
              class="homeButton" 
              onMouseEnter={() => playAudio(calibrationAudio)}
              onClick={() => history.push('/calibration')}> 
              Calibration
            </button>
            <button 
              variant="btn btn-success" 
              class="homeButton" 
              onMouseEnter={() => playAudio(interpretationAudio)}
              onClick={() => history.push('/interpretation')}>
              Interpretation
            </button>
          </div>
        </div>
      </div>
    );
};

export default Home;
