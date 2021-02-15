const axios = require('axios');
const url = require('url');


class RestClient{
    constructor(){

    }
}

RestClient.prototype.sendRequest = async function(options){
    const params = ""
    if(options.params){
    params = new url.URLSearchParams(options.params);
    }
    let url = options.url.concate(params.toString())
    let data = {}
    if(options.data){
        data = options.data
    }
    var config = {
        method: options.method,
        url: url,
        timeout: 10000,
        headers: { 
          'accept': 'application/json', 
          'x-access-token': '123'
        },
        data: data
      };
      console.log(config)
     return axios(config)

    }

    module.exports = new RestClient();