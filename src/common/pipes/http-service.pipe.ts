import { ArgumentsHost } from '@nestjs/common';

/**
 * Prints the request URL and method if the server is in debug mode.
 *
 * @param {ArgumentsHost} host - the arguments host object
 * @param {number} status - the status code of the request
 * @return {void} no return value
 */
export const printRequestUrl = (host: ArgumentsHost, status: number) => {
  const request = host.switchToHttp().getRequest();
  const method = request?.method;
  const url = request?.url;
  if (process.env.ENV_DEBUG_SERVER === 'true') {
    console.info(`Error: ${status}`, method, url);
  }
};

/**
 * Print Axios request information to the console.
 *
 * @param {ArgumentsHost} host - the arguments host object
 * @return {void}
 */
const printAxiosRequest = (host: ArgumentsHost) => {
  const request = host.switchToHttp().getRequest();

  // Acceder a las propiedades relevantes de la solicitud (request)
  const method = request?.method;
  const url = request?.url;
  const headers = request?.headers;
  const ip = request?.ip || (request?.connection && request?.connection?.remoteAddress);
  const query = request?.query;
  const body = request?.body;

  const requestInfo = { ip, url, method, headers, query, body };
  console.info(requestInfo);
};
