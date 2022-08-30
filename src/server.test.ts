import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

test("GET /planets", async () => {
    const planets = [];

    // @ts-ignore
    prismaMock.planet.findMany.mockResolvedValue(planets);

    const response = await request
        .get("/planets")
        .expect(200)
        .expect("Content-type", /application\/json/);
    expect(response.body).toEqual(planets);
});
