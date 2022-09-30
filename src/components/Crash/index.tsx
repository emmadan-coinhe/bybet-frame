import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-moment";
import Axios from "axios";
import { connect } from "socket.io-client";
import "./Crash.scss";

const API_BASE = "http://localhost:4000";
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

  //   const [liveBettingTable, setLiveBettingTable] = useState<any>();
  const [hookToNextRoundBet, setHookToNextRoundBet] = useState(false);
  //   const [tenNumbers, setTenNumbers] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const multiplierCount = useRef<any>([]);
  const timeCount_xaxis = useRef<any>([]);
  const realCounter_yaxis = useRef<any>(5);
  useEffect(() => {
    let bettingInterval: any = null;

    if (bBettingPhase) {
      bettingInterval = setInterval(() => {
        let time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
        let time_remaining: any = (5 - time_elapsed).toFixed(2);
        setBettingPhaseTime(time_remaining);
        if (time_remaining < 0) {
          setbBettingPhase(false);
        }
      }, 10);
    }
    return () => {
      clearInterval(bettingInterval);
      setBettingPhaseTime("Starting...");
    };
  }, [bBettingPhase]);
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
  // Chart Data
  const sendToChart = () => {
    setChartData({
      labels: timeCount_xaxis.current,

      datasets: [
        {
          data: multiplierCount.current,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(75,192,192,1)",
          color: "rgba(0,0,0,1)",

          pointRadius: 0,
          borderDash: [35, 0],
          lineTension: 0.1,
        },
      ],
    });
    setChartOptions({
      events: [],
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.1,
        },
      },
      scales: {
        yAxes: {
          type: "linear",

          title: {
            display: false,
            text: "value",
          },
          min: 0,
          max: liveMultiplier > 2 ? liveMultiplier : 2,
          ticks: {
            color: "rgba(255, 255, 255,1)",
            maxTicksLimit: 5,
            callback: function (value: any, index: any, values: any) {
              if (value % 0.5 == 0) return parseFloat(value).toFixed(2);
            },
          },
          grid: {
            display: false,
            // color: "white",
          },
        },
        xAxes: {
          type: "linear",
          title: {
            display: false,
            text: "value",
          },
          max: gamePhaseTimeElapsed > 8 ? gamePhaseTimeElapsed : 8,
          ticks: {
            color: "rgba(255, 255, 255,1)",

            maxTicksLimit: 5,
            callback: function (value: any, index: any, values: any) {
              if (gamePhaseTimeElapsed < 10) {
                if (value % 1 == 0) return value;
              } else {
                if (value % 10 == 0) return value;
              }
            },
          },
          grid: {
            display: false,
            // color: "orange",
          },
        },
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

  //   const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const canvasWidth = 708;
  //   const canvasHeight = 282;
  useEffect(() => {
    let gameCounter: any = null;
    if (liveMultiplierSwitch) {
      setLiveMultiplier("1.00");

      gameCounter = setInterval(() => {
        let time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
        setGamePhaseTimeElapsed(time_elapsed);
        setLiveMultiplier((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2));

        if (multiplierCount.current.length < 1) {
          multiplierCount.current = multiplierCount.current.concat([1]);
          timeCount_xaxis.current = timeCount_xaxis.current.concat([0]);
        }
        if (realCounter_yaxis.current % 5 == 0) {
          multiplierCount.current = multiplierCount.current.concat([
            (1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2),
          ]);
          timeCount_xaxis.current = timeCount_xaxis.current.concat([
            time_elapsed,
          ]);
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
    // retrieve();
    const socket = connect("http://localhost:3001");
    setGlobalSocket(socket);

    // socket.on("news_by_server", function (data) {
    //   setAnnouncement(data);
    // });

    socket.on("start_multiplier_count", function (data) {
      setGlobalTimeNow(Date.now());
      setLiveMultiplierSwitch(true);
    });

    socket.on("stop_multiplier_count", function (data) {
      setLiveMultiplier(data);
      setLiveMultiplierSwitch(false);

      setBetActive(false);
    });

    // socket.on("update_user", function (data) {
    //   getUser();
    // });

    // socket.on("crash_history", function (data) {
    //   setCrashHistory(data);

    //   let temp_streak_list = [];
    //   const new_data = data;
    //   let blue_counter = 0;
    //   let red_counter = 0;

    //   for (let i = 0; i < data.length; i++) {
    //     if (new_data[i] >= 2) {
    //       blue_counter += 1;
    //       red_counter = 0;
    //       temp_streak_list.push(blue_counter);
    //     } else {
    //       red_counter += 1;
    //       blue_counter = 0;
    //       temp_streak_list.push(red_counter);
    //     }
    //   }
    //   setStreakList(temp_streak_list.reverse());
    // });

    socket.on("get_round_id_list", function (data) {
      setRoundIdList(data.reverse());
    });

    socket.on("start_betting_phase", function (data) {
      setGlobalTimeNow(Date.now());
      setLiveMultiplier("Starting...");
      setbBettingPhase(true);
      //   setLiveBettingTable(null);
      setHookToNextRoundBet(true);
      //   retrieve_active_bettors_list();

      multiplierCount.current = [];
      timeCount_xaxis.current = [];
    });

    // socket.on("receive_message_for_chat_box", (data) => {
    //   get_chat_history();
    // });

    // socket.on("receive_live_betting_table", (data) => {
    //   setLiveBettingTable(data);
    //   data = JSON.parse(data);
    //   setTenNumbers(Array(10 - data.length).fill(2));
    // });

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    // get_game_status();
    // getUser();
    setChartSwitch(true);
    // let getChatHistoryTimer = setTimeout(() => get_chat_history(), 1000);
    // let getActiveBettorsTimer = setTimeout(
    //   () => retrieve_active_bettors_list(),
    //   1000
    // );
    // let getBetHistory = setTimeout(() => retrieve_bet_history(), 1000);

    // return () => {
    //   clearTimeout(getChatHistoryTimer);
    //   clearTimeout(getActiveBettorsTimer);
    //   clearTimeout(getBetHistory);
    // };
  }, []);
  useEffect(() => {
    // setChartSwitch(true);
    // let x = 0;
    // let y = canvasHeight;
    // const canvas = canvasRef.current;
    // if (canvas) {
    //   const ctx = canvas.getContext("2d");
    //   if (ctx) {
    //     ctx.beginPath();
    //     ctx.moveTo(0, canvasHeight);
    //     // ctx.lineTo(canvasWidth, 0);
    //     ctx.lineWidth = 3;
    //     let grd = ctx.createLinearGradient(90, 90, 120, 0);
    //     grd.addColorStop(0, "#FFF");
    //     grd.addColorStop(1, "#BF55EC");
    //     ctx.strokeStyle = grd;
    //     for (let i = 0; i < canvasWidth; i++) {
    //       ctx.moveTo(0, canvasHeight);
    //       x = i;
    //       //   y = Math.pow(1.1, x);
    //       y -= 0.25;
    //       ctx.lineTo(x, y);
    //     }
    //     ctx.stroke();
    //     ctx.scale(0.5, 1);
    //   }
    // }
  }, []);
  return (
    <div className="effects-box">
      <div
        className="basically-the-graph"
        //   style={{
        //     height: "90%",
        //     width: "90%",
        //     position: "absolute",
        //     top: "12%",
        //   }}
      >
        {chartData ? (
          <Chart type="line" data={chartData} options={chartOptions} />
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
