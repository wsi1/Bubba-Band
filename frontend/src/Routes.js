import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {Redirect} from "react-router-dom";

import Home from "./Home/Home";
import Calibration from "./Calibration/Calibration";
import AddGesture from "./Calibration/AddGesture";
import Interpretation from "./Interpretation/Interpretation";
import Settings from "./Interpretation/Settings";
import history from './history';

export default class Routes extends Component {
    constructor(props) {
        super(props);
        if (!window.localStorage.getItem("gestures")) {
            window.localStorage.setItem("gestures", JSON.stringify(["Hard tap", "Soft tap", "Hold"]))
        }
        if (!window.localStorage.getItem("hoverOn")) {
            window.localStorage.setItem("hoverOn", "true");
        }
        this.state = {
            gestures: JSON.parse(window.localStorage.getItem("gestures")),
            hover: window.localStorage.getItem("hoverOn"),
        };
    }
    
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact><Home setter={this.setState} parentState={this.state}/></Route>
                    <Route path="/calibration" exact><Calibration existingGestures={this.state.gestures} parentState={this.state}/></Route>
                    <Route path="/interpretation" exact><Interpretation existingGestures={this.state.gestures} parentState={this.state}/></Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        )
    }
}
