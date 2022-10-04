import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import IconRingAnchor from "../../assets/IconRingAnchor";
import "./RingOfFortune.scss";
enum RingColor {
  GREEN = "#3DB657",
  BLUE = "#3D82F0",
  RED = "#E03E4F",
  Gray = "#6B7688",
}

function getRoundColor(round_position: number) {
  const colors = new Map(
    Object.entries({
      1: RingColor.GREEN,
      2: RingColor.BLUE,
      3: RingColor.Gray,
      4: RingColor.RED,
      5: RingColor.Gray,
      6: RingColor.RED,
      7: RingColor.Gray,
      8: RingColor.RED,
      9: RingColor.Gray,
      10: RingColor.BLUE,
      11: RingColor.Gray,
      12: RingColor.BLUE,
      13: RingColor.Gray,
      14: RingColor.RED,
      15: RingColor.Gray,
      16: RingColor.RED,
      17: RingColor.Gray,
      18: RingColor.RED,
      19: RingColor.Gray,
      20: RingColor.BLUE,
      21: RingColor.Gray,
      22: RingColor.BLUE,
      23: RingColor.Gray,
      24: RingColor.RED,
      25: RingColor.Gray,
      26: RingColor.RED,
      27: RingColor.Gray,
      28: RingColor.RED,
      29: RingColor.Gray,
      30: RingColor.RED,
      31: RingColor.Gray,
      32: RingColor.RED,
      33: RingColor.Gray,
      34: RingColor.BLUE,
      35: RingColor.Gray,
      36: RingColor.BLUE,
      37: RingColor.Gray,
      38: RingColor.RED,
      39: RingColor.Gray,
      40: RingColor.RED,
      41: RingColor.Gray,
      42: RingColor.RED,
      43: RingColor.Gray,
      44: RingColor.BLUE,
      45: RingColor.Gray,
      46: RingColor.BLUE,
      47: RingColor.Gray,
      48: RingColor.RED,
      49: RingColor.Gray,
      50: RingColor.RED,
      51: RingColor.Gray,
      52: RingColor.RED,
      53: RingColor.Gray,
      54: RingColor.BLUE,
    })
  );

  return colors.get(String(round_position));
}
const RingOfFortune = () => {
  const [easeOut, setEaseOut] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [result, setResult] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [net, setNet] = useState(0);

  // const rotate = () => {
  //   number += Math.ceil(Math.random() * 10000);
  //   setAnimation({
  //     transform: `rotate(${number}deg)`,
  //   });
  // };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const list = [...Array.from(Array(54), (_, i) => i)];
  const radius = 230;
  const getResult = (spin: any) => {
    // find net rotation and add to offset angle
    // repeat substraction of inner angle amount from total distance traversed
    // use count as an index to find value of result from state list
    let netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
    setNet(netRotation);

    const rotated = Math.round(spin / (360 / list.length));
    const remain = rotated % list.length;
    const currentNumberBottom =
      list[remain === 0 ? 0 : list.length - remain] + 1;

    setResult(currentNumberBottom);
    setSpinning(false);
  };
  const spin = (number?: number | undefined) => {
    const randomNumber = number || Math.floor(Math.random() * list.length) + 1;
    const offset =
      randomNumber - result > 0
        ? list.length - (randomNumber - result)
        : -(randomNumber - result);
    // console.log(
    //   `🚀 ~ RN = ${randomNumber}, CP = ${result}, OFFSET = ${offset}`
    // );
    const spinDeg = offset * (360 / list.length);

    setRotate(rotate + spinDeg);
    setEaseOut(4);
    setSpinning(true);

    setTimeout(() => {
      getResult(rotate + spinDeg);
      // setResult(randomNumber);
    }, 4000);
  };
  const reset = () => {
    setRotate(0);
    setEaseOut(0);
    setResult(1);
    setSpinning(false);
  };
  useEffect(() => {
    let numOptions = list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    // setAngle(arcSize);

    // // get index of starting position of selector
    // topPosition(numOptions, arcSize);

    // dynamically generate sectors from state list
    let angle = Math.PI / 2 - arcSize / 2;
    for (let i = 0; i < numOptions; i++) {
      let text = list[i];
      renderSector(i + 1, text + 1, angle, arcSize, getRoundColor(i + 1));
      angle += arcSize;
    }

    // init();
  }, []);

  const topPosition = (num: any, angle: any) => {
    // set starting index and angle offset based on list length
    // works upto 9 options
    let topSpot = null;
    let degreesOff = null;
    if (num === 9) {
      topSpot = 7;
      degreesOff = Math.PI / 2 - angle * 2;
    } else if (num === 8) {
      topSpot = 6;
      degreesOff = 0;
    } else if (num <= 7 && num > 4) {
      topSpot = num - 1;
      degreesOff = Math.PI / 2 - angle;
    } else if (num === 4) {
      topSpot = num - 1;
      degreesOff = 0;
    } else if (num <= 3) {
      topSpot = num;
      degreesOff = Math.PI / 2;
    }

    // setTop(topSpot - 1);
    // setOffset(degreesOff);
  };
  const renderSector = (
    index: any,
    text: any,
    start: any,
    arc: any,
    color: any
  ) => {
    // create canvas arc for each list element
    let canvas = canvasRef.current;
    if (canvas) {
      let ctx = canvas.getContext("2d");
      if (ctx) {
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let startAngle = start + 0.02;
        let endAngle = start + arc;
        let angle = index * arc + Math.PI / 2 - arc / 2;
        let baseSize = radius * 1.09;
        let textRadius = baseSize - 40;

        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        // ctx.arc(x, y, radius, startAngle - 2, startAngle + 2, false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;

        ctx.font = "11px Arial";
        ctx.fillStyle = "white";
        ctx.stroke();

        ctx.save();
        ctx.translate(
          baseSize + Math.cos(angle - arc / 2) * textRadius,
          baseSize + Math.sin(angle - arc / 2) * textRadius
        );
        ctx.rotate(angle - arc / 2 + Math.PI / 2);
        // ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
    }
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        <motion.canvas
          ref={canvasRef}
          id="wheel"
          width="500"
          height="500"
          animate={{ rotate: rotate }}
          transition={{ ease: "easeOut", duration: easeOut }}
        />
        <span
          id="selector"
          style={{
            position: "absolute",
            left: "45.2%",
            top: "80%",
            fontSize: 25,
            zIndex: 3,
            color: getRoundColor(result),
          }}
        >
          <IconRingAnchor sx={{ transform: "rotate(180deg)" }} />
        </span>
      </div>
      <button onClick={() => spin()}>spinNNNN</button>
      <button onClick={reset}>reset</button>
    </>
  );
};

export default RingOfFortune;
