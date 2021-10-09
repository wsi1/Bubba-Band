import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';

import "./Settings.css";

function goBack(state, setState) {
  var prevState = state;
  state["view"] = "main";
  setState({state: prevState});
  console.log(state);
}

const Settings = (props) => {
  const history = useHistory();

  return (
    <div>
      <h1>Settings</h1>
      <button class="goBackButton" onClick={() => goBack(props.parentState, props.setter)}>← Go back</button>
    </div>
  );
};

export default Settings;
