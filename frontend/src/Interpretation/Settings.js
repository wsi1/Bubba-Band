import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image

import "./Settings.css";

function goBack(state, setState) {
  // var prevState = {state};
  // prevState["view"] = "main";
  // setState(prevState);
  // console.log(state);
  setState({
    backgroundColor: '#1c1c1c',
    displayWaiting: true,
    displayYes: false,
    displayNo: false,
    displayHi: false,
    image: waiting,
    text: 'Waiting for a response...'
  });
}

const Settings = (props) => {
  const history = useHistory();

  return (
    <div>
      <button class="goBackButton" onClick={() => goBack(props.parentState, props.setter)}>← Go back</button>
      <h1>Settings</h1>
    </div>
  );
};

export default Settings;
