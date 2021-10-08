import React, { Component, useState } from 'react';
import waiting from '../messages-typing.gif'; // Tell webpack this JS file uses this image
import { useHistory } from 'react-router-dom';
import "./Interpretation.css";

function displayResponse(setState, response) {
    console.log(response);
    if (response == 'yes') {
        console.log('yes branch');
        setState({
            displayYes: true,
        });
        setTimeout(() => {
            setState({
                displayWaiting: true,
                displayYes: false,
            });
        }, 2000);
    } else if (response == 'no') {
        console.log('no branch');
        setState({
            displayNo: true,
        });
        setTimeout(() => {
            setState({
                displayWaiting: true,
                displayNo: false,
            });
        }, 2000);

    } else if (response == 'hi') {
        console.log('hi branch');
        setState({
            displayHi: true,
        });
        setTimeout(() => {
            setState({
                displayWaiting: true,
                displayHi: false,
            });
        }, 2000);
    }
};

const Interpretation = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        displayWaiting: true,
        displayYes: false,
        displayNo: false,
        displayHi: false,
    });

    return (
        <div>
            <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
            <h1>Interpretation Page</h1>
            <div className={state.displayWaiting ? "center" : "hidden"}>
                <img class="img" src={waiting} alt="Logo"/>
                <p>Waiting for a response...</p>
            </div>
            <button id="yes" onClick={() => displayResponse(setState, 'yes')}>yes</button>
            <button id="no" onClick={() => displayResponse(setState, 'no')}>no</button>
            <button id="hi" onClick={() => {
                console.log('hey');
                displayResponse(setState, 'hi');
            }}>hi</button>
            <div className={state.displayYes ? "yesResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">☑</p>
            </div>
            <div className={state.displayNo ? "noResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">☒</p>
            </div>
            <div className={state.displayHi ? "hiResponse" : "hidden"}>
                <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
                <p class="responseText">👋🏻</p>
            </div>
        </div>
    );
}

export default Interpretation;