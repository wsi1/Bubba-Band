import { Component } from 'react';
import Routes from './Routes';
import { io } from "socket.io-client";
import { SocketContext, socket } from './context/socket';

class App extends Component {
  constructor(props) {
    super(props);
    console.log("hello", props);
    this.state = {}
  }
  
  render () {
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <Routes />
        </div>
      </SocketContext.Provider>
    );
  }
}

export default App;
