import request from "supertest"
import { app } from "../src"
import { prismaMock } from "./jest.setup"

describe("Deck API", () => {
    describe("GET /decks", () => {
        it("should fetch all decks", async () => {
            const mockDecks = [
                {
                    id: 1,
                    name: "Electric Deck",
                    ownerId: 1,
                },
                { id: 2, name: "Fire Deck", ownerId: 1 },
            ]

            prismaMock.deck.findMany.mockResolvedValue(mockDecks)

            const response = await request(app).get("/decks")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDecks)
        })

        it("should return 500 if fetching fails", async () => {
            prismaMock.deck.findMany.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app).get("/decks")
            expect(response.status).toBe(500)
            expect(response.body).toEqual({ error: "Failed to fetch decks" })
        })
    })

    describe("GET /decks/:deckId", () => {
        it("should fetch a deck by ID", async () => {
            const mockDeck = {
                id: 1,
                name: "Electric Deck",
                ownerId: 1,
            }

            prismaMock.deck.findUnique.mockResolvedValue(mockDeck)

            const response = await request(app).get("/decks/1")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDeck)
        })

        it("should return 404 if deck is not found", async () => {
            prismaMock.deck.findUnique.mockResolvedValue(null)

            const response = await request(app).get("/decks/999")
            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: "Deck not found" })
        })

        it("should return 500 if fetching fails", async () => {
            prismaMock.deck.findUnique.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app).get("/decks/1")
            expect(response.status).toBe(500)
            expect(response.body).toEqual({ error: "Failed to fetch deck" })
        })
    })

    describe("POST /decks", () => {
        it("should create a new deck", async () => {
            const newDeck = {
                name: "Water Deck",
                ownerId: 1,
                cards: [1, 2],
            }
            const createdDeck = { id: 1, ...newDeck }

            prismaMock.deck.create.mockResolvedValue(createdDeck)

            const response = await request(app)
                .post("/decks")
                .set("Authorization", "Bearer mockedToken")
                .send(newDeck)

            expect(response.status).toBe(201)
            expect(response.body).toEqual(createdDeck)
        })

        it("should return 500 if creation fails", async () => {
            prismaMock.deck.create.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .post("/decks")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Water Deck" })

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to create the deck",
            })
        })
    })

    describe("PATCH /decks/:deckId", () => {
        it("should update an existing deck", async () => {
            const updatedData = {
                name: "Updated Deck",
                ownerId: 1,
                cards: [1, 3],
            }
            const updatedDeck = { id: 1, ...updatedData }

            prismaMock.deck.findUnique.mockResolvedValue(updatedDeck)
            prismaMock.deck.update.mockResolvedValue(updatedDeck)

            const response = await request(app)
                .patch("/decks/1")
                .set("Authorization", "Bearer mockedToken")
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.body).toEqual(updatedDeck)
        })

        it("should return 404 if deck is not found", async () => {
            prismaMock.deck.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .patch("/decks/999")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Updated Deck" })

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: "Deck not found" })
        })

        it("should return 500 if update fails", async () => {
            prismaMock.deck.findUnique.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .patch("/decks/1")
                .set("Authorization", "Bearer mockedToken")
                .send({ name: "Updated Deck" })

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to update the deck",
            })
        })
    })

    describe("DELETE /decks/:deckId", () => {
        it("should delete a deck", async () => {
            prismaMock.deck.delete.mockResolvedValue({
                id: 1,
                name: "Electric Deck",
                ownerId: 1,
            })

            const response = await request(app)
                .delete("/decks/1")
                .set("Authorization", "Bearer mockedToken")

            expect(response.status).toBe(204)
        })

        it("should return 500 if deletion fails", async () => {
            prismaMock.deck.delete.mockRejectedValue(
                new Error("Database error"),
            )

            const response = await request(app)
                .delete("/decks/1")
                .set("Authorization", "Bearer mockedToken")

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                error: "Failed to delete the deck",
            })
        })
    })
})
