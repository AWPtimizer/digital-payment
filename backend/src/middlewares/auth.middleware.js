const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(403, "Invalid User: in authMiddleware")
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded._id) {
      throw new ApiError(403, "Authorization Failed: User id not found");
    }
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ message: "Error in auth middleware" });
  }
};

module.exports = {
  authMiddleware,
};
