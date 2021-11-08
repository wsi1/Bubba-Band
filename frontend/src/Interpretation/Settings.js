import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';

// audios
import back_audio from "../audios/go_back.mp3";
import settings_audio from "../audios/settings.mp3";
import animations_audio from "../audios/animations.mp3";
import audio_output_audio from "../audios/audio_output.mp3";

// images
import waiting from '../images/messages-typing.gif'; 
import soundIcon from "../images/volume-up-solid.svg";
import noSoundIcon from "../images/volume-mute-solid.svg";
import displayIcon from "../images/eye-solid.svg";
import noDisplayIcon from "../images/eye-slash-solid.svg";
import arrow from "../images/arrow.png"
import arrowHover from "../images/arrow_hover.png"

import "./Settings.css";

let goBackAudio = new Audio(back_audio);
let settingsAudio = new Audio(settings_audio);
let animationsAudio = new Audio(animations_audio);
let audioOutputAudio = new Audio(audio_output_audio);

let allAudios = [goBackAudio, settingsAudio, animationsAudio, audioOutputAudio];

let hoverIsOn = true;

function goBack(state, setState) {
  setState({
    backgroundColor: '#1c1c1c',
    displayWaiting: true,
    displayYes: false,
    displayNo: false,
    displayHi: false,
    isDisplayOn: state.isDisplayOn,
    isAudioOn: state.isAudioOn,
    image: waiting,
    text: 'Waiting for a gesture to be made ...'
  });
}

function updateDisplayToggle(state, setState) {
  var checkBox = document.getElementById("displayToggle");
  console.log(checkBox.checked);
  setState({
    view: "settings",
    isDisplayOn: checkBox.checked,
    isAudioOn: state.isAudioOn
  })
}

function updateAudioToggle(state, setState) {
  var checkBox = document.getElementById("audioToggle");
  console.log(checkBox.checked);
  setState({
    view: "settings",
    isDisplayOn: state.isDisplayOn,
    isAudioOn: checkBox.checked
  })
}

function playAudio(audio) {
  // if the mouse moves to another element before the previous sound finishes,
  // stop the previous sound before playing the new sound
  // this is to prevent sounds from overlapping one another with quick mouse movement
  if(hoverIsOn) {
    allAudios.forEach(function(a) {
      a.pause();
      a.currentTime = 0;
    })

    audio.play();
  }
}

function handleArrowHover(state, setState, mouseEnter) {
  playAudio(goBackAudio);
  changeArrow(state, setState, mouseEnter);
}

function changeArrow(state, setState, mouseEnter) {
  setState({
    view: state.view,
    isDisplayOn: state.isDisplayOn,
    isAudioOn: state.isAudioOn,
    displayHoverArrow: mouseEnter
  });
}

const Settings = (props) => {
  const history = useHistory();
  const [state, setState] = useState(props.parentState.state);

  console.log(props.hover);

  hoverIsOn = props.hover;

  return (
    <div>
      <button class="goBackButton" 
          onMouseEnter={() => handleArrowHover(state, setState, true)}
          onMouseLeave={() => changeArrow(state, setState, false)} 
          onClick={() => goBack(state, props.setter)}>
          <img src={state.displayHoverArrow ? arrowHover : arrow} />
      </button>
      <div id="all">
          <h1
            onMouseEnter={() => playAudio(settingsAudio)}>
            Settings
          </h1>      
          </div>
          <div class="content">
            <div class="settings">
                <p class="title" onMouseEnter={() => playAudio(animationsAudio)}>Animations</p>
                <p class="caption">When turned on, an animation will appear each time a gesture is made.</p>
                {state.isDisplayOn ? 
                <div>
                  <img className="icon" src={displayIcon} alt="Eye Icon" /> 
                </div>
                :
                <div>
                  <img className="icon" src={noDisplayIcon} alt="No Eye Icon" />
                </div>
                }
                <p class="descr">{state.isDisplayOn ? "Animations for gestures are ON" : "Animations for gestures are OFF"}</p>
                <div class="buttonContainer">
                  <label class="switch">
                    <input type="checkbox" id="displayToggle" checked={state.isDisplayOn} onChange={() => updateDisplayToggle(state, setState)}/>
                    <span class="slider round"></span>
                  </label>
                </div>
            </div>
            <div class="settings">
                <p class="title" onMouseEnter={() => playAudio(audioOutputAudio)}>Audio</p>
                <p class="caption">When turned on, audio of the interpreted response will play each time a gesture is made.</p>
                {state.isAudioOn ? 
                <div>
                  <img className="icon" src={soundIcon} alt="Sound Icon" /> 
                </div>
                :
                <div>
                  <img className="icon" src={noSoundIcon} alt="No Sound Icon" />
                </div>
                }
                <p class="descr">{state.isAudioOn ? "Audio for gestures is ON" : "Audio for gestures is OFF"}</p>
                <div class="buttonContainer">
                  <label class="switch">
                    <input type="checkbox" id="audioToggle" checked={state.isAudioOn} onChange={() => updateAudioToggle(state, setState)}/>
                    <span class="slider round"></span>
                  </label>
                </div>
            </div>
        </div>
      </div>
  );
};

export default Settings;
