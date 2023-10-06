import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { UserRole } from './cores/types/UserRole';
import Home from './components/pages/home/Home';
import Client from './components/pages/client/Client';
import Panel from './components/pages/panel/Panel';
import Develop from './components/pages/develop/Develop';
import useModalCreater from './modules/modal/Modal';
import Authentication, { AuthenticationState } from './components/pages/common/authentication/Authentication';



function App() {
  /** state */
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>("Unauthenticated");


  /** 모달 추가 */
  useModalCreater();


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.ts').then(() => {
      console.log("Service Worker Registered!");
    }).catch(error => {
      console.log("Service Worker Registration Failed:", error);
    });
  }


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Develop
            setUserRole={setUserRole}
          />} />

          <Route path="/home" element={<Home
            userRole={userRole}
            authentication={{ state: authenticationState, setState: setAuthenticationState }}
            appType={"client"} />}
          />

          <Route path="/authentication" element={<Authentication
            userRole={userRole}
            authentication={{ state: authenticationState, setState: setAuthenticationState }}
          />} />

          <Route path="/client" element={<Client
            userRole={userRole}
            authentication={{ state: authenticationState, setState: setAuthenticationState }}
          />} />

          <Route path="/panel" element={<Panel
            userRole={userRole}
            authentication={{ state: authenticationState, setState: setAuthenticationState }}
          />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;