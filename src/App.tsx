import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';

function App() {

  const handleLoginWithKeycloak = () => {
    //window.location.href = "http://localhost:8081/oauth2/authorization/google";
    window.location.href = "https://blindroute-springboot.koyeb.app/oauth2/authorization/google";
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


/*
<header className="App-header">
        <div>
          <button onClick={handleLoginWithKeycloak} style={{ width: "200px", height: "50px" }}>Login Test</button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </header >
*/