import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ColorFormatter from '../util/ColorFormatter';

const Main = () => {
    const { ip, port, statusResponse } = useContext(AppContext);

    let key = 0;

    const getLevelshot = (levelshot) => {
        let img = null;
        try {
            img = require(`../../public/levelshots/${levelshot}.jpg`);
        } catch {
        } finally {
            if (img) {
                return <img src={img} alt={levelshot}/>
            }
            return <span>{levelshot}</span>
        }
    };

    if (statusResponse === null) {
        return <div>Querying server {ip}:{port}</div>;
    }

    if (Object.entries(statusResponse).length == 0) {
        return <div>Server {ip}:{port} is offline</div>;
    }

    return (
        <div className='server-bar'>
            <div className='levelshot'>{getLevelshot(statusResponse.mapname)}</div>
            <div className='briefing'>
                <h2>Server info</h2>
                <table>
                    <tbody>
                        <tr key={key++}>
                            <td>Hostname</td>
                            <td>{ColorFormatter(statusResponse.sv_hostname)}</td>
                        </tr>
                        <tr key={key++}>
                            <td>IP Address</td>
                            <td>{ip}:{port}</td>
                        </tr>
                        <tr key={key++}>
                            <td>Gamename</td>
                            <td>{ColorFormatter(statusResponse.gamename)}</td>
                        </tr>
                        <tr key={key++}>
                            <td>Mapname</td>
                            <td>{ColorFormatter(statusResponse.mapname)}</td>
                        </tr>
                        <tr key={key++}>
                            <td>Protocol</td>
                            <td>{ColorFormatter(statusResponse.protocol)}</td>
                        </tr>
                        <tr key={key++}>
                            <td>Clients</td>
                            <td>{statusResponse.players.length}/{statusResponse.sv_maxclients}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Main;