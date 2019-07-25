import React from "react";

function App() {
  return (
    <button onClick={() => fetch("http://localhost:4000/notify")}>
      Trigger Notification
    </button>
  );
}

export default App;
