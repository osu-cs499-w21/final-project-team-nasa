import React from 'react';
import Nav from "./nav";

/* the main page with welcome sign */
const Main = () => {

  return (
    <div className="main_div">
      <Nav/>
      <div>
        <h1 className="title">Mars Rover Photos</h1>
        <p className="descr">Look at the photos gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars!</p>
      </div>

    </div>
  );

};

export default Main;
