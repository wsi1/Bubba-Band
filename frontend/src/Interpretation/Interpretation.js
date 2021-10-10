import React, { Component, useState, useContext, useEffect } from 'react';
import { SocketContext } from '../context/socket';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image
import checkmark from '../images/checkmark.png'; // Tell webpack this JS file uses this image
import xmark from '../images/xmark.png'; // Tell webpack this JS file uses this image
import wave from '../images/wave.gif'; // Tell webpack this JS file uses this image
import yes_audio from '../audios/yes.mp3';
import no_audio from '../audios/no.mp3';
import hi_audio from '../audios/hi.mp3';
import { useHistory } from 'react-router-dom';
import Settings from './Settings';
import "./Interpretation.css";

function displayResponse(setState, response) {
    console.log(response);
    if (response == 'yes') {
        console.log('yes branch');
        new Audio(yes_audio).play();
        setState({
            image: checkmark,
            text: 'Yes!',
            backgroundColor: '#18961b'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...'
            });
        }, 3000);
    } else if (response == 'no') {
        console.log('no branch');
        new Audio(no_audio).play();
        setState({
            image: xmark,
            text: 'No!',
            backgroundColor: '#ad301f'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...',
            });
        }, 3000);

    } else if (response == 'hi') {
        console.log('hi branch');
        new Audio(hi_audio).play();
        setState({
            image: wave,
            text: 'Hi!',
            backgroundColor: '#2e49a3'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...'
            });
        }, 3000);
    }
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

    const socketHandler = (data) => console.log(data);
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
                    <button id="yes" onClick={() => displayResponse(setState, 'yes')}>yes</button>
                    <button id="no" onClick={() => displayResponse(setState, 'no')}>no</button>
                    <button id="hi" onClick={() => displayResponse(setState, 'hi')}>hi</button>
                </div>
            </div>

        :  <Settings setter={setState} parentState={state} />
        }
        </div>
    );
}

export default Interpretation;