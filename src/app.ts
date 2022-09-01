import express from "express";
import "express-async-errors";

import { validationErrorMiddleware } from "./lib/middelware/validation";
import { initCorsrMiddleware } from "./lib/middelware/cors";

import planetsRoutes from "./routes/planets";

const app = express();

app.use(express.json());

app.use(initCorsrMiddleware())

app.use("/planets", planetsRoutes);

app.use(validationErrorMiddleware);

export default app;
