/**
 * Created by btsmith on 2/6/2016.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');

//Lets define a port we want to listen to

const PORT=5000;
//Create a server
var server = http.createServer(function(request, response) {
    var file      = path.basename(request.url) || 'views/index.html';
    console.log(request.url);
    fs.exists(file, function(exists) {
        if(exists) {
            fs.readFile(file, function(err, data) {
                if(!err){
                    response.end(data);
                } else {
                    console.dir(err);
                }
            });
        } else {
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end("404 page not found");
        }
    });
    console.log(request.url);
});
//Lets start our server
server.listen(PORT, function(){
    // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
