const xss = require('xss');

/**
 * Custom security middleware that handles:
 * - XSS protection
 * - NoSQL injection prevention
 * - Data sanitization
 */
const securityMiddleware = (req, res, next) => {
  try {
    // Function to sanitize string values
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      // XSS sanitization
      return xss(str.replace(/\$|\.|\{|\}/g, '_'));
    };

    // Function to deeply sanitize an object
    const sanitizeDeep = (obj) => {
      if (!obj) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeDeep(item));
      }
      
      if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          // Skip keys that start with $ to prevent NoSQL injection
          if (!key.startsWith('$')) {
            sanitized[key] = sanitizeDeep(value);
          }
        }
        return sanitized;
      }
      
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      
      return obj;
    };

    // Create sanitized copies of request data
    if (req.body) {
      req.body = sanitizeDeep(req.body);
    }

    if (req.query) {
      // Create a new sanitized query object
      const sanitizedQuery = {};
      for (const [key, value] of Object.entries(req.query)) {
        if (!key.startsWith('$')) {
          sanitizedQuery[key] = sanitizeDeep(value);
        }
      }
      // safely assign sanitized values back
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, sanitizedQuery);
    }

    if (req.params) {
      // Create a new sanitized params object
      const sanitizedParams = {};
      for (const [key, value] of Object.entries(req.params)) {
        if (!key.startsWith('$')) {
          sanitizedParams[key] = sanitizeDeep(value);
        }
      }
      // safely assign sanitized values back
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, sanitizedParams);
    }

    // Add security headers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    next();
  } catch (error) {
    console.error('Security middleware error:', error);
    next(error);
  }
};

module.exports = securityMiddleware;
