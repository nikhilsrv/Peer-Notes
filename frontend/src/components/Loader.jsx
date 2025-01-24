import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <div className="gallery-template-item">
        <div className="gallery-animated-background">
          <div className="main-masks right"></div>
          <div className="main-masks thumb mid one"></div>
          <div className="main-masks thumb mid two"></div>
          <div className="main-masks thumb bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
