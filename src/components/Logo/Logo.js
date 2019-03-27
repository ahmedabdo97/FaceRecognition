import React from 'react';
import Tilt from 'react-tilt';
import female from './female.png';
import './Logo.css';
//simple component with no state pure function
const Logo = () => {
    return (
        <div className='ma4 mt0'>
          <Tilt className="Tilt br2 shadow-2" options={{ max : 70 }} style={{ height: 200, width: 200 }} >
            <div className="Tilt-inner pa3"><img style={{paddingTop:'5px'}} alt='Logo' src={female}/></div>
          </Tilt>
        </div>
    );
}


export default Logo ;