import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

describe("GET /planets", () => {
    test("Valid request", async () => {
        const planets = [
            {
                id: 4,
                name: "Mercury",
                description: "",
                diameter: 1234,
                moons: 12,
                createdAt: "2022-08-30T10:39:20.124Z",
                updatedAt: "2022-08-30T10:39:47.286Z",
            },
            {
                id: 5,
                name: "Venus",
                description: "",
                diameter: 5678,
                moons: 0,
                createdAt: "2022-08-30T10:39:41.521Z",
                updatedAt: "2022-08-30T10:39:28.601Z",
            },
        ];

        // @ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets);

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual(planets);
    });
});

describe("POST /planets", () => {
    test("Valid request", async () => {
        const planet = {
            id: 6,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 12,
            createdAt: "2022-08-31T12:38:13.477Z",
            updatedAt: "2022-08-31T12:38:13.480Z",
        };

        // @ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet);

        const response = await request
            .post("/planets")
            .send({
                name: "Mercury",
                diameter: 1234,
                moons: 12,
            })
            .expect(201)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});
