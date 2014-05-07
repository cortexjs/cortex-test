var Browserman = require('browserman-client');
var url = require('url');
var logger = require('../logger');

exports.test = function(config){

    var browserman_urls = (config.browserman || "").split(":");

    var browserman = new Browserman({
        host: browserman_urls[0],
        port: browserman_urls[1]
    });



    logger.info("connect to %s", browserman.serverAddress);
    var test = browserman.test({
        path: config.path
    });
    test.on('done', function(result) {
        console.log(result);
    }).on('complete', function() {
        process.exit(0);
    }).on('error',function(error){
        logger.error(error.message);
    });
}