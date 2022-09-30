// import { useState } from "react";
import "./App.css";
// import RingOfFortune from "./components/RingOfFortune";
// import { motion } from "framer-motion";
import Crash from "./components/Crash";
function App() {
  // const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="App">
      {/* <button onClick={() => setIsVisible(true)}> click</button> */}
      <Crash />
    </div>
  );
}

export default App;
