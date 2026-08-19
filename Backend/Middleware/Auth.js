import jwt from "jsonwebtoken";

const authmid = (req, res, next) => {
  try {
    const token = req.headers.token;

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    console.log("Decoded:", decoded);

    req.userId = decoded.id;

    console.log("User ID:", req.userId);

    next();
  } catch (error) {
    console.log(error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authmid;