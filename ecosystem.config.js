module.exports = {
  apps: [
    {
      name: 'st-student-admin',
      script: 'npm',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
