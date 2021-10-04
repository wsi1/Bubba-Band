import React, { Component } from "react";
import { Button } from 'react-bootstrap';
// import { withRouter } from 'react-router-dom'
// import history from './../history';
import { useHistory } from 'react-router-dom';
import "./Home.css";

const Home = (props) => {
    const history = useHistory();
//   const handleClick = () => history.push('/calibration');
    return (
      <div className="Home">
        <div className="lander">
          <h1>Home page</h1>
          <p>A simple app showing react button click navigation</p>
          <p>
            <Button variant="btn btn-success" onClick={() => history.push('/calibration')}>Calibration</Button>
          </p>
          <p>
            <Button variant="btn btn-success" onClick={() => history.push('/interpretation')}>Interpretation</Button>
          </p>
        </div>
      </div>
    );
};

export default Home;
