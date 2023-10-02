module.exports = {
  apps: [{
    name: 'prameyshala',
    exec_mode: 'cluster',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3001',
    watch: true,
    max_memory_restart: "300M",
  }]
}
