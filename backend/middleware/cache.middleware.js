const cacheService = require("../services/cache.service");
const ApiResponse = require("../utils/ApiResponse");

const cacheMiddleware = (duration) => (req, res, next) => {
  // Use the request URL as the cache key
  const key = req.originalUrl || req.url;
  const cachedResponse = cacheService.get(key);

  if (cachedResponse) {
    return res
      .status(200)
      .json(new ApiResponse(200, cachedResponse, "Result fetched from cache"));
  }

  // If not in cache, intercept the res.json method to store the data
  const originalJson = res.json;
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300 && body.success) {
      cacheService.set(key, body.data, duration);
    }
    return originalJson.call(res, body);
  };

  next();
};

module.exports = cacheMiddleware;
