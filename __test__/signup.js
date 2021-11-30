const request = require("supertest");
const app = require("../app");

describe("User signUp", () => {
  const signupRoute = "/api/v1/user/create";
  it("Successful", async () => {
    const res = await request(app).post(signupRoute).send({
      firstname: "bee",
      lastname: "balio",
      email: "bee@test.com",
      password: "password",
    });
    console.log(res);
    expect(res.body).toHaveProperty("success");
  });

  it("Data does not exist", async () => {
    const res = await request(app).post(signupRoute).send();
    expect(res.statusCode).toEqual(401);
  });
});
