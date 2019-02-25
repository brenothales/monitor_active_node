var io = require('socket.io')(9500);
var osm = require("os-monitor");

var util = require('os-utils');
var usage = require('cpu-percentage');
var fs = require('fs');
let maxCpuUsage;

function cpu() {
    return  util.cpuUsage(function(v){
    let cpuUsage = v * 100;
     cpuUsage;
    });
};

    function memoryFree(){
        let memory;
        memory = Math.round((util.freememPercentage() * 100));
        return ((100 - memory) + '%');
    }

var realtime = setInterval(() => {memoryFree(), 100});


console.log(realtime);

// var start = usage();
// fs.readFile(__filename, 'utf8', function(err, data) {
//   console.log(usage(start.percent));
// });

// var job = new cron.CronJob('* * * * *', function () {
//     os.cpuUsage(function (cpuUsage) {
//         cpuUsage = cpuUsage * 100;
//     });
// },null,true);

// Pegar Process
// const find = require('find-process');
// find('name', 'Google', true)
//   .then(function (list) {
//      console.log('there are %s % Google Chrome process(es)', list.length);
//    });


io.on('connect', function (socket) {
    
    socket.emit('connected', {
        status: 'connected',
        type: osm.os.type(), 
        cpus: osm.os.cpus(),
        hostname: osm.os.hostname(),
        // cpu: realtime,
        
    });
        
});

// #teste 
io.on('connection', function(socket){
   console.log(memoryFree());
});
 // Fim #teste 



io.on('disconnect', function (socket) {
    socket.emit('disconnected');
});
 
 
osm.start({
    delay: 3000 // interval in ms between monitor cycles
    , stream: false // set true to enable the monitor as a Readable Stream
    , immediate: false // set true to execute a monitor cycle at start()
}).pipe(process.stdout);
 
 
// define handler that will always fire every cycle
osm.on('monitor', function (monitorEvent) {
    io.emit('os-update', monitorEvent);
});



