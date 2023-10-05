import { insertUser } from "../factories/users-factory";
import { insertRental } from "../factories/rentals-factory";
import { insertMovie } from "../factories/movies.factory";
import supertest from "supertest";
import app from "../../src/app";
import httpStatus from "http-status";
import prisma from "../../src/database/index";

beforeEach(async () => {
  await prisma.movie.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.user.deleteMany({});
});

const api = supertest(app);

describe("Rentals Integration Tests", () => {
  describe("GET /rentals", () => {
    it("should return rentals when they exist", async () => {
      const user = await insertUser();
      const rental = await insertRental(user.id);
      await insertMovie(rental.id);

      const { body, status } = await api.get("/rentals");
      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            date: expect.any(String),
            endDate: expect.any(String),
            userId: expect.any(Number),
            closed: expect.any(Boolean)
          })
        ]))
    });
  });

  describe("GET /rentals:/id", () => {
    it("should return a rental and status 200 when rental exists", async () => {
      const user = await insertUser();
      const rental = await insertRental(user.id);
      await insertMovie(rental.id);

      const { body, status } = await api.get(`/rentals/${rental.id}`);
      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        ...rental,
        date: rental.date.toISOString(),
        endDate: rental.endDate.toISOString()
      });
    });

    it("should return 404 when searched rental does not exist", async () => {
      const user = await insertUser();
      const rental = await insertRental(user.id);
      await insertMovie(rental.id);

      const { status } = await api.get(`/rentals/999`);
      expect(status).toBe(httpStatus.NOT_FOUND);
    });
  });

  describe("POST /rentals", () => {
    it("should return 201 if a valid rental can be generated", async () => {
      const user = await insertUser();
      const movie1 = await insertMovie();
      const movie2 = await insertMovie();

      const { status } = await api.post("/rentals").send({
        userId: user.id,
        moviesId: [movie1.id, movie2.id]
      });

      expect(status).toBe(httpStatus.CREATED);
    });

    it("should return 422 if input data is incomplete or is invalid", async () => {
      const user = await insertUser();
      const movie1 = await insertMovie();
      const movie2 = await insertMovie();

      const { status } = await api.post("/rentals").send({});

      expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe("POST /rentals/finish", () => {
    it("should return 201 if input data for finishing rental is valid", async () => {
      const user = await insertUser();
      const rental = await insertRental(user.id);
      await insertMovie(rental.id);

      const { status } = await api.post("/rentals/finish").send({
        rentalId: rental.id
      });

      expect(status).toBe(httpStatus.OK);
    });

    it("should return 422 if input data for finishing rental is incomplete or is invalid", async () => {
      const user = await insertUser();
      const rental = await insertRental(user.id);
      await insertMovie(rental.id);

      const { status } = await api.post("/rentals/finish").send({});

      expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});