import React, { createContext, useReducer } from 'react';

let wsCallbackRef = null;
let wsMsgs = [];

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
                const msg = event.data.toString();
                const split = msg.split('\n');
                let modified = false;
                split.forEach(line => {
                    if (!line.length)
                        return;
                    if (line.length === 1 && line.charAt(0) === '\r')
                        return;
                    if (line.charAt(line.length - 1) !== '\n') {
                        wsMsgs.push(line + '\n');
                    }
                    else {
                        wsMsgs.push(line);
                    }
                    modified = true;
                });

                if (modified) {
                    if (wsMsgs.length > state.msgHistoryMax) {
                        wsMsgs = wsMsgs.slice(state.msgHistoryMax / 4);
                    }

                    if (wsCallbackRef) {
                        wsCallbackRef(wsMsgs);
                    }
                }
            });

            ws.onclose = ((event) => {
                console.log(event);
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
            wsCallbackRef = action.payload.callback;
            if (wsCallbackRef && wsMsgs.length) {
                wsCallbackRef(wsMsgs);
            }
            return state;
        default:
            return state;
    }
};

const initialState = {
    url: process.env.REACT_APP_API_URL,
    ip: process.env.REACT_APP_SERV_IP,
    port: process.env.REACT_APP_SERV_PORT,
    msgHistoryMax: process.env.REACT_APP_MAX_MSG_HISTORY,
    statusResponse: null,
    loginStatus: 'logged_out',
    ws: null,
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
                msgHistoryMax: state.msgHistoryMax,
                dispatch
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
};