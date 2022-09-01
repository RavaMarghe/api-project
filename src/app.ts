import express from "express";
import "express-async-errors";
import cors from "cors";
import prisma from "./lib/prisma/client";
import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetData,
} from "./lib/validation";
import { initMulterMiddleware } from "./lib/middelware/multer";
const upload = initMulterMiddleware();

const corsOptions = {
    origin: "http://localhost:8080",
};

const app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany();

    response.json(planets);
});

app.get("/planets/:id(\\d+)", async (request, response, next) => {
    const planetID = Number(request.params.id);

    const planet = await prisma.planet.findUnique({
        where: { id: planetID },
    });

    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planets/${planetID}`);
    }

    response.json(planet);
});

app.post(
    "/planets",
    validate({ body: planetSchema }),
    async (request, response) => {
        const planetData: PlanetData = request.body;

        const planet = await prisma.planet.create({
            data: planetData,
        });

        response.status(201).json(planet);
    }
);

app.put(
    "/planets/:id(\\d+)",
    validate({ body: planetSchema }),
    async (request, response, next) => {
        const planetId = Number(request.params.id);
        const planetData: PlanetData = request.body;

        try {
            const planet = await prisma.planet.update({
                where: { id: planetId },
                data: planetData,
            });

            response.status(200).json(planet);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /planets/${planetId}`);
        }
    }
);

app.delete("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);

    try {
        await prisma.planet.delete({
            where: { id: planetId },
        });

        response.status(204).end();
    } catch (error) {
        response.status(404);
        next(`Cannot DELETE /planets/${planetId}`);
    }
});

app.post(
    "/planets/:id(\\d+)/photo",
    upload.single("photo"), //"photo" corrisponde al nome dell'input nel file web\upload.html
    async (request, response, next) => {
        if (!request.file) {
            response.status(400);
            return next("No photo file uploaded.");
        }

        const planetId = Number(request.params.id);
        const photoFilename = request.file.filename;

        try {
            await prisma.planet.update({
                where: { id: planetId },
                data: { photoFilename },
            });
            response.status(201).json({ photoFilename });
        } catch (error) {
            response.status(404);
            next(`Cannot POST /planets/${planetId}/photo`);
        }
    }
);

app.use("/planets/photos", express.static("uploads"));

app.use(validationErrorMiddleware);

export default app;

/*
// Get /planets - Retrive all planets
app.get("/planets", (request, response) => {});

// Get /planets/:id - Retrive a single planet
app.get("/planets/:id", (request, response) => {});

// POST /planets - Create a new planet
app.post("/planets", (request, response) => {});

// PUT /planets/:id - Replace an existing planet
app.put("/planets/:id", (request, response) => {});

// DELETE /planets/:id - Remove a planet
app.delete("/planets/:id", (request, response) => {});

// POST /planets/:id/photo - Add a photo for a planet
app.post("/planets/:id/photo", (request, response) => {});
*/
