module.exports = {
  apps: [
    {
      name: 'electric-server',
      script: '.output/server/index.mjs',
      exec_mode: 'cluster',
      instances: '2',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    }
  ]
}