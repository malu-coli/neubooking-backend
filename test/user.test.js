import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import User from "../models/User.js";

describe("UTC_001", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UpdatedUsername" });
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

describe("UTC_002", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_013TestName" });
  });

  // Register user to update
  it("should register a new user to update", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_013TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should not be able to update due to not having validation token", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_013TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response.body;
      });

    // Get user ID to make the update call
    const userId = user.details._id;

    // Update the user
    const response = await supertest(app)
      .put(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .send({
        username: "UpdatedUsername",
      })
      .then((response) => {
        const res = [];
        res.push(response);
        res.push(response.body);
        return res;
      })
      .catch((err) => {
        return err;
      });

    expect(response[0].statusCode).to.be.equal(401);
    expect(response[1].message).to.be.equal("You are not authenticated");
  });
});

describe("UTC_003", () => {
  // Register user to delete
  it("should register a new user to delete", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_014TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should delete the logged in user", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_014TestName",
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

    // delete the user
    const response = await supertest(app)
      .delete(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .set("Cookie", userToken)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    expect(response.statusCode).to.be.equal(204);
  });
});

describe("UTC_004", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_015TestName" });
  });

  // Register user to delete
  it("should register a new user to delete", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_015TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  // Fail to delete user due to not having validation token
  it("should fail to delete due to not having validation token", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_015TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response.body;
      });

    // Get user ID to make the update call
    const userId = user.details._id;

    // delete the user
    const response = await supertest(app)
      .delete(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    expect(response.statusCode).to.be.equal(401);
  });
});

describe("UTC_005", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_016TestName" });
  });

  // Register user to get info
  it("should register a new user to get infos", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_016TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should get users info", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_016TestName",
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

    // get the user
    const response = await supertest(app)
      .get(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .set("Cookie", userToken)
      .then((response) => {
        const res = [];
        res.push(response);
        res.push(response.body);
        return res;
      })
      .catch((err) => {
        return err;
      });

    expect(response[0].statusCode).to.be.equal(200);
    expect(response[1].username).to.be.equal("UTC_016TestName");
  });
});

describe("UTC_006", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_017TestName" });
  });

  // Register user to get info
  it("should register a new user to get infos", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_017TestName",
        email: "test@email.com",
        password: "TestPass123",
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  it("should not return users info due to user non existence", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_017TestName",
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

    // get the user
    const response = await supertest(app)
      .get(`/api/users/wrongIDLOL`)
      .set("Content-Type", "application/json")
      .set("Cookie", userToken)
      .then((response) => {
        const res = [];
        res.push(response);
        res.push(response.body);
        return res;
      })
      .catch((err) => {
        return err;
      });

    console.log(response);
    expect(response[0].statusCode).to.be.equal(404);
  });
});

describe("UTC_007", () => {
  // Delete user after validation
  after(async () => {
    await User.deleteOne({ username: "UTC_018TestName" });
  });

  // Register user to get all users info
  it("should register a new user to get infos", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_018TestName",
        email: "test@email.com",
        password: "TestPass123",
        admin: true,
      })
      .then((response) => {
        return response;
      });

    expect(response.statusCode).to.be.equal(200);
  });

  // Get all users info
  it("should get all users info", async () => {
    // Get user to query it's ID in route
    const user = await supertest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        username: "UTC_018TestName",
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

    // get the user
    const response = await supertest(app)
      .get(`/api/users/`)
      .set("Content-Type", "application/json")
      .set("Cookie", userToken)
      .then((response) => {
        const res = [];
        res.push(response);
        res.push(response.body);
        return res;
      })
      .catch((err) => {
        return err;
      });

    expect(response[0].statusCode).to.be.equal(200);
  });
});

describe("UTC_008", () => {
  // Not get all users info
  it("should not get all users info due to invalid token (non admin)", async () => {
    // get all users
    const response = await supertest(app)
      .get(`/api/users/`)
      .set("Content-Type", "application/json")
      .set("Cookie", "access_token=019743298127439842")
      .then((response) => {
        const res = [];
        res.push(response);
        res.push(response.body);
        return res;
      })
      .catch((err) => {
        return err;
      });

    expect(response[0].statusCode).to.be.equal(403);
  });
});
