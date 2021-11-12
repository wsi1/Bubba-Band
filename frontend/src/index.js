import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './public/Open_Sans/static/OpenSans/OpenSans-Regular.ttf';
import './public/Open_Sans/static/OpenSans/OpenSans-ExtraBold.ttf';

ReactDOM.render(    
  <Router> 
      <App />
  </Router>,
  document.getElementById('root')
  );
