const { createProxyMiddleware } = require('http-proxy-middleware')
const qs = require('qs');
const config = require('./config')

const { allowedDomains: globalAllowedDomains = [], proxies } = config

module.exports = proxies.map(
  ({
    route,
    target,
    allowedDomains = [],
    allowedMethods = ['GET'],
    queryparams = {},
    headers = {},
    auth,
  }) => {
    const filter = (pathname, req) =>
      pathname.startsWith(route) &&
      allowedMethods.includes(req.method) &&
      [...globalAllowedDomains, ...allowedDomains].includes(req.headers.origin)
    const options = {
      target,
      changeOrigin: true,
      headers,
      auth,
      pathRewrite(path, req) {
        const qp = qs.stringify({
          ...req.query,
          ...queryparams,
        })
        const newPath = `${path.split('?')[0].replace(route, '')}?${qp}`
        return newPath
      },
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }

    return createProxyMiddleware(filter, options)
  },
)
