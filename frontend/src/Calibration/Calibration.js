// necessary imports and style
import React, { Component, useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../context/socket';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';
import "./Calibration.css";

// visuals
import waiting from "../images/messages-typing.gif";
import arrow from "../images/arrow.png"
import arrowHover from "../images/arrow_hover.png"

// audios
import back_audio from "../audios/go_back.mp3";
import add_gesture_audio from  "../audios/add_gesture.mp3";
import calibration_audio from "../audios/calibration.mp3";
import waiting_audio from "../audios/waiting.mp3";
import needs_label from "../audios/needs_a_label.mp3";

let goBackAudio = new Audio(back_audio);
let addGestureAudio = new Audio(add_gesture_audio);
let calibrationAudio = new Audio(calibration_audio);
let waitingAudio = new Audio(waiting_audio);
let needsLabelAudio = new Audio(needs_label);

let allAudios = [goBackAudio, addGestureAudio, calibrationAudio, waitingAudio, needsLabelAudio];

function playAudio(audio, hover) {
    console.log(audio);
    console.log(hover);
    // if the mouse moves to another element before the previous sound finishes,
    // stop the previous sound before playing the new sound
    // this is to prevent sounds from overlapping one another with quick mouse movement
    if (hover) {
        allAudios.forEach(function(a) {
        a.pause();
        a.currentTime = 0;
        })
    
        audio.play();
    }
}

function changeView(nextState, curState, setState, uuid) {
    setState({
        view: nextState,
        gestures: curState.gestures,
        uuid: uuid,
    });
}

function handleBackPress(setState) {
    if (window.confirm("You are about to skip selecting a label for this gesture. Are you sure?")) {
        setState({
            view: "waiting"
        })
    }
}

function handleSubmit(socket, val, state, setState) {
    if (!window.confirm("Gesture will be classfied as '" + val + "'. Click OK to confirm.")) {
        return false;
    }

    socket.emit("frontend", {
        uuid: state.uuid,
        label: val,
      });
    console.log("emitting UUID:", state.uuid);
    console.log("emitting label:", val);

    setState({
        view: "waiting",
    });
}

function handleArrowHover(state, setState, hover, mouseEnter) {
    console.log('here');
    playAudio(goBackAudio, hover);
    changeArrow(state, setState, mouseEnter);
}
  
function changeArrow(state, setState, mouseEnter) {
    setState({
        view: state.view,
        uuid: state.uuid,
        displayHoverArrow: mouseEnter
    });
}

const Calibration = (props) => {
    console.log("prop: ", props.parentState);

    let hover = props.parentState.hover;

    const history = useHistory();
    const [state, setState] = useState({
        view: "waiting",
        uuid: null,
    });
    const stateRef = useRef();
    stateRef.current = {
        view: state.view,
        uuid: state.uuid
    };

    const socket = useContext(SocketContext);
    let currGesture = "";
    let numCurrGesture = 0;

    function socketHandler(data) {
        // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
        console.log("socketHandler state uuid: ", stateRef.current.uuid);
        console.log("stateRef.current ", stateRef.current.view);

        if (stateRef.current.view != "calibrate") {
            console.log(data);
            // view = "calibrate";
            changeView("calibrate", state, setState, data.uuid);
        }
    }

    useEffect(() => {
        // let view = state.view;
        socket.on("frontend", socketHandler);
        return () => {
            socket.off("frontend", socketHandler);
        };
    }, [socket]);

    console.log("calibration state: ", state);

    return (
        <div>
            {state.view == "waiting" ?
                <div className="waiting">
                    <button
                        className="goBackButton"
                        onMouseEnter={() => handleArrowHover(state, setState, hover, true)}
                        onMouseLeave={() => changeArrow(state, setState, false)}
                        onClick={() => history.push("/")}>
                        <img src={state.displayHoverArrow ? arrowHover : arrow} />
                    </button>

                    <h1
                        onMouseEnter={() => playAudio(calibrationAudio, hover)}>
                        Calibration
                    </h1>
                    <div className="calibrationContainer">
                        <img src={waiting} alt="Logo" />
                        <p onMouseEnter={() => playAudio(waitingAudio, hover)}
                            > Waiting for a gesture to be made ... 
                        </p>
                    </div>
                    <button type="button" className="temp" onClick={() => changeView("calibrate", state, setState, "18ae3de03aa34ef686c61029f868f0ceTEST")}> Make a gesture </button>
                </div>

                : state.view === "calibrate" ?
                    <div>
                        <button
                            className="goBackButton" id="skip"
                            onMouseEnter={() => handleArrowHover(state, setState, hover, true)}                        onMouseLeave={() => changeArrow(state, setState, false)}
                            onMouseLeave={() => changeArrow(state, setState, false)}
                            onClick={() => handleBackPress(setState)}>
                        <img src={state.displayHoverArrow ? arrowHover : arrow} />
                        </button>
                        <div id="content">
                            <h1 
                                id="addTitle"
                                onMouseEnter={() => playAudio(needsLabelAudio, hover)}>
                                Gesture needs a label!
                            </h1>
                            <p id="instructions">Click "Add Gesture" to make a new gesture label or select an existing gesture below.</p>
                            <div class="buttons">
                                <button
                                    className="add"
                                    onMouseEnter={() => playAudio(addGestureAudio, hover)}
                                    onClick={() => { changeView("add", state, setState, state.uuid) }}>
                                    Add Gesture
                                </button>
                                <br />
                                <hr className="divide" />
                                <br />
                                <div className="gestures">
                                    {props.existingGestures.length == 0 ?
                                        <div>
                                            <p id="noExisting">No gestures have been created yet.</p>
                                        </div>
                                        :
                                        <div>
                                            {(props.existingGestures).map((gesture) => <button 
                                                type="button"
                                                id="gestureButton"
                                                onClick={() => handleSubmit(socket, gesture, state, setState)}>
                                                {gesture}
                                                </button>
                                            )}
                                        </div>
                                    }
                                </div>
                                </div>
                        </div>
                        <br />
                    </div>
                    :
                    <AddGesture setter={setState} parentState={state} existingGestures={props.existingGestures} hover={props.parentState.hover} />
            }
        </div>
    );
};

export default Calibration;
