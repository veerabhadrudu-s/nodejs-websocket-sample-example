import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { spawn } from 'child_process';

const app = express();
const deviceIdSimulatorProcessIdMap: Map<string, any> = new Map();
const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html', 'ico', 'js', 'css'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res: any, path: any, stat: any) {
        res.set('x-timestamp', Date.now())
    }
}
app.use(express.static('public', options));

app.get('/', function (req, res) {
    res.redirect('./index.html')
    //res.send('hello world');
});

app.post('/provisioner/:deviceId', function (req, res) {
    console.log(`Received POST request on the URL /provisioner/:deviceId for device ID ${req.params.deviceId}`);
    const deviceSimulatorProcess = spawn('bash', ['./dummyScript.sh', req.params.deviceId, '50']);
    deviceIdSimulatorProcessIdMap.set(req.params.deviceId, deviceSimulatorProcess);
    res.end();
});


//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        console.log(`Incoming request url in on message is ${request.url}`);
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    let urlPathTokens = request.url?.split('/') || [];
    let deviceId = urlPathTokens[urlPathTokens?.length - 1];
    console.log(`Incoming websoket request for device ID ${deviceId} for url path ${request.url}`);
    if (deviceIdSimulatorProcessIdMap.has(deviceId)) {
        console.log(`Device Id matched for incoming websocket request`);
        let deviceSimulatorProcess = deviceIdSimulatorProcessIdMap.get(deviceId);
        deviceSimulatorProcess.stdout.on('data', (data: any) => {
            console.log(`stdout: ${data}`);
            ws.send(`stdout: ${data}`);
        });

        deviceSimulatorProcess.stderr.on('data', (data: any) => {
            console.error(`stderr: ${data}`);
            ws.send(`stderr: ${data}`);
        });

        deviceSimulatorProcess.on('close', (code: any) => {
            console.log(`child process exited with code ${code}`);
            ws.send(`child process simulator closed for device ${deviceId}`);
        });
    }

});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port`);
    console.log(server.address());
});
