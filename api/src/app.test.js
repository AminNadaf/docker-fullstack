import { jest, test, expect, afterEach } from "@jest/globals";
import request from "supertest";

const mockQuery = jest.fn();

jest.unstable_mockModule("pg", () => ({
  default: { Pool: jest.fn(() => ({ query: mockQuery })) },
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue({}) })),
  },
}));

const { app } = await import("./index.js");

afterEach(() => jest.clearAllMocks());

test("GET /health returns ok when db is up", async () => {
  mockQuery.mockResolvedValueOnce({});
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: "ok" });
});

test("GET /health returns 503 when db is down", async () => {
  mockQuery.mockRejectedValueOnce(new Error("db down"));
  const res = await request(app).get("/health");
  expect(res.status).toBe(503);
  expect(res.body).toEqual({ status: "db_error" });
});

test("GET /users returns rows", async () => {
  mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, name: "Amin", email: "a@b.com" }] });
  const res = await request(app).get("/users");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("POST /users creates user and returns 201", async () => {
  const user = { id: 1, name: "Amin", email: "a@b.com" };
  mockQuery.mockResolvedValueOnce({ rows: [user] });
  const res = await request(app).post("/users").send({ name: "Amin", email: "a@b.com" });
  expect(res.status).toBe(201);
  expect(res.body).toMatchObject(user);
});
