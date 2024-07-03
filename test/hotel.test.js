import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();

import app from "../index.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

describe("HTC_001", () => {
    let adminToken; // Variável para armazenar o token de admin
  
    // Before Hook: Login como admin para obter token de administração
    before(async () => {
        // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
        const adminUser = {
          username: "admin",
          password: "adminPassword",
        };
    
        // Realiza login como admin para obter o token
        const response = await supertest(app)
          .post("/api/auth/login")
          .set("Content-Type", "application/json")
          .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token de administração
    });
  
    // After Each Hook: Limpar o ambiente após cada teste
    afterEach(async () => {
      await Hotel.deleteOne({ name: "Hotel Test" }); // Remove o hotel de teste se existir
    });
  
    it("should create a hotel with all valid fields and return status 201", async () => {
      const hotelData = {
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(hotelData);
  
      // Verificações
      expect(response.statusCode).to.equal(201); // Espera o status 201 (Created)
      expect(response.body).to.have.property("message").that.includes("Hotel created successfully");
  
      // Verifique se o hotel foi realmente criado no banco de dados
      const hotel = await Hotel.findOne({ name: "Hotel Test" });
      expect(hotel).to.exist;
      expect(hotel.name).to.equal("Hotel Test");
      // Adicione mais verificações conforme necessário para os campos do hotel
    });
  });
  

  describe("HTC_002", () => {
    let adminToken; // Variável para armazenar o token de admin
  
    // Before hook para autenticar o usuário administrativo
    before(async () => {
      // Autenticar o usuário admin e obter o token
      const adminCredentials = {
        username: "admin",
        password: "adminPassword",
      };
  
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminCredentials);
  
      adminToken = response.body.token; // Salvar o token de admin para uso nos testes
    });
  
    // After hook para excluir o hotel de teste se ele existir
    after(async () => {
      await Hotel.deleteOne({ name: "Hotel Test" });
    });
  
    // Teste: não deve criar um hotel sem autenticação de admin
    it("should not create a hotel without admin authentication", async () => {
      const hotelData = {
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      };
  
      // Envie a solicitação para criar um hotel sem autenticação de admin
      const response = await supertest(app)
        .post("/api/hotels")
        .set("Content-Type", "application/json")
        .send(hotelData);
  
      // Verificações
      expect(response.status).to.equal(403); // Espera o status 403 (Forbidden)
      expect(response.body).to.have.property("message").that.includes("Admin authentication required");
  
      // Verifique se o hotel NÃO foi criado no banco de dados
      const hotel = await Hotel.findOne({ name: "Hotel Test" });
      expect(hotel).to.not.exist;
    });
  
    // Teste adicional: deve criar um hotel com autenticação de admin
    it("should create a hotel with admin authentication", async () => {
      const hotelData = {
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      };
  
      // Envie a solicitação para criar um hotel com autenticação de admin
      const response = await supertest(app)
        .post("/api/hotels")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(hotelData);
  
      // Verificações
      expect(response.status).to.equal(201); // Espera o status 201 (Created)
      expect(response.body).to.have.property("message").that.includes("Hotel created successfully");
  
      // Verifique se o hotel foi realmente criado no banco de dados
      const hotel = await Hotel.findOne({ name: "Hotel Test" });
      expect(hotel).to.exist;
      expect(hotel.name).to.equal("Hotel Test");
      // Adicione mais verificações conforme necessário para os campos do hotel
    });
  });
  
  
  describe("HTC_003", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
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
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(hotelData);
  
      expect(response.status).to.equal(200);
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
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedHotelData);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("_id");
      expect(response.body.name).to.equal("Updated Hotel Test");
      expect(response.body.rating).to.equal(5);
      // Adicione mais verificações conforme necessário para os campos atualizados do hotel
    });
  });
  
  describe("HTC_004", () => {
    let newHotelId;

    before(async () => {
        // Crie um hotel inicial para ser atualizado
        const newHotel = await Hotel.create({
            name: "Hotel Test",
            type: "Resort",
            city: "City Test",
            address: "123 Main St",
            distance: "Close to attractions",
            photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
            title: "Hotel Test Title",
            desc: "Description of Hotel Test",
            rating: 4,
            rooms: ["Single Room", "Double Room"],
            cheapestPrice: 100,
            featured: true,
        });

        newHotelId = newHotel._id; // Salva o ID do hotel criado para uso nos testes
    });

    // Limpa o ambiente após cada teste, deletando o hotel criado se existir
    afterEach(async () => {
        await Hotel.deleteOne({ _id: newHotelId });
    });

    // Teste: deve atualizar um hotel sem autenticação de admin
    it("should update a hotel without admin authentication", async () => {
        const updatedHotelData = {
            name: "Updated Hotel Test",
            rating: 5,
        };

        // Simule uma requisição PUT para atualizar o hotel sem autenticação de admin
        const response = await supertest(app)
            .put(`/api/hotels/${newHotelId}`)
            .set("Content-Type", "application/json")
            .send(updatedHotelData);

        // Verifique se a resposta tem status 403 (Forbidden)
        expect(response.status).to.equal(403);

        // Verifique se a resposta contém uma mensagem de erro indicando falta de autenticação de admin
        expect(response.body).to.have.property("message").that.includes("Admin authentication required");
    });
});

  describe("HTC_005", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedHotelData);
  
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
    });
  
    // Teste: deve deletar um hotel existente
    it("should delete an existing hotel", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  
  describe("HTC_006", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando o hotel criado se existir
    afterEach(async () => {
      await Hotel.deleteOne({ name: "Hotel Test" });
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedHotelData);
  
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
    });
  });
  
  describe("HTC_007", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando o hotel criado se existir
    afterEach(async () => {
      await Hotel.deleteOne({ name: "Hotel Test" });
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
        // Cria um hotel para ser deletado
        const newHotel = await Hotel.create({
          name: "Hotel Test",
          type: "Resort",
          city: "City Test",
          address: "123 Main St",
          distance: "Close to attractions",
          photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
          title: "Hotel Test Title",
          desc: "Description of Hotel Test",
          rating: 4,
          rooms: ["Single Room", "Double Room"],
          cheapestPrice: 100,
          featured: true,
        });
    
        const response = await supertest(app)
          .delete(`/api/hotels/${newHotel._id}`)
          .set("Authorization", `Bearer ${adminToken}`);
    
        expect(response.status).to.equal(200);
        expect(response.body).to.equal("Hotel has been deleted");
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedHotelData);
  
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
    });
  });
  
  describe("HTC_008", () => {
    let adminToken;
    let createdHotelId;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando o hotel criado se existir
    afterEach(async () => {
      await Hotel.deleteOne({ _id: createdHotelId });
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
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      createdHotelId = newHotel._id; // Armazena o ID do hotel criado para limpeza posterior
  
      const response = await supertest(app)
        .get(`/api/hotels/find/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal("Hotel Test");
      // Adicione mais verificações conforme necessário para os detalhes do hotel
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  
  describe("HTC_009", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando o hotel criado se existir
    afterEach(async () => {
      await Hotel.deleteMany({}); // Limpa todos os hotéis após cada teste
    });
  
    // Teste: deve retornar 404 ao tentar obter os detalhes de um hotel inexistente
    it("should return 404 when getting details of a non-existent hotel", async () => {
      const nonExistentHotelId = "5fb9957a9b0eaf001e25b6e4"; // ID que não existe
  
      const response = await supertest(app)
        .get(`/api/hotels/find/${nonExistentHotelId}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Hotel not found"); // Mensagem de erro esperada
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  
  describe("HTC_010", () => {
    let adminToken;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
    afterEach(async () => {
      await Hotel.deleteMany({});
    });
  
    // Teste: deve obter todos os hotéis e retornar 200
    it("should get all hotels and return 200", async () => {
      // Cria alguns hotéis para serem listados
      const hotel1 = await Hotel.create({
        name: "Hotel 1",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel 1 Title",
        desc: "Description of Hotel 1",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const hotel2 = await Hotel.create({
        name: "Hotel 2",
        type: "Hotel",
        city: "City Test",
        address: "456 Elm St",
        distance: "Downtown",
        photos: ["https://example.com/photo3.jpg", "https://example.com/photo4.jpg"],
        title: "Hotel 2 Title",
        desc: "Description of Hotel 2",
        rating: 5,
        rooms: ["Suite", "Family Room"],
        cheapestPrice: 150,
        featured: false,
      });
  
      const response = await supertest(app)
        .get("/api/hotels")
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(2); // Verifica se retornou os dois hotéis criados
      expect(response.body.some(hotel => hotel.name === "Hotel 1")).to.be.true;
      expect(response.body.some(hotel => hotel.name === "Hotel 2")).to.be.true;
      // Adicione mais verificações conforme necessário para os detalhes dos hotéis
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  
  describe("HTC_011", () => {
    let adminToken;
    let createdHotelId;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
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
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
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
        photos: ["https://example.com/photo3.jpg", "https://example.com/photo4.jpg"],
        title: "Hotel 2 Title",
        desc: "Description of Hotel 2",
        rating: 5,
        rooms: ["Suite", "Family Room"],
        cheapestPrice: 150,
        featured: false,
      });
  
      const response = await supertest(app)
        .get("/api/hotels/countByCity")
        .query({ cities: "City A,City B" }) // Query param para especificar as cidades a serem contadas
  
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(2); // Deve retornar contagem para as duas cidades
      // Adicione mais verificações conforme necessário para os detalhes da contagem por cidade
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  
  describe("HTC_012", () => {
    let adminToken;

    before(async () => {
        // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
        const adminUser = {
            username: "admin",
            password: "adminPassword",
        };

        // Realiza login como admin para obter o token
        const response = await supertest(app)
            .post("/api/auth/login")
            .set("Content-Type", "application/json")
            .send(adminUser);

        adminToken = response.body.token; // Armazena o token para uso nos testes
    });

    // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
    afterEach(async () => {
        await Hotel.deleteMany({});
    });

    // Teste: deve obter a contagem de hotéis por tipo e retornar 200
    it("should get hotel counts by type and return 200", async () => {
        // Cria alguns hotéis para serem contados por tipo
        await Hotel.create({
            name: "Hotel 1",
            type: "Resort",
            city: "City Test",
            address: "123 Main St",
            distance: "Close to attractions",
            photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
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
            city: "City Test",
            address: "456 Elm St",
            distance: "Downtown",
            photos: ["https://example.com/photo3.jpg", "https://example.com/photo4.jpg"],
            title: "Hotel 2 Title",
            desc: "Description of Hotel 2",
            rating: 5,
            rooms: ["Suite", "Family Room"],
            cheapestPrice: 150,
            featured: false,
        });

        const response = await supertest(app)
            .get("/api/hotels/countByType")
            .set("Authorization", `Bearer ${adminToken}`); // Adiciona o token de administração

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.equal(5); // Deve retornar contagem para os 5 tipos de hotel
        expect(response.body.some(item => item.type === "Resort" && item.count === 1)).to.be.true;
        expect(response.body.some(item => item.type === "Hotel" && item.count === 1)).to.be.true;
        // Adicione mais verificações conforme necessário para os detalhes da contagem por tipo
    });

    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
        // Cria um hotel para ser deletado
        const newHotel = await Hotel.create({
            name: "Hotel Test",
            type: "Resort",
            city: "City Test",
            address: "123 Main St",
            distance: "Close to attractions",
            photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
            title: "Hotel Test Title",
            desc: "Description of Hotel Test",
            rating: 4,
            rooms: ["Single Room", "Double Room"],
            cheapestPrice: 100,
            featured: true,
        });

        const response = await supertest(app)
            .delete(`/api/hotels/${newHotel._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.equal("Hotel has been deleted");
    });
});

  
  describe("HTC_013", () => {
    let adminToken;
    let createdHotelId;
  
    before(async () => {
      // Simula a obtenção de um token de admin (isso pode variar dependendo da implementação real)
      const adminUser = {
        username: "admin",
        password: "adminPassword",
      };
  
      // Realiza login como admin para obter o token
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(adminUser);
  
      adminToken = response.body.token; // Armazena o token para uso nos testes
    });
  
    // Limpa o ambiente após cada teste, deletando todos os hotéis criados se existirem
    afterEach(async () => {
      await Hotel.deleteMany({});
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
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .get(`/api/hotels/room/${newHotel._id}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(2); // Deve retornar os dois quartos do hotel criado
      // Adicione mais verificações conforme necessário para os detalhes dos quartos do hotel
    });
  
    // Teste: deve deletar um hotel existente e retornar 200
    it("should delete an existing hotel and return 200", async () => {
      // Cria um hotel para ser deletado
      const newHotel = await Hotel.create({
        name: "Hotel Test",
        type: "Resort",
        city: "City Test",
        address: "123 Main St",
        distance: "Close to attractions",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        title: "Hotel Test Title",
        desc: "Description of Hotel Test",
        rating: 4,
        rooms: ["Single Room", "Double Room"],
        cheapestPrice: 100,
        featured: true,
      });
  
      const response = await supertest(app)
        .delete(`/api/hotels/${newHotel._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("Hotel has been deleted");
    });
  });
  