import React, { Component, useState } from 'react';
import waiting from '../messages-typing.gif'; // Tell webpack this JS file uses this image
import { useHistory } from 'react-router-dom';
import "./Interpretation.css";

function displayYes(setState) {
    setState({
        hideWaiting: true,
        showYes: true,
    });
    setTimeout(() => {
        setState({
            hideWaiting: false,
            showYes: false,
        });
    }, 2000);
};

function displayNo(setState) {
    setState({
        hideWaiting: true,
        showNo: true,
    });
    setTimeout(() => {
        setState({
            hideWaiting: false,
            showNo: false,
        });
    }, 2000);
};

const Interpretation = (props) => {
    const history = useHistory();
    const [state, setState] = useState("interpretation");

    return (
        <div>
            <button class="goBackButton" onClick={() => history.goBack()}>← Go back</button>
            <h1>Interpretation Page</h1>
            <div className={state.hideWaiting ? "hidden" : "center"}>
                <img class="img" src={waiting} alt="Logo"/>
                <p>Waiting for a response...</p>
            </div>
            <button id="yes" onClick={() => displayYes(setState)}>Test yes</button>
            <button id="no" onClick={() => displayNo(setState)}>Test no</button>
            <div className={state.showYes ? "yesResponse" : "hidden"}></div>
            <div className={state.showNo ? "noResponse" : "hidden"}></div>
        </div>
    );
}

export default Interpretation;