#!/usr/bin/env node
var argv = require('optimist').argv;
var path = require('path');
var fs = require('fs');
var logger = require('./lib/logger');
var jf = require('jsonfile');
var async = require('async');
var runners = require('./lib/runners');
var _ = require('underscore');
var readPackageJson = require("read-cortex-json");


var cwd = argv.cwd || process.cwd();

var builder = require("./lib/builder");

var mode = argv.mode || "local";
var required_args = runners[mode].args || [];

var readPackage = readPackageJson.get_original_package;

function containsInArgv(arg){
    return arg in argv;
}

function printRequiredArg(arg){
    console.log("required arg --%s for mode `%s`".grey, arg, mode);
}

function buildPage(done){
    readPackage(cwd, function(err, pkg){
        if(err){return done(err);}
        builder.build( _.extend({
            mode: mode,
            pkg : pkg,
            targetVersion : "latest",
            cwd : cwd
        },argv),function(err,result){
            done(err, result && result.path);
        });
    });
}

function testPage(path, done){
    var option = _.extend({
        cwd: cwd,
        path: path
    },argv);

    runners[mode].test(option);
}


if(!required_args.every(containsInArgv)){
    required_args.forEach(printRequiredArg);
    process.exit(1);
}

logger.info("cortex test in %s mode",mode);
async.waterfall([buildPage,testPage],function(err){
    if(err){
        logger.error(err.message || err);
        process.exit(1);
    }
});