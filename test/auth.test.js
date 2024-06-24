import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import User from "../models/User.js";

describe("ATC_001", () => {
  after(async () => {
    await User.deleteOne({ username: "TestName" });
  });
  
  it("should register user to login to", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should login into created user", async () => {
    const response = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "TestName",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });
});

describe("ATC_002", () => {
  after(async () => {
    await User.deleteOne({ username: "TestName" });
  });

  it("should register user to login to", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should return error code 400 for wrong password", async () => {
    const response = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "TestName",
        password: "WrongPass123",
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    expect(response.statusCode).to.be.equal(400);
  });
});
