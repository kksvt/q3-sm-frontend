import React, { useContext, useEffect } from 'react';
import { Route, Routes, NavLink, HashRouter } from "react-router-dom";
import { AppContext } from './context/AppContext';
import Main from './components/Main';
import ServerTracker from './components/ServerTracker';
import ServerConsole from './components/ServerConsole';
import Downloads from './components/Downloads';
import Login from './components/Login';
import axios from 'axios';
import './App.css';

function App() {
  const { dispatch, url } = useContext(AppContext);

  useEffect(() => {
    let actionType = 'Q3_LOG_OUT';
    let payload = {};
    axios.get(`${url}/admin/auth/check`, { 
      withCredentials: true,
    } )
    .then((res) => {
      if (res.data.message === 'auth_success') {
        actionType = 'Q3_LOG_IN';
        payload = {
          username: res.data.username,
          accessToken: res.data.accessToken,
      };
      }
    })
    .catch((err) => {
      console.error('Session expired or does not exist');
      console.error(err)
    })
    .finally(() => {
      dispatch({type: actionType, payload: payload});
    })
    sendGetstatus();
  }, []);

  const sendGetstatus = () => {
      axios
        .get(`${url}/player/status`)
        .then((res) => {
            dispatch({
                type: 'Q3_GETSTATUS_QUERY',
                payload: {
                    statusResponse: res.data,
                }
            });
        })
        .catch((err) => {
          console.error(err);
            dispatch({
                type: 'Q3_GETSTATUS_QUERY',
                payload: {
                    statusResponse: '',
                }
            });
      });
  }

  return (
    <HashRouter>
      <h1>Q3 Server Manager</h1>
      <ul className='navigation'>
        <li><NavLink to='/' onClick={(e) => { sendGetstatus() }}>Main page</NavLink></li>
        <li><NavLink to='/tracker' onClick={(e) => { sendGetstatus() }}>Server Cvars</NavLink></li>
        <li><NavLink to='/downloads'>Downloads</NavLink></li>
        <li><NavLink to="/console">Server Console</NavLink></li>
        <li><NavLink to='/login'>Login</NavLink></li>
      </ul>
      <hr />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/tracker' element={<ServerTracker />} />
          <Route path='/downloads' element={<Downloads/>}/>
          <Route path='/console' element={<ServerConsole />} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </div>
    </HashRouter>
    );

}

export default App;
