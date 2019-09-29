import React from 'react';

function Spinner() {
  return (
    <div className="container-loader">
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Spinner;
