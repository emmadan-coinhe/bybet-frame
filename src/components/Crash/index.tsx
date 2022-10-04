import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Line, Chart } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-moment";
import { connect } from "socket.io-client";
import "./Crash.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
const API_BASE = "http://localhost:4000";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Crash = () => {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});
  const [gamePhaseTimeElapsed, setGamePhaseTimeElapsed] = useState<any>();
  const [liveMultiplier, setLiveMultiplier] = useState<any>("CONNECTING...");
  const [liveMultiplierSwitch, setLiveMultiplierSwitch] = useState(false);
  const [globalTimeNow, setGlobalTimeNow] = useState(0);
  const [chartSwitch, setChartSwitch] = useState(false);
  const [globalSocket, setGlobalSocket] = useState<any>(null);
  const [betActive, setBetActive] = useState(false);
  const [roundIdList, setRoundIdList] = useState([]);
  const [bBettingPhase, setbBettingPhase] = useState(false);
  const [bettingPhaseTime, setBettingPhaseTime] = useState<any>(-1);
  const [hookToNextRoundBet, setHookToNextRoundBet] = useState(false);

  const multiplierCount = useRef<any>([]);
  const timeCount_xaxis = useRef<any>([]);
  const realCounter_yaxis = useRef<any>(5);
  const chartRef = useRef();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = (chartRef: any, position: number) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(100, 75, 50, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  // useEffect(() => {
  //   let bettingInterval: any = null;

  //   if (bBettingPhase) {
  //     bettingInterval = setInterval(() => {
  //       let time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
  //       let time_remaining: any = (5 - time_elapsed).toFixed(2);
  //       setBettingPhaseTime(time_remaining);
  //       if (time_remaining < 0) {
  //         setbBettingPhase(false);
  //       }
  //     }, 1);
  //   }
  //   return () => {
  //     clearInterval(bettingInterval);
  //     setBettingPhaseTime("Starting...");
  //   };
  // }, [bBettingPhase]);

  useEffect(() => {
    const temp_interval = setInterval(() => {
      setChartSwitch(false);
      sendToChart();
    }, 1);

    return () => {
      clearInterval(temp_interval);
      setChartSwitch(true);
    };
  }, [chartSwitch]);

  function getGradient(ctx: any, chartArea: any) {
    let gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, "#F4E38B");
    gradient.addColorStop(0.5, "#C49939");
    gradient.addColorStop(1, "#B27F2A");

    return gradient;
  }
  // Chart Data
  const sendToChart = () => {
    setChartData({
      labels: timeCount_xaxis.current,

      datasets: [
        {
          data: multiplierCount.current,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: function (context: any) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return getGradient(ctx, chartArea);
          },
          color: "rgba(0,0,0,1)",

          pointRadius: 0,
          borderDash: [],
          lineTension: 0.4,
        },
      ],
    });
    setChartOptions({
      events: [],
      // maintainAspectRatio: false,
      // elements: {
      //   line: {
      //     tension: 0.4,
      //   },
      // },
      responsive: true,
      scales: {
        yAxes: {
          type: "linear",
          min: 0,
          max: liveMultiplier > 2 ? liveMultiplier : 2,
          afterTickToLabelConversion: function (scaleInstance: any) {
            scaleInstance.ticks[0].label = "";

            scaleInstance.ticks[scaleInstance.ticks.length - 1].label = "";
          },
          ticks: {
            color: "rgba(255, 255, 255,1)",
            maxTicksLimit: 6,
            callback: function (value: any, index: any, values: any) {
              // if (value >= 2 && value % 2 == 0)
              return +parseFloat(value).toFixed(1) + "x";
              // if (value < 2 && value >= 1.2) {
              //   return +parseFloat(value).toFixed(1) + "x";
              // }
            },
          },
          grid: {
            display: false,
          },
        },
        xAxes: {
          type: "linear",
          min: 0,
          max: gamePhaseTimeElapsed > 8 ? gamePhaseTimeElapsed : 8,
          ticks: {
            color: "rgba(255, 255, 255,1)",
            maxTicksLimit: 10,
            callback: function (value: any, index: any, values: any) {
              if (gamePhaseTimeElapsed < 10) {
                if (value % 1 == 0) return value;
              } else {
                if (value % 5 == 0) return value;
              }
            },
          },
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
      },
      animation: {
        x: {
          type: "number",
          easing: "linear",
          duration: 0,
          from: 5,
          delay: 0,
        },
        y: {
          type: "number",
          easing: "linear",
          duration: 0,
          from: 5,
          delay: 0,
        },
        loop: true,
      },
    });
  };
  useEffect(() => {
    let gameCounter: any = null;
    if (liveMultiplierSwitch) {
      setLiveMultiplier("1.00");

      gameCounter = setInterval(() => {
        let time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
        setGamePhaseTimeElapsed(time_elapsed);
        setLiveMultiplier((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2));

        if (multiplierCount.current.length < 1) {
          multiplierCount.current = multiplierCount.current.concat([0]);
          timeCount_xaxis.current = timeCount_xaxis.current.concat([0]);
        }
        if (realCounter_yaxis.current % 5 == 0) {
          multiplierCount.current = multiplierCount.current.concat([
            1.0024 * Math.pow(1.0718, time_elapsed) - 1,
          ]);
          timeCount_xaxis.current = timeCount_xaxis.current.concat([
            time_elapsed,
          ]);
          // draw(chartRef, multiplierCount.current.length);
          // console.log(chartRef);
        }
        realCounter_yaxis.current += 1;
      }, 1);
    }
    return () => {
      clearInterval(gameCounter);
    };
  }, [liveMultiplierSwitch]);
  // Socket.io setup
  useEffect(() => {
    const socket = connect("http://localhost:3001");
    setGlobalSocket(socket);

    socket.on("start_multiplier_count", function (data) {
      setGlobalTimeNow(Date.now());
      setLiveMultiplierSwitch(true);
    });

    socket.on("stop_multiplier_count", function (data) {
      setLiveMultiplier(data);
      setLiveMultiplierSwitch(false);

      setBetActive(false);
      multiplierCount.current = [];
      timeCount_xaxis.current = [];
    });

    socket.on("get_round_id_list", function (data) {
      setRoundIdList(data.reverse());
    });

    socket.on("start_betting_phase", function (data) {
      setGlobalTimeNow(Date.now());
      setLiveMultiplier("Starting...");
      setbBettingPhase(true);
      // setLiveBettingTable(null);
      setHookToNextRoundBet(true);
      //   retrieve_active_bettors_list();

      multiplierCount.current = [];
      timeCount_xaxis.current = [];
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    setChartSwitch(true);
  }, []);

  return (
    <div className="effects-box">
      <div className="basically-the-graph">
        {chartData ? (
          <>
            <Chart
              type="line"
              data={chartData}
              options={chartOptions}
              ref={chartRef}
            />
            {/* <motion.canvas
              ref={canvasRef}
              width="500"
              height="500"
              style={{
                position: "absolute",
                zIndex: 10,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
              // animate={{ rotate: rotate }}
              // transition={{ ease: "easeOut", duration: easeOut }}
            /> */}
          </>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 12,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(() => {
          if (bBettingPhase) {
            return <h1>{bettingPhaseTime}</h1>;
          } else {
            return (
              <h1
                className={` ${
                  !liveMultiplierSwitch &&
                  liveMultiplier !== "Starting..." &&
                  liveMultiplier !== "CONNECTING..."
                    ? "multipler_crash_value_message"
                    : ""
                }`}
              >
                {liveMultiplier !== "Starting..."
                  ? liveMultiplier + "x"
                  : "Starting..."}
              </h1>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default Crash;
