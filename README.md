To execute the project run below commands
* npm install
* tsc
* copy public folder and dummyScript.sh to dist/server folder 
* run the project using **node server.js** command 
* Login to browser and launch the login page using http://localhost:8999/
* Execute dummyScript.sh in background inside server using rest **post** api request using URI -> http://localhost:8999/provisioner/urn:imei:333330000011111
* Now connect to a server using websocket client using uri ws://localhost:8999/provisioner/urn:imei:333330000011111 and observe the live logs coming in the client.
