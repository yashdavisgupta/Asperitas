#!/usr/bin/env node

const http = require('http');
const express = require('express');
const path = require('path');
const asp = require('./index.js');

asp.configure({
    removeLockString: true,
    otherRoots: []
});

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('$0', 'Browse file system.')
  .alias('p', 'port')
  .describe('p', 'Port to run asperitas. [default:8080]')
  .help('h')
  .alias('h', 'help')
  .argv;

const app = express();

var dir =  process.cwd();
app.get('/b', function(req, res) {
    let file;
    if (req.query.r === '/tmp') {

        /*
         * OTHERROOTS
         * This is an example of a manually calculated path.
         */
        file = path.join(req.query.r,req.query.f);
    } else {
        file = path.join(dir,req.query.f);
    }
    res.sendFile(file);
})


app.use(express.static(__dirname)); // module directory
var server = http.createServer(app);

asp.setcwd(dir, argv.include, argv.exclude);

if(!argv.port) argv.port = 8080;

server.listen(argv.port);

// eslint-disable-next-line no-console
console.log("Please open the link in your browser http://localhost:" +
            argv.port);

app.get('/files', asp.get);

app.get('/', function(req, res) {
    res.redirect('lib/template.html');
});
