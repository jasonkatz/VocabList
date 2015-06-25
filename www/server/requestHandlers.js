var querystring = require("querystring"), 
    fs = require("fs");

function home(response, postData) {
    console.log("Request handler 'home' was called.");

    fs.readFile('../index.html', function(err, html) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    });
}

function file(filename, response, postData) {
    console.log("Request handler 'file' was called for " + filename + ".");
    fs.readFile(filename, function (err, content) {
        if (err)  {
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
    });
}

exports.home = home;
exports.file = file;
