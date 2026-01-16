import { join } from 'path';

export default () => {
  return {
    packageJson: require(join(process.cwd(), 'package.json')),
    port: parseInt(process.env.ENV_PORT, 10) || 3000,
    // app
    appUrlBase: process.env.ENV_BASE_URL,
    appFrontUrlBase: process.env.ENV_FRONT_APP_URL,
    appMaxSize: process.env.ENV_FILE_MAX_SIZE || '100mb',
    debugServer: process.env.ENV_DEBUG_SERVER || 'false',
    showSwagger: process.env.ENV_SWAGGER_SHOW || 'false',
    twoFactorEnabled: process.env.ENV_2FA_ENABLED === 'true',
    endEntorno: process.env.ENV_ENTORNO || 'dev',

    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
    googleRedirectUri: process.env.GOOGLE_CALLBACK_URL || null,

    emailUser: process.env.EMAIL_USER || 'no-reply@tunotaria.com',
    emailPass: process.env.EMAIL_PASS || 'password',
    emailService: process.env.EMAIL_SERVICE || 'gmail',

    jwtSecret: process.env.JWT_SECRET || 'jwt-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

    // ## MS MYSQL
    msMysql: process.env.DATABASE_URL,
    cors: process.env.ENV_CORS?.split(',') || ['*'],

    // ## NOTIFICATIONS
    webhookUrl: process.env.ENV_WEBHOOK_URL,
  };
};
