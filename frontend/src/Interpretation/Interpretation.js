import React, { Component } from 'react';
import waiting from '../messages-typing.gif'; // Tell webpack this JS file uses this image
import { useHistory } from 'react-router-dom';

import "./Interpretation.css";

const Interpretation = (props) => {
    const history = useHistory();

    return (
        <div>
            <button onClick={() => history.goBack()}>Go Back</button>
            <div><h2>Interpretation Page</h2></div>
            
            <img class="img" src={waiting} alt="Logo"/>
        </div>
    );
    
}

export default Interpretation;