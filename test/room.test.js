import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import Room from "../models/Room.js";

// Helper function to create a dummy admin and hotel
async function createAdminAndHotel() {
    await supertest(app)
    .post("/api/auth/register")
    .send({
      username: "adminUser",
      email: "admin@example.com",
      password: "adminPass123",
      isAdmin: true,
    });

  const adminLoginResponse = await supertest(app)
    .post("/api/auth/login")
    .send({
      username: "adminUser",
      password: "adminPass123"
    });

  const adminToken = adminLoginResponse.headers["set-cookie"][0].replace("; Path=/; HttpOnly", "");

  const hotelResponse = await supertest(app)
    .post("/api/hotels")
    .set("Cookie", adminToken)
    .send({
      name: "Test Hotel",
      type: "hotel",
      city: "Test City",
      address: "Test Address",
      distance: "5km",
      title: "Test Title",
      desc: "Test Description",
      cheapestPrice: 100,
    });

  return {
    adminToken,
    hotelId: hotelResponse.body._id,
  };
}

// Helper function to create a dummy user (non-admin)
async function createUser() {
  await supertest(app)
    .post("/api/auth/register")
    .send({
      username: "regularUser",
      email: "user@example.com",
      password: "userPass123",
      admin: false
    });

  const userLoginResponse = await supertest(app)
    .post("/api/auth/login")
    .send({
      username: "regularUser",
      password: "userPass123",
    });
  const userToken = userLoginResponse.headers["set-cookie"][0].replace("; Path=/; HttpOnly", "");
  return userToken;
}

// RTC_001: Criação de quarto com todos os campos válidos
describe("RTC_001", () => {
  it("should create a room with valid fields", async () => {
    const { adminToken, hotelId } = await createAdminAndHotel();

    const response = await supertest(app)
      .post(`/api/rooms/${hotelId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Test Room",
        price: 200,
        maxPeople: 2,
        desc: "A test room description",
        roomNumbers: [{ number: 101 }],
      });

    expect(response.statusCode).to.be.equal(200);
    await Room.deleteOne({ _id: response.body._id });
  });
});

// RTC_002: Atualização de quarto com todos os campos válidos
describe("RTC_002", () => {
  it("should update a room with valid fields", async () => {
    const { adminToken, hotelId } = await createAdminAndHotel();

    const roomResponse = await supertest(app)
      .post(`/api/rooms/${hotelId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Test Room",
        price: 200,
        maxPeople: 2,
        desc: "A test room description",
        roomNumbers: [{ number: 101 }],
      });

    const roomId = roomResponse.body._id;

    const response = await supertest(app)
      .put(`/api/rooms/${roomId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Updated Room",
        price: 250,
        maxPeople: 3,
        desc: "An updated room description",
      });

    expect(response.statusCode).to.be.equal(200);
    await Room.deleteOne({ _id: roomId });
  });
});

// RTC_003: Atualização de disponibilidade de quarto
describe("RTC_003", () => {
  it("should update room availability", async () => {
    const { adminToken, hotelId } = await createAdminAndHotel();

    const roomResponse = await supertest(app)
      .post(`/api/rooms/${hotelId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Test Room",
        price: 200,
        maxPeople: 2,
        desc: "A test room description",
        roomNumbers: [{ number: 101 }],
      });

    const roomNumberId = roomResponse.body.roomNumbers[0]._id;

    const response = await supertest(app)
      .put(`/api/rooms/availability/${roomNumberId}`)
      .set("Cookie", adminToken)
      .send({
        dates: ["2024-07-01", "2024-07-02"],
      });

    expect(response.statusCode).to.be.equal(200);
    await Room.deleteOne({ _id: roomResponse.body._id });
  });
});

// RTC_004: Exclusão de quarto
describe("RTC_004", () => {
  it("should delete a room", async () => {
    const { adminToken, hotelId } = await createAdminAndHotel();

    const roomResponse = await supertest(app)
      .post(`/api/rooms/${hotelId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Test Room",
        price: 200,
        maxPeople: 2,
        desc: "A test room description",
        roomNumbers: [{ number: 101 }],
      });

    const roomId = roomResponse.body._id;

    const response = await supertest(app)
      .delete(`/api/rooms/${roomId}/${hotelId}`)
      .set("Cookie", adminToken);

    expect(response.statusCode).to.be.equal(200);
  });
});

// RTC_005: Obtenção de detalhes de um quarto específico
describe("RTC_005", () => {
  it("should get details of a specific room", async () => {
    const { adminToken, hotelId } = await createAdminAndHotel();

    const roomResponse = await supertest(app)
      .post(`/api/rooms/${hotelId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Test Room",
        price: 200,
        maxPeople: 2,
        desc: "A test room description",
        roomNumbers: [{ number: 101 }],
      });

    const roomId = roomResponse.body._id;

    const response = await supertest(app)
      .get(`/api/rooms/${roomId}`);

    expect(response.statusCode).to.be.equal(200);
    await Room.deleteOne({ _id: roomId });
  });
});

// RTC_006: Obtenção de detalhes de um quarto inexistente
describe("RTC_006", () => {
  it("should return 404 for a non-existent room", async () => {
    const response = await supertest(app)
      .get(`/api/rooms/nonexistentroomid`);

    expect(response.statusCode).to.be.equal(404);
  });
});

// RTC_007: Obtenção de todos os quartos
describe("RTC_007", () => {
  it("should get all rooms", async () => {
    const response = await supertest(app)
      .get(`/api/rooms`);

    expect(response.statusCode).to.be.equal(200);
  });
});

describe("RTC_008", function() {
  it("should not allow room creation with invalid fields", async function() {
    const { adminToken } = await createAdminAndHotel();

    const response = await supertest(app)
      .post("/api/rooms/invalidHotelId") 
      .set("Cookie", `access_token=${adminToken}`)
      .send({
        title: "", 
        price: -100,
        maxPeople: "two", 
        desc: "", 
        roomNumbers: [{ number: "one" }], 
      });

    expect(response.statusCode).to.be.equal(500); 
    expect(response.body.message).to.include("validation failed");
  });
});
