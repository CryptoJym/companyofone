export interface Config {
  env: string;
  port: number;
  apiUrl: string;
  cors: {
    origin: string | string[] | boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: {
    url: string;
  };
  email: {
    from: string;
    replyTo: string;
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  
  cors: {
    origin: process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
      ['http://localhost:3000', 'https://companyofone.ai'],
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  email: {
    from: process.env.EMAIL_FROM || 'noreply@companyofone.ai',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@companyofone.ai',
  },
};