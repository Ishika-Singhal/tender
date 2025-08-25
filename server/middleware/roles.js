const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Admin can access everything
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      return next();
    }

    res.status(403).json({ error: 'Insufficient permissions' });
  };
};

module.exports = requireRole;
