import { Server } from "socket.io";
import { Response, NextFunction } from "express";

// Extend the Express Request type to include the io property
export interface AuthenticatedRequest extends Request {
  userId?: string;
  io?: Server;
}
const socketMiddleware =
  (io: Server) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };

export default socketMiddleware;
