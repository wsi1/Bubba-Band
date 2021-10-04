import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Home from "./Home/Home";
import Calibration from "./Calibration/Calibration";
import Interpretation from "./Interpretation/Interpretation";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/calibration" component={Calibration} />
                    <Route path="/interpretation" component={Interpretation} />
                </Switch>
            </Router>
        )
    }
}
