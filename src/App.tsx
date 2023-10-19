import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserRole } from './cores/types/UserRole';
import Home from './components/pages/home/Home';
import Client from './components/pages/client/Client';
import Panel from './components/pages/panel/Panel';
import Develop from './components/pages/develop/Develop';
import Authentication, { AuthenticationAction } from './components/pages/common/authentication/Authentication';



/** App */
function App() {
  /** state */
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [authenticationAction, setAuthenticationAction] = useState<AuthenticationAction>("idle");




  /** 모바일 주소창을 고려한 vh크기 */
  useEffect(() => {
    // https://velog.io/@eunddodi/React-%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%9B%B9-%EC%95%B1-100vh-%EC%8B%A4%EC%A0%9C-%ED%99%94%EB%A9%B4-%ED%81%AC%EA%B8%B0%EB%A1%9C-%EB%A7%9E%EC%B6%94%EA%B8%B0
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });



  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Develop />} />

          <Route path="/home" element={<Home
            setUserRole={setUserRole}
            authenticationAction={authenticationAction}
            setAuthenticationAction={setAuthenticationAction}
          />} />

          <Route path="/authentication" element={<Authentication
            userRole={userRole}
            authenticationAction={authenticationAction}
          />} />

          <Route path="/client/*" element={<Client
            userRole={userRole}
          />} />

          <Route path="/panel" element={<Panel
            userRole={userRole}
          />} />

        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;