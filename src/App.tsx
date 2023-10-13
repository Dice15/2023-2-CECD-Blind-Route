import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { UserRole } from './cores/types/UserRole';
import Home from './components/pages/home/Home';
import Client from './components/pages/client/Client';
import Panel from './components/pages/panel/Panel';
import Develop from './components/pages/develop/Develop';
import useModalCreater from './modules/modal/Modal';
import Authentication, { AuthenticationActionType } from './components/pages/common/authentication/Authentication';
import { AppType } from './cores/types/AppType';



/** App */
function App() {
  /** state */
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [appType, setAppType] = useState<AppType>("client");
  const [authenticationActionType, setAuthenticationActionType] = useState<AuthenticationActionType>("idle");


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
            setAppType={setAppType}
            setUserRole={setUserRole}
          />} />

          <Route path="/authentication" element={<Authentication
            userRole={userRole}
            actionType={authenticationActionType}
          />} />

          <Route path="/home" element={<Home
            appType={appType}
            userRole={userRole}
            authenticationActionType={authenticationActionType}
            setAuthenticationActionType={setAuthenticationActionType}
          />} />

          <Route path="/client" element={<Client
            userRole={userRole}
          />} />

          <Route path="/panel" element={<Panel
            userRole={userRole}
          />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;