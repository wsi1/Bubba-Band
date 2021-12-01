// necessary imports and style
import React, { Component, useState } from "react";
import { useHistory, Link } from 'react-router-dom';
import useSound from 'use-sound';
import "./Home.css";
import HomeSettings from './HomeSettings';
import Popup from './Popup';

// audios
import calibration from "../audios/calibration.mp3";
import interpretation from "../audios/interpretation.mp3";
import selectMode from "../audios/select_mode_below.mp3";
import welcome from "../audios/welcome.mp3"
import settings_audio from "../audios/settings.mp3";

// images
import frogs from "../images/frog.gif"
import gear from "../images/gear.png"
import gearHover from "../images/gear_hover.png"

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

    let startPlayPromise = audio.play();
    if (startPlayPromise !== undefined) {
      startPlayPromise.then(() => {
        // Start whatever you need to do only after playback
        // has begun.
        return true;

      }).catch(error => {
        if (error.name === "NotAllowedError") {
          console.log("BAD");
          return false;
        } else {
          // Handle a load or playback error
          console.log("Possible playback error");
          return true;
        }
      });
    }
  }
}

function setViewToSettings(state, setState) {
  setState({
    view: "settings",
  });
}

function changeGear(state, setState) {
  setState({
    view: "home",
    displayHoverGear: !state.displayHoverGear
  });
}

function handleGearClick(state, setState) {
  playAudio(settingsAudio);
  changeGear(state, setState)
}

const Home = (props) => {
    console.log("props hehe", props)

    const history = useHistory();
    const [state, setState] = useState({
        view: "home",
        displayHoverGear: false,
        popup: !playAudio(welcomeAudio)
    });

    console.log("RERENDERED");
    
    const [buttonPopup, setButtonPopup] = useState(false);

    //console.log("prop: ", props);
    console.log("display popup", state.popup);
    console.log("!playAudio", !playAudio(welcomeAudio));

    hoverIsOn = props.parentState.hover;

    return (
      <div className="Home">
            {state.view == "settings" ? 
              <HomeSettings setter={setState} parentState={props.parentState} hover={props.hover}/> 
              
              : 
            
              <div>
                <button 
                    id="settingsGear" 
                    onClick={() => setViewToSettings(state, setState)}
                    onMouseEnter={() => handleGearClick(state, setState)}
                    onMouseLeave={() => changeGear(state, setState)}>
                    <img src={state.displayHoverGear ? gearHover : gear} />
                  </button> 
                <div className="lander">
                  <h1 id="homeTitle"
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
                  {/* end of lander */}
                </div> 
                {console.log(state)}
                <Popup trigger={state.popup} parentState={props.parentState} setter={setState} setTrigger={setButtonPopup}></Popup>
              </div>
            }
        </div>
    );
};

export default Home;
