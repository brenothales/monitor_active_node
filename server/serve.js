const os = require('os-utils');
const exec = require("child_process").exec;
const DEFAULT_INTERVAL_CHECK = 1000
const DEFAULT_MAX_CPU_USAGE = 80
const RESTART_COMMAND = "pm2 restart all"
const DEFAULT_MINIMUM_MEMORY = 200

let maxCpuUsage = DEFAULT_MAX_CPU_USAGE
let intervalCheck = DEFAULT_INTERVAL_CHECK
let minimumMemory = DEFAULT_MINIMUM_MEMORY

setInterval(() => {
  os.cpuUsage(function(v){
      const cpuUsage = v * 100
      console.log("Cpu Usage: " + Math.round(cpuUsage) + "%")
      if(cpuUsage >= maxCpuUsage){
        exec(RESTART_COMMAND, function(err, stdout, stderr) {
          console.log("Reseting server. Cpu Leak");
        });
      }
  });
  const freeMemory = os.freemem()
  console.log("Free memory: ", freeMemory)
  if(minimumMemory > freeMemory){
    exec(RESTART_COMMAND, function(err, stdout, stderr) {
      console.log("Reseting server. Memory leak");
    });
  }
}, intervalCheck)