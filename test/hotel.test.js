import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

before(async () => {
  await Room.deleteMany({});
  await User.deleteMany({});
});

describe("HTC_001", () => {
  // After Hook: Limpar o ambiente após cada teste
  after(async () => {
    await Hotel.deleteOne({ name: "Hotel Test" }); // Remove o hotel de teste se existir
    await User.deleteMany({}); // Remove o admin user se existir
  });

  it("should create a hotel with all valid fields and return status 201", async () => {
    const hotelData = {
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    };

    const response = await supertest(app)
      .post("/api/hotels")
      .set("Content-Type", "application/json")
      .send(hotelData);

    // Verificações
    expect(response.statusCode).to.equal(201); // Espera o status 201 (Created)

    // Verifique se o hotel foi realmente criado no banco de dados
    const hotel = await Hotel.findOne({ name: "Hotel Test" });
    expect(hotel).to.exist;
    expect(hotel.name).to.equal("Hotel Test");
    // Adicione mais verificações conforme necessário para os campos do hotel
  });
});

describe("HTC_002", () => {
  // Limpa o ambiente após cada teste, deletando o hotel criado se existir
  afterEach(async () => {
    await Hotel.deleteOne({ name: "Hotel Test" });
  });

  // Teste: deve criar um hotel com todos os campos válidos
  it("should create a hotel with all valid fields", async () => {
    const hotelData = {
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    };

    const response = await supertest(app)
      .post("/api/hotels")
      .set("Content-Type", "application/json")
      .send(hotelData);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body.name).to.equal("Hotel Test");
    // Adicione mais verificações conforme necessário para os campos do hotel
  });

  // Teste: deve atualizar um hotel com todos os campos válidos
  it("should update a hotel with all valid fields", async () => {
    // Primeiro, cria um hotel para ser atualizado
    const newHotel = await Hotel.create({
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    });

    const updatedHotelData = {
      name: "Updated Hotel Test",
      rating: 5,
    };

    const response = await supertest(app)
      .put(`/api/hotels/${newHotel._id}`)
      .set("Content-Type", "application/json")
      .send(updatedHotelData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("_id");
    expect(response.body.name).to.equal("Updated Hotel Test");
    expect(response.body.rating).to.equal(5);
    // Adicione mais verificações conforme necessário para os campos atualizados do hotel
  });
});

describe("HTC_003", () => {
  // Limpa o ambiente após cada teste, deletando o hotel criado se existir
  afterEach(async () => {
    await Hotel.deleteOne({ name: "Hotel Test" });
  });

  // Teste: deve retornar 404 ao tentar atualizar um hotel inexistente
  it("should return 404 when updating a non-existent hotel", async () => {
    const nonExistentHotelId = "5fb9957a9b0eaf001e25b6e4"; // ID que não existe

    const updatedHotelData = {
      name: "Updated Hotel Test",
      rating: 5,
    };

    const response = await supertest(app)
      .put(`/api/hotels/${nonExistentHotelId}`)
      .set("Content-Type", "application/json")
      .send(updatedHotelData);

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
  });
});

describe("HTC_004", () => {
  // Limpa o ambiente após cada teste, deletando o hotel criado se existir
  afterEach(async () => {
    await Hotel.deleteOne({ name: "Hotel Test" });
  });

  // Teste: deve deletar um hotel existente e retornar 200
  it("should delete an existing hotel and return 204", async () => {
    // Cria um hotel para ser deletado
    const newHotel = await Hotel.create({
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    });

    const response = await supertest(app).delete(`/api/hotels/${newHotel._id}`);

    expect(response.status).to.equal(204);
  });
});

describe("HTC_005", () => {
  // Limpa o ambiente após cada teste, deletando o hotel criado se existir
  afterEach(async () => {
    await Hotel.deleteOne({ name: "Hotel Test" });
  });

  // Teste: deve obter os detalhes de um hotel específico e retornar 200
  it("should get details of a specific hotel and return 200", async () => {
    // Cria um hotel para ser recuperado
    const newHotel = await Hotel.create({
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    });

    const response = await supertest(app).get(
      `/api/hotels/find/${newHotel._id}`
    );

    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal("Hotel Test");
    // Adicione mais verificações conforme necessário para os detalhes do hotel
  });
});

describe("HTC_006", () => {
  // Limpa o ambiente após cada teste, deletando o hotel criado se existir
  after(async () => {
    await Hotel.deleteMany({}); // Limpa todos os hotéis após cada teste
  });

  // Teste: deve retornar 404 ao tentar obter os detalhes de um hotel inexistente
  it("should return 404 when getting details of a non-existent hotel", async () => {
    const nonExistentHotelId = "5fb9957a9b0eaf001e25b6e4"; // ID que não existe

    const response = await supertest(app).get(
      `/api/hotels/find/${nonExistentHotelId}`
    );

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
  });
});

describe("HTC_007", () => {
  // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
  afterEach(async () => {
    await Hotel.deleteMany({});
  });

  // Teste: deve obter todos os hotéis e retornar 200
  it("should get all hotels and return 200", async () => {
    // Cria alguns hotéis para serem listados
    let newHotel = {
      name: "Hotel 1",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel 1 Title",
      desc: "Description of Hotel 1",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    };
    const hotel1 = new Hotel(newHotel);
    await hotel1.save();

    newHotel = {
      name: "Hotel 2",
      type: "Hotel",
      city: "City Test",
      address: "456 Elm St",
      distance: "Downtown",
      photos: [
        "https://example.com/photo3.jpg",
        "https://example.com/photo4.jpg",
      ],
      title: "Hotel 2 Title",
      desc: "Description of Hotel 2",
      rating: 5,
      rooms: ["Suite", "Family Room"],
      cheapestPrice: 150,
      featured: false,
    };
    const hotel2 = new Hotel(newHotel);
    await hotel2.save();

    const response = await supertest(app).get("/api/hotels/");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(2); // Verifica se retornou os dois hotéis criados
    expect(response.body.some((hotel) => hotel.name === "Hotel 1")).to.be.true;
    expect(response.body.some((hotel) => hotel.name === "Hotel 2")).to.be.true;
    // Adicione mais verificações conforme necessário para os detalhes dos hotéis
  });
});

describe("HTC_008", () => {
  // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
  afterEach(async () => {
    await Hotel.deleteMany({});
  });

  // Teste: deve obter a contagem de hotéis por cidade e retornar 200
  it("should get hotel counts by city and return 200", async () => {
    // Cria alguns hotéis para serem contados por cidade
    await Hotel.create({
      name: "Hotel 1",
      type: "Resort",
      city: "City A",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel 1 Title",
      desc: "Description of Hotel 1",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    });

    await Hotel.create({
      name: "Hotel 2",
      type: "Hotel",
      city: "City B",
      address: "456 Elm St",
      distance: "Downtown",
      photos: [
        "https://example.com/photo3.jpg",
        "https://example.com/photo4.jpg",
      ],
      title: "Hotel 2 Title",
      desc: "Description of Hotel 2",
      rating: 5,
      rooms: ["Suite", "Family Room"],
      cheapestPrice: 150,
      featured: false,
    });

    const response = await supertest(app)
      .get("/api/hotels/countByCity")
      .query({ cities: "City A,City B" }); // Query param para especificar as cidades a serem contadas

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(2); // Deve retornar contagem para as duas cidades
    // Adicione mais verificações conforme necessário para os detalhes da contagem por cidade
  });
});

describe("HTC_009", () => {
  // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
  afterEach(async () => {
    await Hotel.deleteMany({});
  });

  // Teste: deve obter a contagem de hotéis por tipo e retornar 200
  it("should get hotel counts by type and return 200", async () => {
    // Cria alguns hotéis para serem contados por tipo
    await Hotel.create({
      name: "Hotel 1",
      type: "resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel 1 Title",
      desc: "Description of Hotel 1",
      rating: 4,
      rooms: ["Single Room", "Double Room"],
      cheapestPrice: 100,
      featured: true,
    });

    await Hotel.create({
      name: "Hotel 2",
      type: "hotel",
      city: "City Test",
      address: "456 Elm St",
      distance: "Downtown",
      photos: [
        "https://example.com/photo3.jpg",
        "https://example.com/photo4.jpg",
      ],
      title: "Hotel 2 Title",
      desc: "Description of Hotel 2",
      rating: 5,
      rooms: ["Suite", "Family Room"],
      cheapestPrice: 150,
      featured: false,
    });

    const response = await supertest(app).get("/api/hotels/countByType");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(5); // Deve retornar contagem para os 5 tipos de estadia
    expect(
      response.body.some((item) => item.type === "resort" && item.count === 1)
    ).to.be.true;
    expect(
      response.body.some((item) => item.type === "hotel" && item.count === 1)
    ).to.be.true;
    // Adicione mais verificações conforme necessário para os detalhes da contagem por tipo
  });
});

describe("HTC_010", () => {
  // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
  after(async () => {
    await Hotel.deleteMany({});
    await Room.deleteMany({});
  });

  // Teste: deve obter os quartos de um hotel específico e retornar 200
  it("should get rooms of a specific hotel and return 200", async () => {
    // Cria um hotel com quartos
    const newHotel = await Hotel.create({
      name: "Hotel Test",
      type: "Resort",
      city: "City Test",
      address: "123 Main St",
      distance: "Close to attractions",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
      title: "Hotel Test Title",
      desc: "Description of Hotel Test",
      rating: 4,
      rooms: [],
      cheapestPrice: 100,
      featured: true,
    });

    // Cria quartos no hotel criado
    const room1 = new Room({
      title: "Room",
      desc: "Queen size bed, 1 bathroom, balcony",
      price: 85,
      maxPeople: 2,
      roomNumbers: [{ number: 201 }, { number: 202 }],
    });
    const savedRoom1 = await room1.save();
    const room2 = new Room({
      title: "Another Room",
      desc: "King size bed, 1 bathroom, balcony",
      price: 100,
      maxPeople: 2,
      roomNumbers: [{ number: 301 }, { number: 302 }],
    });
    const savedRoom2 = await room2.save();

    // Adiciona quartos no hotel criado
    await Hotel.findByIdAndUpdate(newHotel._id, {
      $push: { rooms: savedRoom1._id },
    });
    await Hotel.findByIdAndUpdate(newHotel._id, {
      $push: { rooms: savedRoom2._id },
    });

    const response = await supertest(app).get(
      `/api/hotels/room/${newHotel._id}`
    );

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(2); // Deve retornar os dois quartos do hotel criado
  });
});
