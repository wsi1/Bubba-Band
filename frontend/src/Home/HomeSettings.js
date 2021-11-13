import React, { Component, useState, setState } from 'react';
import "./HomeSettings.css";

//images
import sound_icon from "../images/volume-up-solid.svg";
import noSound_icon from "../images/volume-mute-solid.svg";
import arrow from "../images/arrow.png"
import arrowHover from "../images/arrow_hover.png"

//audios
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
  
  if(props.hover) {
    window.localStorage.setItem("hoverOn", "true");
  }
  else {
    window.localStorage.setItem("hoverOn", "false");
  }
  
  
  setter({
    hover: props.hover,
  });

  console.log("updateHoverToggle props after update: ", props);
}

function handleArrowHover(state, setState, mouseEnter) {
  playAudio(goBackAudio);
  changeArrow(state, setState, mouseEnter);
}

function changeArrow(state, setState, mouseEnter) {
  setState({
    hover: state.hover,
    displayHoverArrow: mouseEnter
  });
}

const HomeSettings = (props) => {

  
  const [state, setState] = useState({
    hover: props.hover,
  });

  
  return (
    <div>
      <button 
        class="goBackButton" 
        onMouseEnter={() => handleArrowHover(state, setState, true)}
        onMouseLeave={() => changeArrow(state, setState, false)}
        onClick={() => goBack( props.setter, props)}>
        <img src={state.displayHoverArrow ? arrowHover : arrow} />
      </button>
      
      <div class="homeSettings">
        <p class="descr">Play audio when mouse hovers over text</p>

        {state.hover ? 
        <div>
          <img className="icon" src={sound_icon} alt="Sound Icon" /> 
        </div>
        :
        <div>
          <img className="icon" src={noSound_icon} alt="No Sound Icon" />
        </div>
        }
        <p class="descr">{state.hover ? "Hover audio is ON" : "Hover audio is OFF"}</p>
        <div class="buttonContainer">
          <label class="switch">
            <input type="checkbox" id="hoverToggle" checked={state.hover} onChange={() => updateHoverToggle(state.hover, setState)}/>
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      
      <h1 id="settingsHeader"
        onMouseEnter={() => playAudio(settingsAudio, state.hover)}>
          Settings
      </h1>
    </div>
  );
};

export default HomeSettings;
