import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./Home/Home";
import Calibration from "./Calibration/Calibration";
import AddGesture from "./Calibration/AddGesture";
import Interpretation from "./Interpretation/Interpretation";
import history from './history';


export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact><Home/></Route>
                    <Route path="/calibration"><Calibration /></Route>
                    <Route path="/interpretation"><Interpretation /></Route>
                    <Route path="/addGesture"><AddGesture /></Route>
                </Switch>
            </Router>
        )
    }
}
