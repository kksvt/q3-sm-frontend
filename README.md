# Quake 3 Server Manager
Quake 3 Server Manager is a web application that faciliates the management of a Quake 3 engined-based game server. It provides a detailed game server tracker, restarter, web server console and a download page that contains all the mods used by the game server.

## Front-end
The front-end for the application is written in React and provides a simple yet intuitive control over the server. After cloning the repository you can install all necessary dependencies through **NPM**.

    cd q3-sm-frontend && npm install

## Configuring the application

The **.env** file inside the main directory contains the settings necessary to connect the front-end to the back-end part.

    HTTPS=true
    REACT_APP_API_URL="https://localhost:443"
    REACT_APP_WS_ADDR="wss://localhost:443/admin/console"
    REACT_APP_SERV_IP=
    REACT_APP_SERV_PORT=
    REACT_APP_MAX_MSG_HISTORY=512

Setting | Description
--- | ---
HTTPS | If true, the front-end will be run on HTTPS as opposed to HTTP. Since we will be sending sensitive data (such as login credentials), we want the connection to be encrypted.
REACT_APP_API_URL | The URL to the backend.
REACT_APP_WS_ADDR | The URL to the backend's websocket server, which is used for sending game server's console output to the logged in users and executing RCon commands.
REACT_APP_SERV_IP | IP of the game server, used for display purposes.
REACT_APP_SERV_PORT | Port of the game server, used for display purposes.
REACT_APP_MAX_MSG_HISTORY | The maximum number of the server messages displayed in the console.

## Running the application
If you wish to run the application you should also do it thrugh **NPM**.

    npm start

## Map levelshots for the Server Tracker
The Server Tracker may display a levelshot of the map that is currently played on the game server. The front-end will attempt to retrieve the image used for the levelshot from **/public/levelshots**.

## Deploying the frontend
Whether you are going to run the back-end and the front-end on the same server or not, you will have to create a production build. You can do it through

    npm run build

Which will generate static files in the *build/* directory, that you can later deploy to an HTTPS server.
