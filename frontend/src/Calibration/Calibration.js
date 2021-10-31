import React, { Component, useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../context/socket';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';
import useSound from "use-sound";

import waiting from "../images/messages-typing.gif";
import back from "../audios/go_back.mp3";
import addGesture from "../audios/add_gesture.mp3";

import "./Calibration.css";

function changeView(nextState, curState, setState, uuid) {
    setState({
        view: nextState,
        gestures: curState.gestures,
        uuid: uuid,
    });
}

function handleBackPress(setState) {
    if (window.confirm("You are about to forget the gesture just made, are you sure?")) {
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

const Calibration = (props) => {
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

    const [playBack] = useSound(back);
    const [playAdd] = useSound(addGesture);

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
                        onMouseEnter={() => playBack()}
                        onClick={() => history.push("/")}>
                        ← Go back
                    </button>

                    <h1>Calibration</h1>
                    <div className="calibrationContainer">
                        <img src={waiting} alt="Logo" />
                        <h1 className="smallHead"> Waiting for a gesture to be made ... </h1>
                    </div>
                    <button type="button" className="temp" onClick={() => changeView("calibrate", state, setState, "18ae3de03aa34ef686c61029f868f0ceTEST")}> Make a gesture </button>
                </div>

                : state.view === "calibrate" ?
                    <div>
                        <button
                            className="goBackButton" id="skip"
                            onMouseEnter={() => playBack()}
                            onClick={() => handleBackPress(setState)}>
                            ← Skip gesture label
                        </button>

                        <h1>Gesture needs a label!</h1>
                        <p id="instructions">To label the gesture, click "Add Gesture" to make a new gesture label or select an existing gesture below.</p>
                        <div class="buttons">
                            <button
                                className="add"
                                onMouseEnter={() => playAdd()}
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
                        <br />
                    </div>
                    :
                    <AddGesture setter={setState} parentState={state} existingGestures={props.existingGestures} />
            }
        </div>
    );
};

export default Calibration;
