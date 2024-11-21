
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
     rejectUnauthorized: true,
    },
  },
  mailer: {
    transport: {
    host: process.env.MAIL_HOST || 'smtp.example.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.MAIL_USER || 'user@example.com',
      pass: process.env.MAIL_PASS || 'password',
    },
    },
    defaults: {
    from: '"CookBook" <no-reply@example.com>',
    }
  },
  });
  