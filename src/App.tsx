import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const handleLoginWithKeycloak = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/keycloak";
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={handleLoginWithKeycloak} style={{ width: "200px", height: "50px" }}>Login Test</button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </header >
    </div >
  );
}

export default App;
