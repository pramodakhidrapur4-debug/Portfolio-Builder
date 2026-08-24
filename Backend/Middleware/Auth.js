import jwt from "jsonwebtoken";

const authmid = async (req, res, next) => {
  try {
    console.log("========== AUTH DEBUG ==========");
    console.log("Authorization header:", req.headers.authorization);
    console.log("Token header:", req.headers.token);

    const authHeader = req.headers.authorization;
    let token = req.headers.token; // Fallback for old routes

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("AUTH ERROR: Token missing");
      return res.status(401).json({
        success: false,
        message: "Please login first - Token missing"
      });
    }

    console.log("Authorization token exists: true");

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    console.log("Decoded token ID:", decoded.id);

    req.userId = decoded.id;
    req.user = decoded.id; // Support both

    console.log("Authenticated user ID:", req.userId);
    console.log("========== AUTH SUCCESS ==========");

    next();

  } catch (error) {
    console.error("========== AUTH ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authmid;