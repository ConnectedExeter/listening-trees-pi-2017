#!/usr/bin/env node
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8443;

var isUseHTTPs = true;

    var options = {
        key: fs.readFileSync("./ssl/key.pem"),
        cert: fs.readFileSync("./ssl/cert.pem")
    };

// force auto reboot on failures
var autoRebootServerOnFailure = false;

var server = require(isUseHTTPs ? 'https' : 'http');


function cmd_exec(cmd, args, cb_stdout, cb_end) {
        var spawn = require('child_process').spawn;
        var child = spawn(cmd, args);
        child.on('error', function(err) {
           console.log('cmd_exec. ' + err);
        });

        var me = this;

        me.exit = 0;
        me.stdout = "";
        child.stdout.on('data', function(data) {
            cb_stdout(me, data)
        });
        child.stdout.on('end', function() {
            cb_end(me)
        });
}




//http.createServer(function(request, response) {
function serverHandler(request, response) {
  var reqURL = url.parse(request.url);
  var uri = reqURL.pathname;

  if (uri == '/pistate') {
                response.setHeader('Content-Type', 'application/json');
                response.setHeader('Cache-Control', 'no-cache, no-store');
                try{
                foo = new cmd_exec('dig', ['+short', 'myip.opendns.com', '@resolver1.opendns.com'],
                   function(me, data) {
                      var ip = data.toString().trim();
                      response.end(JSON.stringify({ip:ip}));
                    },
                    function(me) {
                      response.end(JSON.stringify({pi:"hostname"}));
                  }
                );
              }catch(e){
                console.log(e);
                response.end();
              }
                //response.end(JSON.stringify({pi:"hostname"}));
                return;
  }else if (uri == '/piset') {
                var query = queryString.parse( reqURL.query );
                response.end();
                return;
  }

  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}


var app;

if (isUseHTTPs) {
    app = server.createServer(options, serverHandler);
} else {
    app = server.createServer(serverHandler);
}

function runServer() {
    app.on('error', function(e) {
        if (e.code == 'EADDRINUSE') {
            if (e.address === '0.0.0.0') {
                e.address = 'localhost';
            }

            var socketURL = (isUseHTTPs ? 'https' : 'http') + '://' + e.address + ':' + e.port + '/';

            console.log('------------------------------');
            console.log('\x1b[31m%s\x1b[0m ', 'Unable to listen on port: ' + e.port);
            console.log('\x1b[31m%s\x1b[0m ', socketURL + ' is already in use. Please kill below processes using "kill PID".');
            console.log('------------------------------');

            foo = new cmd_exec('lsof', ['-n', '-i4TCP:9001'],
                function(me, data) {
                    me.stdout += data.toString();
                },
                function(me) {
                    me.exit = 1;
                }
            );

            setTimeout(log_console, 250);
        }
    });

    app = app.listen(port, process.env.IP || '0.0.0.0', function(error) {
        var addr = app.address();

        if (addr.address === '0.0.0.0') {
            addr.address = 'localhost';
        }

        var domainURL = (isUseHTTPs ? 'https' : 'http') + '://' + addr.address + ':' + addr.port + '/';

        console.log('------------------------------');

        console.log('socket.io is listening at:');
        console.log('\x1b[31m%s\x1b[0m ', '\t' + domainURL);

        console.log('\n');

        console.log('Your web-browser (HTML file) MUST set this line:');
        console.log('\x1b[31m%s\x1b[0m ', 'connection.socketURL = "' + domainURL + '";');

        if (addr.address != 'localhost' && !isUseHTTPs) {
            console.log('Warning:');
            console.log('\x1b[31m%s\x1b[0m ', 'Please set isUseHTTPs=true to make sure audio,video and screen demos can work on Google Chrome as well.');
        }

        console.log('------------------------------');
        console.log('Need help? http://bit.ly/2ff7QGk');
    });
}

if (autoRebootServerOnFailure) {
    // auto restart app on failure
    var cluster = require('cluster');
    if (cluster.isMaster) {
        cluster.fork();

        cluster.on('exit', function(worker, code, signal) {
            cluster.fork();
        });
    }

    if (cluster.isWorker) {
        runServer();
    }
} else {
    runServer();
}
