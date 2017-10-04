var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8080;

function cmd_exec(cmd, args, cb_stdout, cb_end) {
        var spawn = require('child_process').spawn,
            child = spawn(cmd, args),
            me = this;
        me.exit = 0;
        me.stdout = "";
        child.stdout.on('data', function(data) {
            cb_stdout(me, data)
        });
        child.stdout.on('end', function() {
            cb_end(me)
        });
}


http.createServer(function(request, response) {

  var reqURL = url.parse(request.url);
  var uri = reqURL.pathname;

  if (uri == '/pistate') {
                response.setHeader('Content-Type', 'application/json');
                response.setHeader('Cache-Control', 'no-cache, no-store');
                foo = new cmd_exec('dig', ['+short', 'myip.opendns.com', '@resolver1.opendns.com'],
                   function(me, data) {
                      var ip = data.toString().trim();
                      response.end(JSON.stringify({ip:ip}));
                    },
                    function(me) {
                      response.end(JSON.stringify({pi:"hostname"}));
                  }
                );
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
}).listen(parseInt(port, 10));
