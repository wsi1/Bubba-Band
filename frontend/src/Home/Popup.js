import React from 'react';
import './Popup.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                { props.children }
                <p id="popText">Autoplay for audio is currently disabled. Please click the button to allow audio.</p>
                <button className="close-btn" onClick={() => props.setter({view: "home", displayHoverGear: false})}>Allow audio</button>
            </div>
        </div>
    ) : ""
}

export default Popup
