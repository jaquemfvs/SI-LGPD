module.exports = (req, res, next) => {
  const allowedEmail = "admin@example.com"; // Replace with the authorized user's email

  if (!req.user || req.user.email !== allowedEmail) {
    return res.status(403).json({ message: "Access denied. Only authorized users can perform this action." });
  }

  next();
};
