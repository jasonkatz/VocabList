var path = require('path'),
    fs = require('fs');

function route(handle, pathname, response, postData) {
    console.log("Routing request for " + pathname + ".");


    // Check if retrieving file (set document root)
    var filename = path.join(process.cwd(), "../" + pathname);
    fs.exists(filename, function(exists) {
        if (exists) {
            console.log("File route"); 
            // Check if root route
            if (pathname == "/") {
                console.log("Root route");
                handleRoute(handle, pathname, response, postData);
            } else {
                handle["file"](pathname, response, postData);
            }
        } else {
            console.log("File " + filename + " not found; routing request.");
            // Not a file; route request
            handleRoute(handle, pathname, response, postData);
        }
    });
}

function handleRoute(handle, pathname, response, postData) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, postData);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found");
        response.end();
    }
}

exports.route = route;
