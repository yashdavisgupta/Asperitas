#!/usr/bin/env node

const http = require('http');
const express = require('express');
const path = require('path');
const asp = require('./lib/index.js');
const fs = require('fs');
const formidable = require('formidable');

asp.configure({
    removeLockString: true,
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
    file = path.join(dir,req.query.f);
    res.sendFile(file);
})

app.post('/upload', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldPath = files.file.path;
        var newPath = __dirname + fields.directory + '/' +files.file.name
        var rawData = fs.readFileSync(oldPath)
        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err)
            return res.send("Successfully uploaded")
        })
  })
});

app.use(express.static(__dirname)); // module directory
var server = http.createServer(app);

asp.setcwd(dir);

if(!argv.port) argv.port = 8080;

server.listen(argv.port);

// eslint-disable-next-line no-console
console.log("Please open the link in your browser http://localhost:" +
            argv.port);

app.get('/files', asp.get);

app.get('/', function(req, res) {
    res.redirect('app/template.html');
});
