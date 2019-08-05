const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// require("dotenv").config({ path: ".env" });
require("dotenv").config();
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put userId onto the request for future requests to access
    req.userId = userId;
  }
  next();
});

// add middleware to attach the user on each request if logged in
server.express.use(async (req, res, next) => {
  // If not logged in, just skip
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    `{id, permissions, email, name}`
  );

  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
