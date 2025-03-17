import request from "supertest"
import { app } from "../src"
import { prismaMock } from "./jest.setup"

describe("Attack API", () => {
    describe("GET /attacks", () => {
        it("should fetch all attacks", async () => {
            const mockAttacks = [
                { id: 1, name: "Thunderbolt", typeId: 1, damages: 90 },
                { id: 2, name: "Flamethrower", typeId: 2, damages: 95 },
            ]

            prismaMock.attack.findMany.mockResolvedValue(mockAttacks)

            const response = await request(app).get("/attacks")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockAttacks)
        })

        it("should return 500 if fetching fails", async () => {
            prismaMock.attack.findMany.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app).get("/attacks")
            expect(response.status).toBe(500)
            expect(response.body).toEqual({ error: "Failed to fetch attacks" })
        })
    })

    describe("GET /attacks/:attackId", () => {
        it("should fetch an attack by ID", async () => {
            const mockAttack = {
                id: 1,
                name: "Thunderbolt",
                typeId: 1,
                damages: 90,
            }

            prismaMock.attack.findUnique.mockResolvedValue(mockAttack)

            const response = await request(app).get("/attacks/1")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockAttack)
        })

        it("should return 404 if attack is not found", async () => {
            prismaMock.attack.findUnique.mockResolvedValue(null)

            const response = await request(app).get("/attacks/999")
            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: "Attack not found" })
        })

        it("should return 500 if fetching fails", async () => {
            prismaMock.attack.findUnique.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app).get("/attacks/1")
            expect(response.status).toBe(500)
            expect(response.body).toEqual({ error: "Failed to fetch attack" })
        })
    })

    describe("POST /attacks", () => {
        it("should create a new attack", async () => {
            const newAttack = { name: "Hydro Pump", typeId: 1, damages: 110 }
            const createdAttack = { id: 1, ...newAttack }

            prismaMock.attack.create.mockResolvedValue(createdAttack)

            const response = await request(app)
                .post("/attacks")
                .set("Authorization", "Bearer mockedToken")
                .send(newAttack)

            expect(response.status).toBe(201)
            expect(response.body).toEqual(createdAttack)
        })

        it("should return 500 if creation fails", async () => {
            prismaMock.attack.create.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .post("/attacks")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Hydro Pump", type: "Water" })

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to create the attack",
            })
        })
    })

    describe("PATCH /attacks/:attackId", () => {
        it("should update an existing attack", async () => {
            const updatedData = { name: "Thunder", damages: 100 }
            const updatedAttack = { id: 1, ...updatedData, typeId: 1 }

            prismaMock.attack.findUnique.mockResolvedValue(updatedAttack)
            prismaMock.attack.update.mockResolvedValue(updatedAttack)

            const response = await request(app)
                .patch("/attacks/1")
                .set("Authorization", "Bearer mockedToken")
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.body).toEqual(updatedAttack)
        })

        it("should return 404 if attack is not found", async () => {
            prismaMock.attack.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .patch("/attacks/999")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Thunder" })

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: "Attack not found" })
        })

        it("should return 500 if update fails", async () => {
            prismaMock.attack.findUnique.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .patch("/attacks/1")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Thunder" })

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to update the attack",
            })
        })
    })

    describe("DELETE /attacks/:attackId", () => {
        it("should delete an attack", async () => {
            prismaMock.attack.delete.mockResolvedValue({
                id: 1,
                name: "Thunderbolt",
                typeId: 1,
                damages: 90,
            })

            const response = await request(app)
                .delete("/attacks/1")
                .set("Authorization", "Bearer mockedToken")

            expect(response.status).toBe(204)
        })

        it("should return 500 if deletion fails", async () => {
            prismaMock.attack.delete.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .delete("/attacks/1")
                .set("Authorization", "Bearer mockedToken")

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to delete the attack",
            })
        })
    })
})
