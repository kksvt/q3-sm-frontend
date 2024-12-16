import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ColorFormatter from '../util/ColorFormatter';

const ServerTracker = () => {
    const { ip, port, statusResponse } = useContext(AppContext);

    const TrackerDetailed = () => {
        return <div>
            <h1>Server data</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Cvar</th>
                        <th>Value</th>
                    </tr>
                    {Object.entries(statusResponse).filter(([key, value]) => key !== 'players').map(([key, value]) => {
                        return (<tr>
                            <td>{key}</td>
                            <td>{ColorFormatter(value)}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <h2>Players</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Score</th>
                        <th>Ping</th>
                        <th>Name</th>
                    </tr>
                    {
                    statusResponse.players.map(({score, ping, name}) => {
                        return (<tr>
                            <td>{score}</td>
                            <td>{ping}</td>
                            <td>{ColorFormatter(name)}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>;
    }

    if (statusResponse === null) {
        return <div>Querying server {ip}:{port}</div>;
    }

    if (Object.keys(statusResponse).length === 0) {
        return <div>Server {ip}:{port} is offline</div>; 
    }

    return <div><TrackerDetailed/></div>
}

export default ServerTracker;