import React, { Component, useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { SocketContext } from '../context/socket';

// visuals
import waiting from '../images/messages-typing.gif'; 
import nodding_head from '../images/yes.gif';
import wave from '../images/waving.gif'; 
import maybe from '../images/maybe.gif'; 
import come from '../images/come.gif';
import gear from "../images/gear.png"
import gearHover from "../images/gear_hover.png"
import arrow from "../images/arrow.png"
import happy from "../images/happy.gif"
import arrowHover from "../images/arrow_hover.png"

// audios
import yes_audio from '../audios/yes.mp3';
import come_audio from '../audios/come.mp3';
import hi_audio from '../audios/hi.mp3';
import maybe_audio from '../audios/maybe.mp3';
import Settings from './Settings';
import back_audio from "../audios/go_back.mp3";
import settings_audio from "../audios/settings.mp3";
import interpretation_audio from "../audios/interpretation.mp3";
import waiting_audio from "../audios/waiting.mp3";
import happy_audio from "../audios/fun.mp3";

// style
import "./Interpretation.css";

var timeout;

let hoverIsOn = true;

// audios
let yesAudio = new Audio(yes_audio);
let comeAudio = new Audio(come_audio);
let hiAudio = new Audio(hi_audio);
let maybeAudio = new Audio(maybe_audio);
let settingsAudio = new Audio(settings_audio);
let goBackAudio = new Audio(back_audio);
let interpretationAudio = new Audio(interpretation_audio);
let waitingAudio = new Audio(waiting_audio);
let funAudio = new Audio(happy_audio);
let allAudios = [yesAudio, comeAudio, hiAudio, maybeAudio, settingsAudio, 
    goBackAudio, interpretationAudio, waitingAudio, funAudio];

function displayResponse(state, setState, response) {
    console.log(response);
    let audio, responseImage, responseText, responseColor;

    if (response == 'yes') {
        console.log('yes branch');
        audio = yesAudio;

        responseImage = nodding_head;
        responseText = 'Yes!';
        responseColor = '#18961b';

    } else if (response == 'come') {
        console.log('come branch');
        audio = comeAudio;

        responseImage = come;
        responseText = 'Can someone come here?';
        responseColor = '#ad301f';

    } else if (response == 'hi') {
        console.log('hi branch');
        audio = hiAudio;

        responseImage = wave;
        responseText = 'Hi!';
        responseColor = '#2e49a3';

    } else if (response == 'maybe') {
        console.log('maybe branch');
        audio = maybeAudio;

        responseImage = maybe;
        responseText = 'Maybe...';
        responseColor = '#f5a85b';

    } else if (response == 'happy') {
        console.log('happy branch');
        audio = funAudio;

        responseImage = happy;
        responseText = 'This is fun!';
        responseColor = '#db6935';

    } // end of if-else
    
    if (state.isDisplayOn) {
        clearTimeout(timeout);
        setState({
            image: responseImage,
            text: responseText,
            backgroundColor: responseColor,
            isDisplayOn: state.isDisplayOn,
            isAudioOn: state.isAudioOn,
        });
    } else {
        clearTimeout(timeout);
        setState({
            text: responseText,
            backgroundColor: responseColor,
            isDisplayOn: state.isDisplayOn,
            isAudioOn: state.isAudioOn,
        });
    }
    
    if (state.isAudioOn) {
        allAudios.forEach(function(a) {
            a.pause();
            a.currentTime = 0;
        });

        audio.play();
    }

    console.log("displayResponse State: ", state);

    timeout = setTimeout(() => {
        setState({
            view: state.view,
            image: waiting,
            text: 'Waiting for a gesture to be made ...',
            isDisplayOn: state.isDisplayOn,
            isAudioOn: state.isAudioOn,
            displayHoverGear: state.displayHoverGear
        });
    }, 3000);
};

function setViewToSettings(state, setState) {
    var prevState = {state};
    prevState["view"] = "settings";
    setState(prevState);
    console.log(state);

    clearTimeout(timeout);
}

function playAudio(audio) {
    if (hoverIsOn) {
        // if the mouse moves to another element before the previous sound finishes,
        // stop the previous sound before playing the new sound
        // this is to prevent sounds from overlapping one another with quick mouse movement
        allAudios.forEach(function(a) {
        a.pause();
        a.currentTime = 0;
        })

        audio.play();
    }
}

function handleHover(state, setState, button, mouseEnter) {
    if (button == 'settings') {
        playAudio(settingsAudio);
        changeGear(state, setState, mouseEnter);
    } else if (button == 'goBack') {
        playAudio(goBackAudio);
        changeArrow(state, setState, mouseEnter);
    }
}

function changeGear(state, setState, mouseEnter) {
    setState({
        backgroundColor: state.backgroundColor,
        displayWaiting: state.displayWaiting,
        displayYes: state.displayYes,
        displayNo: state.displayNo,
        displayHi: state.displayHi,
        isDisplayOn: state.isDisplayOn,
        isAudioOn: state.isAudioOn,
        image: state.image,
        text: state.text,
        displayHoverGear: mouseEnter,
        displayHoverArrow: state.displayHoverArrow
    });
}

function changeArrow(state, setState, mouseEnter) {
    setState({
        backgroundColor: state.backgroundColor,
        displayWaiting: state.displayWaiting,
        displayYes: state.displayYes,
        displayNo: state.displayNo,
        displayHi: state.displayHi,
        isDisplayOn: state.isDisplayOn,
        isAudioOn: state.isAudioOn,
        image: state.image,
        text: state.text,
        displayHoverGear: state.displayHoverGear,
        displayHoverArrow: mouseEnter
    });
}

const Interpretation = (props) => {
    console.log("prop: ", props.parentState);
    hoverIsOn = props.parentState.hover;

    const socket = useContext(SocketContext);
    let firstGesture = ""
    let numGestures = 0

    // TODO: should I be using a mutex for incrementing the value??
    // Handle the data from socket to keep track of number of gestures
    let timeout = null
    function socketHandler(data) {
      console.log({firstGesture, numGestures})
        window.clearTimeout(timeout)
        if (firstGesture === "Hard tap") {
            numGestures += 1;
        }
        else {
            firstGesture = data.gesture;
            numGestures = 1;
        }
        timeout = window.setTimeout(interpretGesture, 2000)
    }

    useEffect(() => {
        // as soon as the component is mounted, do the following tasks:
        // subscribe to socket events
        socket.on("frontend", socketHandler); 
    
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
          socket.off("frontend", socketHandler);
        };
    }, [socket]);

    const history = useHistory();
    const [state, setState] = useState({
        backgroundColor: '#1c1c1c',
        displayWaiting: true,
        displayYes: false,
        displayNo: false,
        displayHi: false,
        isDisplayOn: true,
        isAudioOn: true,
        image: waiting,
        text: 'Waiting for a gesture to be made ...',
        displayHoverGear: false,
        displayHoverArrow: false,
    });

    const stateRef = useRef();
    stateRef.current = {
        view: state.view,
        isDisplayOn: state.isDisplayOn,
        isAudioOn: state.isAudioOn,
    };

    function interpretGesture() {
        if (stateRef.current.view == "settings") {
            return;
        }
        console.log("1 second has passed, processing gesture(s) now")
        if (firstGesture == "Soft tap") {
            displayResponse(stateRef.current, setState, 'maybe');
        }
        else if (firstGesture == "Hold") {
            displayResponse(stateRef.current, setState, 'come');
        }
        else if (firstGesture == "Hard tap") {
            if (numGestures == 1) {
                displayResponse(stateRef.current, setState, 'yes');
            }
        }
        if (numGestures == 2) {
            displayResponse(stateRef.current, setState, 'hi');
        }
        else if (numGestures > 4) {
          displayResponse(stateRef.current, setState, 'happy')
        }
        firstGesture = "";
        numGestures = 0;
    }

    console.log("Interpretation props: ", props);

    return (
        <div>
        { state.view == "settings" ?
            <Settings setter={setState} parentState={state} hover={props.parentState.hover} />
        :
            <div class="size" style={{backgroundColor: state.backgroundColor}}>
                <button class="goBackButton" 
                    onMouseEnter={() => handleHover(state, setState, 'goBack', true)}
                    onMouseLeave={() => changeArrow(state, setState, false)} 
                    onClick={() => history.push("/")}>
                    <img src={state.displayHoverArrow ? arrowHover : arrow} />
                </button>

                <button id="settings" id="settingsGear" 
                    onMouseEnter={() => handleHover(state, setState, 'settings', true)}
                    onMouseLeave={() => changeGear(state, setState, false)}
                    onClick={() => setViewToSettings(state, setState)}>
                    <img src={state.displayHoverGear ? gearHover : gear} />
                </button>

                <h1 id="interpretHeader"
                    style={{backgroundColor: state.backgroundColor}}
                    onMouseEnter={() => playAudio(interpretationAudio)}>
                    Interpretation
                </h1>

                <div className="center" style={{backgroundColor: state.backgroundColor}}>
                    <img class={state.image == undefined ? "hidden" : ""} style={{backgroundColor: state.backgroundColor}} src={state.image} alt="Logo"/>
                    <p 
                        style={{backgroundColor: state.backgroundColor}}
                        onMouseEnter={() => {
                            if (state.text == "Waiting for a gesture to be made ...") {
                                playAudio(waitingAudio);
                            }  
                        }}>
                        {state.text}
                    </p>
                </div>

                {/* <div class="testButtons">
                    <button id="yes" 
                        onClick={() => displayResponse(state, setState, 'yes')}>
                        yes
                    </button>
                    <button id="no" 
                        onClick={() => displayResponse(state, setState, 'come')}>
                        come
                    </button>
                    <button id="hi" 
                        onClick={() => displayResponse(state, setState, 'hi')}>
                        hi
                    </button>
                    <button id="maybe" 
                        onClick={() => displayResponse(state, setState, 'maybe')}>
                        maybe
                    </button>
                    <button id="fun" 
                        onClick={() => displayResponse(state, setState, 'happy')}>
                        fun
                    </button>
                </div> */}
            </div>
        }
        </div>
    );
}

export default Interpretation;
