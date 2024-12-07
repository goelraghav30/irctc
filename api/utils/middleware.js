// Middleware for JWT authentication
export const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };
  
  // Middleware for Admin API key validation
  export const authenticateAdmin = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ message: 'Invalid API Key' });
    }
    next();
  };
  