import { join } from 'path';

export default () => {
  return {
    packageJson: require(join(process.cwd(), 'package.json')),
    port: parseInt(process.env.ENV_PORT, 10) || 8001,
    // app
    appUrlBase: process.env.ENV_BASE_URL,
    appFrontUrlBase: process.env.ENV_FRONT_APP_URL,
    appMaxSize: process.env.ENV_FILE_MAX_SIZE || '100mb',
    debugServer: process.env.ENV_DEBUG_SERVER || 'false',
    showSwagger: process.env.ENV_SWAGGER_SHOW || 'false',
    endEntorno: process.env.ENV_ENTORNO || 'dev',

    defaultRolRegister: process.env.ENV_DEFAUL_ROL_REGISTER || 'CLIENTE',

    // ## MS MYSQL
    msMysql: process.env.ENV_MYSQL_DATABASE_URL,
    cors: process.env.ENV_CORS?.split(',') || ['*'],

    // ## NOTIFICATIONS
    webhookUrl: process.env.ENV_WEBHOOK_URL,
  };
};
