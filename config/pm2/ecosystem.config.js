module.exports = {
  apps : [{
    name   : "virtual-trading-platform",
    script : "./src/app.js",
    cwd    : "/home/administrator/virtual-trading-platform",
    instances : 1,
    exec_mode : "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3001
    },
    error_file : "./logs/err.log",
    out_file   : "./logs/out.log",
    log_file   : "./logs/combined.log",
    time       : true,
    min_uptime : "60s",
    max_restarts : 3,
    max_memory_restart : "500M"
  }, {
    name   : "contract-market",
    script : "./apps/contract-market/index.js",
    cwd    : "/home/administrator/virtual-trading-platform",
    instances : 1,
    exec_mode : "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3002
    },
    error_file : "./logs/contract-err.log",
    out_file   : "./logs/contract-out.log",
    log_file   : "./logs/contract-combined.log",
    time       : true,
    min_uptime : "60s",
    max_restarts : 3,
    max_memory_restart : "500M"
  }, {
    name   : "option-market",
    script : "./apps/option-market/index.js",
    cwd    : "/home/administrator/virtual-trading-platform",
    instances : 1,
    exec_mode : "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3003
    },
    error_file : "./logs/option-err.log",
    out_file   : "./logs/option-out.log",
    log_file   : "./logs/option-combined.log",
    time       : true,
    min_uptime : "60s",
    max_restarts : 3,
    max_memory_restart : "500M"
  }]
}