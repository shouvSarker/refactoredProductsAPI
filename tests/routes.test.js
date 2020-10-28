const supertest = require("supertest");
const app = require("../index");

describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("Product Endpoints", () => {
  it("should get the products", async () => {
    const res = await supertest(app).get("/v1/products");
    expect(res.status).toBe(200);
    expect(res.body.Items.length > 1).toBe(true);
  });
});
