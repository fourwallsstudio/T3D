import React from 'react';

const ContactInfo = () => {
  return (
    <div className="contact-container">
      <a href="http://calvinmcelroy.us/" target="_blank"><p>calvinmcelroy.us</p></a>
      <a href="mailto:calvin.mcelroy.dev@gmail.com"><p>calvin.mcelroy.dev@gmail.com</p></a>
      <div className="contact-icons-box">
        <a href="https://github.com/fourwallsstudio" target="_blank" className="github-img">
          <img src="assets/github.png"></img>
        </a>
        <a href="https://angel.co/calvin-mcelroy-1" target="_blank" className="angellist-img">
          <img src="assets/angellist.png"></img>
        </a>
        <a href="https://www.linkedin.com/in/calvin-mcelroy-dev/" target="_blank" className="linkedin-img">
          <img src="assets/linkedin.png"></img>
        </a>
      </div>
    </div>
  )
}

export default ContactInfo;
