import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const ServerConsole = () => {
    const { dispatch, loginStatus, ws, wsMsgs, url } = useContext(AppContext);
    const [ serverResponse, setServerResponse ] = useState('');
    const outputRef = useRef(null);
    const inputRef = useRef(null);
    const consoleRef = useRef(null);
    const checkRef = useRef(null);

    useEffect(() => {
        dispatch({type: 'Q3_SET_OUTPUT', payload: {ref: outputRef, callback: () => { scrollToBottom(); }}});
        scrollToBottom();
    }, [ loginStatus ]);

    const notLoggedIn = () => {
        return <h3>Log in to view this page</h3>
    };

    const sendCmd = (e) => {
        e.preventDefault();
        ws.send(inputRef.current.value);
        inputRef.current.value = '';
    };

    const scrollToBottom = () => {
        if (consoleRef.current) {
            if (checkRef.current.checked)
                consoleRef.current.scrollTo(0, consoleRef.current.scrollHeight);
        }
    };

    const sendRequest = (url) => {
        axios.post(url, {}, {
            withCredentials: true
        }).then((res) => {
            setServerResponse(res.data.message);
        }).catch((err) => {
            console.error(err);
            setServerResponse(err.response.data.message);
        });
    }

    const loggedIn = () => {
        return <div className='console-container'>
            <div ref={consoleRef} className='console'>
                <pre ref={outputRef}>
                    {wsMsgs.map((line, index) => <span key={index}>{line}</span>)}
                </pre>
            </div>
            <ul className='console-list'>
                <li className='checkbox'>
                    <label htmlFor='autoscroll'>Autoscroll</label>
                    <input name='autoscroll' ref={checkRef} type='checkbox' defaultChecked='true'></input>
                </li>
                <li className='form'>
                    <form onSubmit={sendCmd}>
                        <input className='cmd' ref={inputRef} type='text'></input>
                        <input className='button' type='submit' value='Send'></input>
                    </form>
                </li>
            </ul>
            <ul className='control-buttons'>
                <li>
                    <button className='button' onClick={(e) => sendRequest(`${url}/admin/auth/launch`)}>Start server</button>
                </li>
                <li>
                    <button className='button' onClick={(e) => sendRequest(`${url}/admin/auth/quit`)}>Quit server</button>
                </li>
            </ul>
            <h3>Server reponse: {serverResponse}</h3>
        </div>
    }

    return (
    <div>
        <h2>Server Console</h2>
        {loginStatus === 'logged_in' ? loggedIn() : notLoggedIn()}
    </div>
    );
};

export default ServerConsole;