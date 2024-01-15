const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Group Chat Application E2E Test", () => {
  let adminToken;
  let normalUserToken;
  let groupId;
  let messageId;
  let adminUserId = "65a439911cf2abdbec888a28";
  let normalUserId;
  const adminCredentials = {
    username: "abzthegamer",
    password: "password123",
  };
  const normalUserCredentials = {
    username: "abzthegamer1",
    password: "password123",
  };
  const newGroup = { name: "New Group" };
  before(async () => {
    const adminLoginResponse = await chai
      .request(app)
      .post("/login")
      .send(adminCredentials);
    adminToken = adminLoginResponse.body.token;

    const normalUserLoginResponse = await chai
      .request(app)
      .post("/login")
      .send(normalUserCredentials);

    normalUserToken = normalUserLoginResponse.body.token;
  });

  describe("Authentication", () => {
    it.only("should login and get a token", async () => {
      const response = await chai
        .request(app)
        .post("/login")
        .send(adminCredentials);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("token");
    });
  });

  describe("Admin Actions", () => {
    it.only("should create a new user (admin only)", async () => {
      const response = await chai
        .request(app)
        .post("/admin/user")
        .set("Authorization", adminToken)
        .send({
          username: "testuser",
          password: "testpassword",
          role: "normal",
        });

      normalUserId = response.body._id;
      expect(response).to.have.status(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("username", "testuser");
    });

    it.only("should edit an existing user", async () => {
      const updatedUser = {
        username: "updateduser",
        password: "updatedpassword",
      };
      const response = await chai
        .request(app)
        .put(`/admin/user/${normalUserId}`)
        .set("Authorization", adminToken)
        .send(updatedUser);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("_id");
      // You can add more assertions based on the response structure
    });
  });

  describe("Normal User Actions", () => {
    it.only("should not allow a normal user to create a new user", async () => {
      const response = await chai
        .request(app)
        .post("/admin/user")
        .set("Authorization", normalUserToken)
        .send({
          username: "anotheruser",
          password: "anotherpassword",
          role: "normal",
        });

      expect(response).to.have.status(403);
    });

    it.only("should create a new group", async () => {
      const response = await chai
        .request(app)
        .post("/groups/create")
        .set("Authorization", normalUserToken)
        .send(newGroup);

      expect(response).to.have.status(201);
      expect(response.body).to.have.property("_id");
      groupId = response.body._id;
    });

    it.only("should send a message to a group", async () => {
      const messageContent = "Hello, Group!";
      const response = await chai
        .request(app)
        .post(`/groups/${groupId}/messages/send`)
        .set("Authorization", normalUserToken)
        .send({ content: messageContent });

      expect(response).to.have.status(201);
      expect(response.body).to.have.property("_id");
      messageId = response.body._id;
    });

    it.only("should add member to a group", async () => {
      const response = await chai
        .request(app)
        .post(`/groups/${groupId}/add-member`)
        .set("Authorization", normalUserToken)
        .send({ memberId: adminUserId });

      expect(response).to.have.status(200);
    });

    it("should like a group message", async () => {
      const response = await chai
        .request(app)
        .post(`/groups/${groupId}/messages/${messageId}/like`)
        .set("Authorization", adminUserId);

      expect(response).to.have.status(200);
    });

    it.only("should search group", async () => {
      const response = await chai
        .request(app)
        .get(`/groups/search?name=${newGroup.name}`)
        .set("Authorization", normalUserToken);

      expect(response).to.have.status(200);
    });

    it.only("should delete group", async () => {
      const response = await chai
        .request(app)
        .delete(`/groups/${groupId}`)
        .set("Authorization", normalUserToken);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property(
        "message",
        "Group deleted successfully"
      );
    });
  });

  after(async () => {
    // You can perform cleanup tasks here if needed
    const deleteCreatedUser = await chai
      .request(app)
      .delete(`/admin/user/${normalUserId}`)
      .set("Authorization", adminToken);
  });
});
