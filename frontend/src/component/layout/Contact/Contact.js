import React from "react";
import "./contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:amitrawat1099@gmail.com">
        <Button>Contact: amitrawat1099@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
