import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const handleLoginWithKeycloak = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/keycloak";
  };

  return (
    <div className="App">
      <button onClick={handleLoginWithKeycloak}>Login with Keycloak</button>
    </div>
  );
}

export default App;
