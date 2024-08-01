"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load config
const auth_middleware_1 = require("./middleware/auth.middleware");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "*",
    },
});
// Connect to MongoDB
(0, db_1.default)();
// MIDDLEWARE
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
// allow CORS for local development (for production, you should configure it properly)
app.use((0, cors_1.default)());
// ROUTES
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const businesses_route_1 = __importDefault(require("./routes/businesses.route"));
const reviews_route_1 = __importDefault(require("./routes/reviews.route"));
app.use("/api/users", auth_middleware_1.verifyToken, users_route_1.default);
app.use("/api/businesses", businesses_route_1.default);
app.use("/api/reviews", reviews_route_1.default);
app.use("/api/auth", auth_route_1.default);
exports.default = app;
