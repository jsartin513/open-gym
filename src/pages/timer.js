import React, { useState } from "react";
import Layout from "../components/(layout)/layout";
import Timer from "../components/Timer";


const TimerPage = () => {
  const [mode, setMode] = useState("foam");

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <Layout>
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Ball Type</h1>
        <div className="flex space-x-4 mb-8"> {/* Added some space between buttons */}
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${mode === "foam" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            onClick={() => handleModeChange("foam")}
            disabled={mode === "foam"}
          >
            Foam
          </button>
          <button
            className={`bg-green-500 text-white font-bold py-2 px-4 rounded ${mode === "cloth" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
            onClick={() => handleModeChange("cloth")}
            disabled={mode === "cloth"}
          >
            Cloth
          </button>
        </div>
        <Timer mode={mode} />
      </div>
    </Layout>
  );
};

export default TimerPage;
