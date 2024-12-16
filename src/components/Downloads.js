import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Download = () => {
    const [ downloads, setDownloads ] = useState(null);
    const { url } = useContext(AppContext);

    useEffect(() => {
        axios.get(`${url}/player/downloads`, {}).then((res) => {
            setDownloads(res.data);
        }).catch((err) => {
            console.error(err);
            setDownloads([]);
        });
    }, []);

    const formatDownloads = () => {
        if (!downloads) {
            return <h3>Loading downloads...</h3>;
        }
        if (!downloads.length) {
            return (<h3>No files are available.</h3>);
        }
        return (<ul>
            {downloads.map((fileData, index) => {
                return <li key={index} className='downloadable'><a href={`${url}/${fileData.name}`}>{fileData.name} ({fileData.size} MB)</a></li>}
            )}
        </ul>);
    }

    return (
        <div className='downloads'>
            <h2>Download page</h2>
            {formatDownloads()}
        </div>
    );
}

export default Download;