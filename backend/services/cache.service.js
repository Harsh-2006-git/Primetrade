const NodeCache = require("node-cache");

// stdTTL: standard time to live in seconds (5 minutes)
// checkperiod: period in seconds for automatic delete check
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const cacheService = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
};

module.exports = cacheService;
