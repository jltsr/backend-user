const config = {
    env: process.env.NODE_ENV || 'development',
    port: 3003,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    db_name : "db_unico",
    db_username : "postgres",
    db_password: "admin",
    db_host: "localhost",
    URL_DOMAIN : '/user',
    URL_API : '/api'
  }
  
export default config