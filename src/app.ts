import express from "express";
import "express-async-errors";

import { validationErrorMiddleware } from "./lib/middelware/validation";
import { initCorsrMiddleware } from "./lib/middelware/cors";
import { initSessionMiddleware } from "./lib/middelware/session";
import { passport } from "./lib/middelware/passport";

import planetsRoutes from "./routes/planets";
import authRoutes from "./routes/auth"

const app = express();

app.use(initSessionMiddleware())
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());

app.use(initCorsrMiddleware())

app.use("/planets", planetsRoutes);
app.use("/auth", authRoutes)

app.use(validationErrorMiddleware);

export default app;
