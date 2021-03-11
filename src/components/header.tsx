import React from "react";
import uberLogo from "../images/logo.svg";

export const Header = () => (
  <header className="py-4">
    <div className="w-full max-w-screen-xl mx-auto">
      <img src={uberLogo} className="w-52 mb-10" alt="uber Eats" />
      im the header
    </div>
  </header>
);
