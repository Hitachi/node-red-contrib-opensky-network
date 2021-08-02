/*jshint -W069 */
/**
 * OpenSky REST API
 * @class OpenskyNetwork
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var OpenskyNetwork = (function(){
    'use strict';

    var request = require('request');
    var Q = require('q');
    var fileType = require('file-type');

    function OpenskyNetwork(options){
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'https://opensky-network.org/api';
        if(this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                      var parameter = parameters.$queryParameters[parameterName];
                      queryParameters[parameterName] = parameter;
            });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name OpenskyNetwork#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    OpenskyNetwork.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred){
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if(Object.keys(form).length > 0) {
            if (req.headers['Content-Type'] && req.headers['Content-Type'][0] === 'multipart/form-data') {
                delete req.body;
                var keyName = Object.keys(form)[0]
                req.formData = {
                    [keyName]: {
                        value: form[keyName],
                        options: {
                            filename: (fileType(form[keyName]) != null ? `file.${ fileType(form[keyName]).ext }` : `file` )
                        }
                    }
                };
            } else {
                req.form = form;
            }
        }
        if(typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body){
            if(error) {
                deferred.reject(error);
            } else {
                if(/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch(e) {}
                }
                if(response.statusCode === 204) {
                    deferred.resolve({ response: response });
                } else if(response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({ response: response, body: body });
                } else {
                    deferred.reject({ response: response, body: body });
                }
            }
        });
    };


/**
 * This API call can be used to retrieve any state vector of the OpenSky.
 * @method
 * @name OpenskyNetwork#allStateVectors
 * @param {object} parameters - method options and parameters
     * @param {number} parameters.lamin - Lower bound for the latitude in decimal degrees
     * @param {number} parameters.lomin - Lower bound for the longitude in decimal degrees
     * @param {number} parameters.lamax - Upper bound for the latitude in decimal degrees
     * @param {number} parameters.lomax - Upper bound for the longitude in decimal degrees
 */
 OpenskyNetwork.prototype.allStateVectors = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/states/all';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['lamin'] !== undefined){
                    queryParameters['lamin'] = parameters['lamin'];
                }
        
        
        


        if(parameters['lamin'] === undefined){
            deferred.reject(new Error('Missing required  parameter: lamin'));
            return deferred.promise;
        }
 

                if(parameters['lomin'] !== undefined){
                    queryParameters['lomin'] = parameters['lomin'];
                }
        
        
        


        if(parameters['lomin'] === undefined){
            deferred.reject(new Error('Missing required  parameter: lomin'));
            return deferred.promise;
        }
 

                if(parameters['lamax'] !== undefined){
                    queryParameters['lamax'] = parameters['lamax'];
                }
        
        
        


        if(parameters['lamax'] === undefined){
            deferred.reject(new Error('Missing required  parameter: lamax'));
            return deferred.promise;
        }
 

                if(parameters['lomax'] !== undefined){
                    queryParameters['lomax'] = parameters['lomax'];
                }
        
        
        


        if(parameters['lomax'] === undefined){
            deferred.reject(new Error('Missing required  parameter: lomax'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };

    return OpenskyNetwork;
})();

exports.OpenskyNetwork = OpenskyNetwork;
