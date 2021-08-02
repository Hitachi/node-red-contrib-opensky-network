'use strict';
var lib = require('./lib.js');

module.exports = function (RED) {
    function OpenskyNetworkNode(config) {
        RED.nodes.createNode(this, config);
        this.method = config.method;
        this.allStateVectors_lamin = config.allStateVectors_lamin;
        this.allStateVectors_laminType = config.allStateVectors_laminType || 'str';
        this.allStateVectors_lomin = config.allStateVectors_lomin;
        this.allStateVectors_lominType = config.allStateVectors_lominType || 'str';
        this.allStateVectors_lamax = config.allStateVectors_lamax;
        this.allStateVectors_lamaxType = config.allStateVectors_lamaxType || 'str';
        this.allStateVectors_lomax = config.allStateVectors_lomax;
        this.allStateVectors_lomaxType = config.allStateVectors_lomaxType || 'str';
        var node = this;

        setInterval(function () {
            node.emit("input", {});
        }, 10000);
        node.on('input', function (msg) {
            var errorFlag = false;
            var client = new lib.OpenskyNetwork();
            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;
            if (!errorFlag && node.method === 'allStateVectors') {
                var allStateVectors_parameters = [];
                var allStateVectors_nodeParam;
                var allStateVectors_nodeParamType;

                allStateVectors_nodeParam = node.allStateVectors_lamin;
                allStateVectors_nodeParamType = node.allStateVectors_laminType;
                if (allStateVectors_nodeParamType === 'num') {
                    allStateVectors_parameters.lamin = allStateVectors_nodeParam || '';
                } else {
                    allStateVectors_parameters.lamin = RED.util.getMessageProperty(msg, allStateVectors_nodeParam);
                }
                allStateVectors_parameters.lamin = !!allStateVectors_parameters.lamin ? allStateVectors_parameters.lamin : msg.payload;
                
                allStateVectors_nodeParam = node.allStateVectors_lomin;
                allStateVectors_nodeParamType = node.allStateVectors_lominType;
                if (allStateVectors_nodeParamType === 'num') {
                    allStateVectors_parameters.lomin = allStateVectors_nodeParam || '';
                } else {
                    allStateVectors_parameters.lomin = RED.util.getMessageProperty(msg, allStateVectors_nodeParam);
                }
                allStateVectors_parameters.lomin = !!allStateVectors_parameters.lomin ? allStateVectors_parameters.lomin : msg.payload;
                
                allStateVectors_nodeParam = node.allStateVectors_lamax;
                allStateVectors_nodeParamType = node.allStateVectors_lamaxType;
                if (allStateVectors_nodeParamType === 'num') {
                    allStateVectors_parameters.lamax = allStateVectors_nodeParam || '';
                } else {
                    allStateVectors_parameters.lamax = RED.util.getMessageProperty(msg, allStateVectors_nodeParam);
                }
                allStateVectors_parameters.lamax = !!allStateVectors_parameters.lamax ? allStateVectors_parameters.lamax : msg.payload;
                
                allStateVectors_nodeParam = node.allStateVectors_lomax;
                allStateVectors_nodeParamType = node.allStateVectors_lomaxType;
                if (allStateVectors_nodeParamType === 'num') {
                    allStateVectors_parameters.lomax = allStateVectors_nodeParam || '';
                } else {
                    allStateVectors_parameters.lomax = RED.util.getMessageProperty(msg, allStateVectors_nodeParam);
                }
                allStateVectors_parameters.lomax = !!allStateVectors_parameters.lomax ? allStateVectors_parameters.lomax : msg.payload;
                                result = client.allStateVectors(allStateVectors_parameters);
            }
            if (!errorFlag && result === undefined) {
                node.error('Method is not specified.', msg);
                errorFlag = true;
            }
            var setData = function (msg, data) {
                if (data) {
                    if (data.response) {
                        if (data.response.statusCode) {
                            msg.statusCode = data.response.statusCode;
                        }
                        if (data.response.headers) {
                            msg.headers = data.response.headers;
                        }
                        if (data.response.request && data.response.request.uri && data.response.request.uri.href) {
                            msg.responseUrl = data.response.request.uri.href;
                        }
                    }
                    if (data.body) {
                        msg.payload = data.body;
                    }
                }
                return msg;
            };
            if (!errorFlag) {
                node.status({ fill: 'blue', shape: 'dot', text: 'OpenskyNetwork.status.requesting' });
                result.then(function (data) {
                    for (var i = 0; i < data.body.states.length; i++) {
                        var msg2 = {};
                        msg2.payload = {
                            name: data.body.states[i][0],
                            lon: data.body.states[i][5],
                            lat: data.body.states[i][6],
                            heading: data.body.states[i][10],
                            icon: 'plane'
                        };
                        node.send(msg2);
                    }
                    node.status({});
                }).catch(function (error) {
                    var message = null;
                    if (error && error.body && error.body.message) {
                        message = error.body.message;
                    }
                    node.error(error);
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType('opensky-network', OpenskyNetworkNode);
};
