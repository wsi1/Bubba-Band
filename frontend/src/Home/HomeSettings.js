import React, { Component, useState, setState } from 'react';
import "./HomeSettings.css";

import settings_audio from "../audios/settings.mp3";
import back_audio from "../audios/go_back.mp3";

let settingsAudio = new Audio(settings_audio);
let goBackAudio = new Audio(back_audio);
let allAudios = [settingsAudio, goBackAudio];

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
  props.hover = !props.hover;

  setter({
    hover: props.hover,
  });

  console.log("updateHoverToggle props after update: ", props);
}

const HomeSettings = (props) => {

  const [state, setState] = useState({
    hover: props.parentState.hover,
  });

  return (
    <div>
      <button 
        class="goBackButton" 
        onMouseEnter={() => playAudio(goBackAudio, state.hover)}
        onClick={() => goBack( props.setter, props)}>
        ← Go back
      </button>
      
      <div class="homeSettings">
        <p class="title">Auditory response</p>
        <p class="descr">Output response through speaker</p>
        <div class="buttonContainer">
          <label class="switch">
            <input type="checkbox" id="hoverToggle" checked={state.hover} onChange={() => updateHoverToggle(props.parentState, setState)}/>
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      
      <h1
        onMouseEnter={() => playAudio(settingsAudio, state.hover)}>
          Settings
      </h1>
    </div>
  );
};

export default HomeSettings;
