// necessary imports and style
import React, { Component, useState } from "react";
import { useHistory, Link } from 'react-router-dom';
import useSound from 'use-sound';
import "./Home.css";
import HomeSettings from './HomeSettings';

// audios
import calibration from "../audios/calibration.mp3";
import interpretation from "../audios/interpretation.mp3";
import selectMode from "../audios/select_mode_below.mp3";
import welcome from "../audios/welcome.mp3"
import settings_audio from "../audios/settings.mp3";

// images
import frogs from "../images/frog.gif"

// audios
let calibrationAudio = new Audio(calibration);
let interpretationAudio = new Audio(interpretation);
let selectModeAudio = new Audio(selectMode);
let welcomeAudio = new Audio(welcome);
let settingsAudio = new Audio(settings_audio);
let allAudios = [calibrationAudio, interpretationAudio, selectModeAudio, welcomeAudio, settingsAudio];

let hoverIsOn = true;

function playAudio(audio) {
  // if the mouse moves to another element before the previous sound finishes,
  // stop the previous sound before playing the new sound
  // this is to prevent sounds from overlapping one another with quick mouse movement
  if (hoverIsOn) {
    allAudios.forEach(function(a) {
      a.pause();
      a.currentTime = 0;
    })

    audio.play();
  }
}

function setViewToSettings(state, setState) {
  setState({
    view: "settings"
  });
}

const Home = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        view: "home",
    });

    console.log("prop: ", props);

    hoverIsOn = props.parentState.hover;

    return (
      <div className="Home">
            {state.view == "settings" ? 
              <HomeSettings setter={setState} parentState={props.parentState} hover={props.hover}/> 
              
              : 
            
              <div className="lander">
                <h1
                  onMouseEnter={() => playAudio(welcomeAudio)}>
                  Welcome to Bubba Band!
                </h1>

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
                <button 
                  id="settings" 
                  onClick={() => setViewToSettings(state, setState)}
                  onMouseEnter={() => playAudio(settingsAudio)}>
                  ⚙ Settings
                </button> 
              </div> // lander
            }
        </div>
  
    );
};

export default Home;
