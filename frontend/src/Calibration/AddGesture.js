import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';

import "./AddGesture.css";


const AddGesture = (props) => {
    const history = useHistory();

    return (
      <div className="addGesture">
        <button class="goBackButton" onClick={() => history.push("/calibration")}>← Go back</button>
        <h1> Create a new gesture </h1>
        <h2>Type in gesture name: </h2>

        <form>
            <input type="text" name="gestureName" initialValue="Hello" />
            <input type="submit" value="Submit" />
        </form>
      </div>
    );
  };

export default AddGesture;
