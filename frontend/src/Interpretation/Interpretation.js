import React, { Component, useState, useContext, useEffect } from 'react';
import { SocketContext } from '../context/socket';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image
//import checkmark from '../images/checkmark.png'; // Tell webpack this JS file uses this image
import nodding_head from '../images/yes.gif';
//import xmark from '../images/xmark.png'; // Tell webpack this JS file uses this image
import shaking_head from '../images/no.gif';
import wave from '../images/waving.gif'; // Tell webpack this JS file uses this image
import maybe from '../images/maybe.gif'; // Tell webpack this JS file uses this image
import yes_audio from '../audios/yes.mp3';
import no_audio from '../audios/no.mp3';
import hi_audio from '../audios/hi.mp3';
import maybe_audio from '../audios/maybe.mp3';
import { useHistory } from 'react-router-dom';
import Settings from './Settings';
import "./Interpretation.css";

function displayResponse(state, setState, response) {
    console.log(response);
    let audio;
    if (response == 'yes') {
        console.log('yes branch');
        audio = new Audio(yes_audio);
        audio.play();
        setState({
            image: nodding_head,
            text: 'Yes!',
            backgroundColor: '#18961b'
        });

    } else if (response == 'no') {
        console.log('no branch');
        audio = new Audio(no_audio);
        setState({
            image: shaking_head,
            text: 'No!',
            backgroundColor: '#ad301f'
        });

    } else if (response == 'hi') {
        console.log('hi branch');
        audio = new Audio(hi_audio);
        setState({
            image: wave,
            text: 'Hi!',
            backgroundColor: '#2e49a3'
        });

    } else if (response == 'maybe') {
        console.log('maybe branch');
        audio = new Audio(maybe_audio);
        setState({
            image: maybe,
            text: 'Maybe...',
            backgroundColor: '#f5a85b'
        });

    } // end of if-else

    if (state.isAudioOn) {
        audio.play();
    }
    setTimeout(() => {
        setState({
            image: waiting,
            text: 'Waiting for a response...',
            isDisplayOn: state.isDisplayOn,
            isAudioOn: state.isAudioOn,
        });
    }, 3000);
};

function setViewToSettings(state, setState) {
    setState({
        view: "settings",
    })
    var prevState = {state};
    prevState["view"] = "settings";
    setState(prevState);
    console.log(state);
}

const Interpretation = (props) => {
    const socket = useContext(SocketContext);
    let currGesture = ""
    let numCurrGesture = 0

    // TODO: should I be using a mutex for incrementing the value??
    // Handle the data from socket to keep track of number of gestures
    let timeout = null
    function socketHandler(data) {
      console.log({currGesture, numCurrGesture})
        window.clearTimeout(timeout)
        if (data.gesture == currGesture) {
            numCurrGesture += 1;
        }
        else {
            currGesture = data.gesture;
            numCurrGesture = 1;
        }
        timeout = window.setTimeout(interpretGesture, 1000)
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

    function interpretGesture() {
      console.log("1 second has passed, processing gesture(s) now")
        if (currGesture == "soft tap") {
            if (numCurrGesture == 1) {
                displayResponse(setState, 'maybe');
            }
        }
        else if (currGesture == "hard tap") {
            if (numCurrGesture == 1) {
                displayResponse(setState, 'yes');
            }
            else if (numCurrGesture == 2) {
                displayResponse(setState, 'hi');
            }
            else if (numCurrGesture > 4) {
              displayResponse(setState, 'no')
            }
        }
        currGesture = "";
        numCurrGesture = 0;
    }

    // const interpretEvery2Seconds = window.setInterval(interpretGesture, 1500);

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
        text: 'Waiting for a response...'
    });

    console.log("interpretation render");
    console.log(state.view == "settings");
    console.log(state);

    return (
        <div>
        { state.view != "settings" ?
            <div class="size" style={{backgroundColor: state.backgroundColor}}>
                <button class="goBackButton" onClick={() => history.push("/")}>← Go back</button>
                <button id="settings" onClick={() => setViewToSettings(state, setState)}>⚙ Settings</button>
                <h1 style={{backgroundColor: state.backgroundColor}}>Interpretation</h1>
                <div className="center" style={{backgroundColor: state.backgroundColor}}>
                    <img style={{backgroundColor: state.backgroundColor}} src={state.image} alt="Logo"/>
                    <p style={{backgroundColor: state.backgroundColor}}>{state.text}</p>
                </div>
                <div class="testButtons">
                    <button id="yes" onClick={() => displayResponse(state, setState, 'yes')}>yes</button>
                    <button id="no" onClick={() => displayResponse(state, setState, 'no')}>no</button>
                    <button id="hi" onClick={() => displayResponse(state, setState, 'hi')}>hi</button>
                    <button id="maybe" onClick={() => displayResponse(state, setState, 'maybe')}>maybe</button>
                </div>
            </div>

        :  <Settings setter={setState} parentState={state} />
        }
        </div>
    );
}

export default Interpretation;
