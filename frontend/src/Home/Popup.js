import React, { useState } from 'react';
import './Popup.css';

function Popup(props) {
    const [state, setState] = useState({
        popupClosed: props.parentState.popupClosed,
      });

    function updatePopup() {
        // indicates popup has already gone off
        props.parentState.popupClosed = true;
      
        setState();
    
        props.setter({view: "home", displayHoverGear: false})
      
        console.log("updatePopup props after update: ", props);
    };
    
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                { props.children }
                <p id="popText">Autoplay for audio is currently disabled. Please click the button to allow audio.</p>
                <button className="close-btn" onClick={() => updatePopup()}>Allow audio</button>
            </div>
        </div>
    ) : ""
};

export default Popup;
