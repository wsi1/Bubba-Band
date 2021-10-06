import { Component } from 'react';
import Routes from './Routes';

import { io } from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    console.log("hello", props);
    this.state = {}
    // use useEffect to stop rendering and receiving message twice
    const socket = io("http://localhost:5000");
      socket.on("frontend", (data) => console.log(data))
  }
  
  
  render () {
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;
