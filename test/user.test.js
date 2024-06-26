import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import User from "../models/User.js";

describe("UTC_012", async () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_012TestName" });
  });

  // Register user to update
  it("should register a new user to update", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_012TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should find user by ID and update", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_012TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        const res = [];
        res.push(response.body);
        res.push(response.headers["set-cookie"][0]);
        return res;
      });

    // Get token and user ID to make the update call
    const userToken = user[1].replace("; Path=/; HttpOnly", "");
    const userId = user[0].details._id;

    // Update the user
    const response = await supertest(app)
      .put(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .set("Cookie", userToken)
      .send({
        username: "UpdatedUsername",
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    expect(response.statusCode).to.be.equal(200);
  });
});

describe("UTC_013", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_012TestName" });
  });
});
