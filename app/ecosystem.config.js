module.exports = {
  apps: [{
    name: 'prameyshala',
    exec_mode: 'cluster',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    watch: true,
  }]
}
