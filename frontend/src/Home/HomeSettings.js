import React, { Component, useState, setState, useContext } from 'react';
import { socket, SocketContext } from '../context/socket';
import "./HomeSettings.css";

//images
import sound_icon from "../images/volume-up-solid.svg";
import noSound_icon from "../images/volume-mute-solid.svg";
import displayIcon from "../images/eye-solid.svg";
import noDisplayIcon from "../images/eye-slash-solid.svg";
import reset from "../images/reset.svg";
import arrow from "../images/arrow.png"
import arrowHover from "../images/arrow_hover.png"

//audios
import settings_audio from "../audios/settings.mp3";
import back_audio from "../audios/go_back.mp3";
import animations_audio from "../audios/animations.mp3";

let settingsAudio = new Audio(settings_audio);
let goBackAudio = new Audio(back_audio);
let animationsAudio = new Audio(animations_audio);
let allAudios = [settingsAudio, goBackAudio, animationsAudio];

function playAudio(audio, hoverIsOn) {
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

function goBack(setState, props) {
  setState({
    view: "home",
  });

  console.log("Settings props: ", props);
}

function updateHoverToggle(props, setter) {
  props.audioEnabled = !props.audioEnabled;

  setter({
    audioEnabled: props.audioEnabled,
    animateEnabled: props.animateEnabled
  });
}

function updateDisplayToggle(props, setter) {
  // var checkBox = document.getElementById("displayToggle");
  // console.log(checkBox.checked);
  // setState({
  //   view: "settings",
  //   isDisplayOn: checkBox.checked,
  //   isAudioOn: state.isAudioOn
  // })

  props.animateEnabled = !props.animateEnabled;

  setter({
    audioEnabled: props.audioEnabled,
    animateEnabled: props.animateEnabled
  });
}

function handleArrowHover(state, setState, mouseEnter) {
  playAudio(goBackAudio);
  changeArrow(state, setState, mouseEnter);
}

function changeArrow(state, setState, mouseEnter) {
  setState({
    audioEnabled: state.audioEnabled,
    animateEnabled: state.animateEnabled,    
    displayHoverArrow: mouseEnter
  });
}

function confirmReset(socket) {
  if (window.confirm("WARNING: Proceeding will erase all classification data. Click 'OK' to continue.")) {
    window.alert("Calibration data has been erased.")

    socket.emit("frontend", {action: "reset_model"});

    console.log("plz reset the model");
  }
}

const HomeSettings = (props) => {

  const [state, setState] = useState({
    audioEnabled: props.parentState.audioEnabled,
    animateEnabled: props.parentState.animateEnabled,
  });

  console.log("HomeSettings props:", props);
  console.log("HomeSettings state:", state);

  const socket = useContext(SocketContext);

  return (
    <div>
      <button 
        class="goBackButton" 
        onMouseEnter={() => handleArrowHover(state, setState, true)}
        onMouseLeave={() => changeArrow(state, setState, false)}
        onClick={() => goBack( props.setter, props)}>
        <img src={state.displayHoverArrow ? arrowHover : arrow} />
      </button>
      <div id="settingContainer">
          <div class="homeSettings">
              <p class="title" onMouseEnter={() => playAudio(animationsAudio)}>Animations</p>
              <p class="toggleCaption">Turn on to display animations.</p>
              {state.animateEnabled ? 
              <div>
                <img className="icon" src={displayIcon} alt="Eye Icon" /> 
              </div>
              :
              <div>
                <img className="icon" src={noDisplayIcon} alt="No Eye Icon" />
              </div>
              }
              {/* <p class="descr">{state.animateEnabled ? "Animations for gestures are ON" : "Animations for gestures are OFF"}</p> */}
              <div class="buttonContainer">
                <label class="switch">
                  <input type="checkbox" id="displayToggle" checked={state.animateEnabled} onChange={() => updateDisplayToggle(props.parentState, setState)}/>
                  <span class="slider round"></span>
                </label>
              </div>
          </div>

          <div class="vl"></div>

          <div class="homeSettings">
            <p class="title" onMouseEnter={() => playAudio(animationsAudio)}>Audio</p>
            <p class="toggleCaption">Turn on to hear text-to-speech audio.</p>
            {state.audioEnabled ? 
            <div>
              <img className="icon" src={sound_icon} alt="Sound Icon" /> 
            </div>
            :
            <div>
              <img className="icon" src={noSound_icon} alt="No Sound Icon" />
            </div>
            }
            {/* <p class="descr">{state.audioEnabled ? "Text-to-speech audio is ON" : "Text-to-speech audio is OFF"}</p> */}
            <div class="buttonContainer">
              <label class="switch">
                <input type="checkbox" id="hoverToggle" checked={state.audioEnabled} onChange={() => updateHoverToggle(props.parentState, setState)}/>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div class="vl"></div>
          <div class="homeSettings">
            {/* TODO: add rest model audio on hover */}
            <p class="title">Reset data</p>
            <p class="caption" id="reset">Press to erase all calibration data and reset the gesture classification model.</p>
            <div>
                <img className="resetIcon" src={reset} alt="Eye Icon" /> 
            </div>
            <div class="buttonContainer">
              <button 
                variant="btn btn-success" 
                class="resetButton" 
                onClick={() => confirmReset(socket)}> 
                Reset Data and Model
              </button>
            </div>
        </div>
      </div>  
      <h1 id="settingsHeader"
        onMouseEnter={() => playAudio(settingsAudio, state.audioEnabled)}>
          Settings
      </h1>
    </div>
  );
};

export default HomeSettings;
