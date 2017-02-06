'use strict';

const net = require('net');
var url = require('url');

//if help only
if (process.argv[2] == 'help') {
    var printdefaultHelp = true;
    if (process.argv.length == 4) {
        switch (process.argv[3].toLowerCase()) {
        case "get":
            printdefaultHelp = false;
            console.log('usage: httpc get [-v] [-h key:value] URL');
            console.log('Get executes a HTTP GET request for a given URL.');
            console.log(' -v Prints the detail of the response such as protocol,');
            console.log('status, and headers.');
            console.log(' -h key:value Associates headers to HTTP Request with the format');
            console.log('\'key:value\'.');
            break;
        case "post":
            printdefaultHelp = false;
            console.log('usage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL');
            console.log('Post executes a HTTP POST request for a given URL with inline data or');
            console.log('from file.');
            console.log(' -v Prints the detail of the response such as protocol, ');
            console.log('     status, and headers.');
            console.log(' -h key:value Associates headers to HTTP Request with the format');
            console.log('\'key:value\'.');
            console.log(' -d string Associates an inline data to the body HTTP POST');
            console.log('request.');
            console.log(' -f file Associates the content of a file to the body HTTP');
            console.log('POST request.');
            console.log('Either [-d] or [-f] can be used but not both.');
            break;
        }
    }
    if (printdefaultHelp) {
        console.log('httpc is a curl-like application but supports HTTP protocol only.');
        console.log('Usage:');
        console.log('httpc command [arguments]');
        console.log('The commands are:');
        console.log('get executes a HTTP GET request and prints the response.');
        console.log('post executes a HTTP POST request and prints the response.');
        console.log('help prints this screen.');
        console.log('Use "httpc help [command]" for more information about a command.');
    }
    process.exit(-1);
}

if (process.argv.length > 3) {
    //handle get
    var additHeaderParams = "User-Agent:Concordia-HTTP/1.0\n";
    var isGet,type;
    if (process.argv[2].toLowerCase() == "get") {
        isGet = true;
        type = "GET";
    } else if (process.argv[2].toLowerCase() == "post") {
        //parse the URL
        isGet = false;
        type = "POST";
        additHeaderParams = additHeaderParams + "content-type: application/json\n";
    } else {
        quitInvalidParamError();
    }
    var verbose = (process.argv[3].toLowerCase() == "-v");
    //parse the URL
    var urlToParse = process.argv[process.argv.length - 1];
    var urlObj = url.parse(urlToParse);

    //handle the remaining -h
    var numberParamsNoH = 4;
    if (verbose) {
        numberParamsNoH++;
    }
    //if there is not an even humber of [-h key:value] left in GET, quit
    //or even number of [-h key:value] [-d inline-data] [-f file] in the case of POST
    if ((process.argv.length - numberParamsNoH) % 2 != 0) {
        quitInvalidParamError();
    }

    //process the -h*
    while (process.argv.length - numberParamsNoH > 0) {
        if (process.argv[numberParamsNoH - 1].toLowerCase() != "-h") {
            if (isGet){
                quitInvalidParamError();
            } else {
                break;
            }
        }
        additHeaderParams = additHeaderParams + process.argv[numberParamsNoH] + "\n";
        numberParamsNoH++;
        numberParamsNoH++;
    }
    
    if (!isGet){
        var inlineDataParam = "";
        //process the -d
        if (process.argv[numberParamsNoH - 1].toLowerCase() == "-d") {
            inlineDataParam = process.argv[numberParamsNoH];
        } else if (process.argv[numberParamsNoH - 1].toLowerCase() == "-f") {
            //inlineDataParam = process.argv[numberParamsNoH] + "\n";
        } else {
            quitInvalidParamError();
        }
        additHeaderParams = additHeaderParams + "content-length: "+inlineDataParam.length + "\n\n"+inlineDataParam;
    }
    var clientWritingString = type + " " + urlObj.path + " HTTP/1.0 \nHost: " + urlObj.host + "\n" + additHeaderParams + "\n";
  //  clientWritingString = "POST /post HTTP/1.0\nHost: httpbin.org\ncontent-type: application/json\naaaaa: bbbbb\ncontent-length: "+inlineDataParam.length+"\n\n"+inlineDataParam+"\n";

} else {
    quitInvalidParamError();
}
/*
//verify the input
if (!(process.argv[2] == 'get' || process.argv[2] == 'post')) {
    console.log('error. try node client.js help');
    process.exit(-1);
}
for (var proc in process.argv) {
    console.log(process.argv[proc]);
}
console.log(process.argv);
*/
const client = net.createConnection({
    host: urlObj.host,
    port: 80
});

client.on('data', function (data) {
    if (verbose) {
        console.log(data.toString());
    } else {
        var responseSplit = data.toString().split("\n");
        var inBody = false;
        for (var i in responseSplit) {
            if (responseSplit[i] == "{") {
                inBody = true;
            }
            if (inBody) {
                console.log(responseSplit[i]);
            }

            if (responseSplit[i] == "}") {
                inBody = false;
            }
        }
    }
});

client.on('connect', () => {
    //if (isGet) {
        client.write(clientWritingString);
        // client.write("GET " + argv.path + " HTTP/1.0 \n Host: " + argv.host + "\naaaaa: bbbbb\n\n");
   // } else {
  //      client.write("POST /post HTTP/1.0\nHost: httpbin.org\ncontent-type: application/json\naaaaa: bbbbb\ncontent-length: 23\n\n{\"mapName\":\"myMapName\"}\n");
  //  }
});

client.on('error', err => {
    console.log('socket error %j', err);
    process.exit(0);
});

function quitInvalidParamError() {
    console.log('httpc (get|post) [-v] (-h "k:v")* [-d inline-data] [-f file] URL');
    process.exit(0);
}