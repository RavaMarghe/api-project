import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

test("GET /planets", async () => {
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

test("POST /planets", async () => {
    const planet = {
        name: "Mercury",
        diameter: 1234,
        moons: 12,
    };

    const response = await request
        .post("/planets")
        .send(planet)
        .expect(201)
        .expect("Content-type", /application\/json/);
    expect(response.body).toEqual(planet);
});
