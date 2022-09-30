import React, { useState } from "react";
import "./RingOfFortune.scss";
const RingOfFortune = () => {
  const [animation, setAnimation] = useState<any>();
  let number = Math.ceil(Math.random() * 10000);
  const rotate = () => {
    number += Math.ceil(Math.random() * 10000);
    setAnimation({
      transform: `rotate(${number}deg)`,
    });
  };

  return (
    <>
      <div className="wrapper">
        <img src="/images/ring.svg" alt="ring-image" style={animation} />
      </div>
      <button onClick={() => rotate()}>spin</button>
    </>
  );
};

export default RingOfFortune;
