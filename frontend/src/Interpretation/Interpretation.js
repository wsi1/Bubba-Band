import React, { Component, useState } from 'react';
import waiting from '../messages-typing.gif'; // Tell webpack this JS file uses this image
import checkmark from '../checkmark.png'; // Tell webpack this JS file uses this image
import xmark from '../xmark.png'; // Tell webpack this JS file uses this image
import wave from '../wave.png'; // Tell webpack this JS file uses this image
import { useHistory } from 'react-router-dom';
import "./Interpretation.css";

function displayResponse(setState, response) {
    console.log(response);
    if (response == 'yes') {
        console.log('yes branch');
        setState({
            image: checkmark,
            text: 'Yes!'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...'
            });
        }, 3000);
    } else if (response == 'no') {
        console.log('no branch');
        setState({
            image: xmark,
            text: 'No!'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...'
            });
        }, 3000);

    } else if (response == 'hi') {
        console.log('hi branch');
        setState({
            image: wave,
            text: 'Hi!'
        });
        setTimeout(() => {
            setState({
                image: waiting,
                text: 'Waiting for a response...'
            });
        }, 3000);
    }
};

const Interpretation = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        displayWaiting: true,
        displayYes: false,
        displayNo: false,
        displayHi: false,
        image: waiting,
        text: 'Waiting for a response...'
    });

    return (
        <div>
            <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
            <h1>Interpretation Page</h1>
            <div className="center">
                <img class="img" src={state.image} alt="Logo"/>
                <p>{state.text}</p>
            </div>
            <button id="yes" onClick={() => displayResponse(setState, 'yes')}>yes</button>
            <button id="no" onClick={() => displayResponse(setState, 'no')}>no</button>
            <button id="hi" onClick={() => displayResponse(setState, 'hi')}>hi</button>

            {/* <div className={state.displayYes ? "yesResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">☑</p>
            </div> */}
            {/* <div className={state.displayNo ? "noResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">☒<br/>is this working?</p>
            </div>
            <div className={state.displayHi ? "hiResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">👋🏻<br/>test</p>
            </div> */}
        </div>
    );
}

export default Interpretation;