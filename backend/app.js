const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const routes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PrimeTask API",
      version: "1.0.0",
      description: "Role-Based Task Management System API Documentation",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}/api/v1` }],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API Routes
app.use("/api/v1", routes);

// Error Handling
app.use(errorMiddleware);

module.exports = app;
