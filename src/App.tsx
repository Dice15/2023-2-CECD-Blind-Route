import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useModalCreater from './components/modal/Modal';
import Home from './components/home/Home';
import Client from './components/client/Client';
import React, { useState } from 'react';
import { UserRole } from './cores/types/UserRole';


//export const UserRoleContext = React.createContext<UserRole>(UserRole.USER);
//export const SetUserRoleContext = React.createContext<React.Dispatch<React.SetStateAction<UserRole>> | null>(null);


function App() {
  /** state */
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);

  useModalCreater();  // 모달 추가

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setUserRole={setUserRole} />} />
          <Route path="/client" element={<Client userRole={userRole} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;