// Footer.js

import React from 'react';
import '../css/Footer.css'; // Make sure the path to your CSS file is correct

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        © {new Date().getFullYear()} Oz Developing LTD. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
