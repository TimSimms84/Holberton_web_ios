import './Footer.css'
import React from 'react';
import Clock from 'react-digital-clock';

function Footer() {
  return (
    <div className='footer-content'>
      <div className='digital-clock'>
        <Clock className="Digital-Clock" />
      </div>
      <h3 className='Hol'>Holberton IOS</h3>
    </div>
  );
}



export default Footer;
