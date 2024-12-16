import React, { useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Login = () => {
    const { url, dispatch, loginStatus } = useContext(AppContext);
    const username = useRef(null);
    const password = useRef(null);
    
    const submitHandler = (e) => {
        e.preventDefault();
        let actionType = 'Q3_LOG_OUT';
        let payload = {};
        axios.post(`${url}/admin/login`, {
            username: username.current.value,
            password: password.current.value,
        }, {
            withCredentials: true
        }).then((res) => {
            if (res.data.message === 'auth_success') {
                actionType = 'Q3_LOG_IN';
            }
        }).catch((err) => {
            payload = {
                loginStatus: 'login_failure',
            };
            console.log('Error: ' + err);
        }).finally(() => {
            dispatch({type: actionType, payload: payload});
        });
    }

    const logoutClick = (e) => {
        axios.post(`${url}/admin/auth/logout`, {}, {withCredentials: true}).then((res) => {
            dispatch({type: 'Q3_LOG_OUT', payload: {
                loginStatus: 'logged_out',
            }});
        }).catch((err) => {
            console.error(err);
            dispatch({type: 'Q3_LOG_OUT', payload: {
                loginStatus: 'server_error',
            }});
        });
    };

    const loginPage = () => {
     return (
     <div>
        <form onSubmit={submitHandler}>
            <div className='login-data'>
                <label htmlFor="username">Username</label>
                <input className='cmd' ref={username} type="text" id="username" name="username"></input>
            </div>
            <div className='login-data'>
                <label htmlFor="password">Password</label>
                <input className='cmd' ref={password} type="password" id="password" name="password"></input>
            </div>
            <div>
                <input className='button' type="submit" value="Submit"></input>
            </div>
        </form>
        </div>
     );
    };

    const logoutPage = () => {
        return (
            <button className='button' onClick={logoutClick}>Logout</button>
        );
    };

    const loginStatusHuman = (status) => {
        switch (status) {
            case 'logged_in':
                return 'Logged in';
            case 'logged_out':
                return 'Not logged in';
            case 'server_error':
                return 'Server error';
            default:
                return 'Invalid username or password';
        }
    }

    return (
        <div className='login'>
            <h2>Login</h2>
            {loginStatus === 'logged_in' ? logoutPage() : loginPage()}
            <h3>Status: {loginStatusHuman(loginStatus)}</h3>
        </div>
    );
};

export default Login;