import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

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
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
        expect(response.body).toEqual(planets);
    });
});

describe("GET /planets/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 4,
            name: "Mercury",
            description: "",
            diameter: 1234,
            moons: 12,
            createdAt: "2022-08-30T10:39:20.124Z",
            updatedAt: "2022-08-30T10:39:47.286Z",
        };

        // @ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(planet);

        const response = await request
            .get("/planets/4")
            .expect(200)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual(planet);
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null);
        const response = await request
            .get("/planets/1")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/1");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .get("/planets/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/asdf");
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
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
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

describe("PUT /planets/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 6,
            name: "Mercury",
            description: "Lovely planet",
            diameter: 1234,
            moons: 12,
            createdAt: "2022-08-31T12:38:13.477Z",
            updatedAt: "2022-08-31T12:38:13.480Z",
        };

        // @ts-ignore
        prismaMock.planet.update.mockResolvedValue(planet);

        const response = await request
            .put("/planets/6")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(200)
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .put("/planets/1")
            .send(planet)
            .expect(422)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/planets/1")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/1");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .put("/planets/asdf")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/asdf");
    });
});

describe("DELETE /planets/:id", () => {
    test("Valid request", async () => {
        const response = await request
            .delete("/planets/4")
            .expect(204)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
        expect(response.text).toEqual("");
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.delete.mockRejectedValue(new Error("Error"));
        const response = await request
            .delete("/planets/1")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/1");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .delete("/planets/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/asdf");
    });
});

describe("POST /planets/:id/photo ", () => {
    test("Valid request with PNG file upload", async () => {
        await request
            .post("/planets/6/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });

    test("Valid request with JPG file upload", async () => {
        await request
            .post("/planets/6/photo")
            .attach("photo", "test-fixtures/photos/file.jpg")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });

    test("Invalid request with text file upload", async () => {
        const response = await request
            .post("/planets/6/photo")
            .attach("photo", "test-fixtures/photos/file.txt")
            .expect(500)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Error: The uploaded file must be a JPEG or a PNG image.");
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .post("/planets/1/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/1/photo");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .post("/planets/asdf/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/asdf/photo");
    });

    test("Invalid test with no file upload", async () => {
        const response = await request
            .post("/planets/6/photo")
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file uploaded.");
    });
});
