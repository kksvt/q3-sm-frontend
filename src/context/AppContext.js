import React, { createContext, useReducer } from 'react';

let wsConsoleRef = null;
let wsCallbackRef = null;

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'Q3_GETSTATUS_QUERY':
            state.statusResponse = action.payload.statusResponse;
            return {...state };
        case 'Q3_LOG_IN':
            if (state.loginStatus === 'logged_in') {
                console.log('You are already logged in, ignoring...');
                return state;
            }
            state.loginStatus = 'logged_in';
            if (state.ws && (state.ws === WebSocket.OPEN || state.ws === WebSocket.CONNECTING)) {
                console.log('Closing old websocket connection');
                const oldWs = state.ws;
                state.ws = null;
                oldWs.close();
            }
            const ws = new WebSocket(process.env.REACT_APP_WS_ADDR);
            ws.onmessage = ((event) => {
                let msg = event.data.toString();

                if (msg.charAt(msg.length - 1) != '\n') {
                    msg += '\n';
                }

                state.wsMsgs.push(msg);
                if (state.wsMsgs.length > process.env.REACT_APP_MAX_MSG_HISTORY) {
                    state.wsMsgs = state.wsMsgs.slice(process.env.REACT_APP_MAX_MSG_HISTORY / 4);
                }
                if (wsConsoleRef && wsConsoleRef.current) {
                    if (wsConsoleRef.current.textContent.length > process.env.REACT_APP_MAX_CONSOLE_LEN) {
                        wsConsoleRef.current.textContent = wsConsoleRef.current.textContent.slice(process.env.REACT_APP_MAX_CONSOLE_LEN / 4);
                    }
                    wsConsoleRef.current.textContent += msg;
                    if (wsCallbackRef) {
                        wsCallbackRef();
                    }
                }
            });

            ws.onclose = ((event) => {
                console.log(event);
                if (wsConsoleRef && wsConsoleRef.current) {
                    wsConsoleRef.current.textContent += '[You have been logged out]\n';
                }
                state.loginStatus = 'logged_out';
                window.location.reload();
            });

            state.ws = ws;
            return {...state};
        case 'Q3_LOG_OUT':
            if (state.ws && (state.ws === WebSocket.OPEN || state.ws === WebSocket.CONNECTING)) {
                console.log('Closing the existing websocket connection');
                const oldWs = state.ws;
                state.ws = null;
                oldWs.close();
            }
            if (action.payload && action.payload.loginStatus) {
                state.loginStatus = action.payload.loginStatus;
            }
            return { ...state};
        case 'Q3_SET_OUTPUT':
            wsConsoleRef = action.payload.ref;
            wsCallbackRef = action.payload.callback;
            return state;
        default:
            return state;
    }
};

const initialState = {
    url: process.env.REACT_APP_API_URL,
    ip: process.env.REACT_APP_SERV_IP,
    port: process.env.REACT_APP_SERV_PORT,
    statusResponse: null,
    loginStatus: 'logged_out',
    ws: null,
    wsMsgs: [],
};

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    
    return (
        <AppContext.Provider
            value = {{
                url: state.url,
                ip: state.ip,
                port: state.port,
                statusResponse: state.statusResponse,
                ws: state.ws,
                loginStatus: state.loginStatus,
                wsMsgs: state.wsMsgs,
                wsRef: wsConsoleRef,
                wsCallbackRef,
                dispatch
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
};