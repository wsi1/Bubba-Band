import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';

const Calibration = (props) => {
    const history = useHistory();
    return (
      <>
        <h1>Pls pls pls show up</h1>
        <br />
        <button onClick={() => history.goBack()}>Go Back</button>
      </>
    );
  };

export default Calibration;