node-red-contrib-opensky-network
================

Node-RED node to retrieve flight data from [OpenSky Network API](https://opensky-network.org/apidoc/).

## Install

To install the stable version, use the `Menu - Manage palette - Install` 
option and search for node-red-contrib-opensky-network, or run the following 
command in your Node-RED user directory, typically `~/.node-red`

    npm install node-red-contrib-opensky-network

## Usage

(1) Place the OpenSky Network node to the workspace on the Node-RED flow editor

(2) Add and connect to the worldmap node in [node-red-contrib-web-worldmap](https://flows.nodered.org/node/node-red-contrib-web-worldmap) 
module

<img src="https://raw.githubusercontent.com/Hitachi/node-red-contrib-opensky-network/master/flow.png" width="400px">

(3) Input 4 values (southern latitude, western longitude, north latitude, and eastern longitude) to the property of the OpenSky Network node

<img src="https://raw.githubusercontent.com/Hitachi/node-red-contrib-opensky-network/master/property.png" width="600px">


(4) Deploy the flow and open the worldmap UI via [http://localhost:1880/worldmap/](http://localhost:1880/worldmap/).

<img src="https://raw.githubusercontent.com/Hitachi/node-red-contrib-opensky-network/master/map.png" width="600px">

After opening the worldmap UI, you can see flight data on the UI in real-time.

## Demonstration

The demonstration slides and video in Japanese are available on the following URL.

- Slide: https://www.slideshare.net/ssuserbeb7c0/nodered-248861446/5
- Video: https://youtu.be/d9CFfAIWX0I?t=2245
