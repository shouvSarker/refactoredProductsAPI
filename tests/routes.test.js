const request = require("supertest");
const app = require("../server");
const fs = require("fs");
const workingDir = "tests/fixtures/";

describe("Product Endpoints", () => {
  it("should get the products", async () => {
    const res = await request(app).get("/v1/products");
    expect(res.status).toBe(200);
    expect(res.body.Items.length > 1).toBe(true);
  });

  it("should get one product by name", async () => {
    const productSingle = fs.readFileSync(
      workingDir + "product-single-get-expected.json"
    );
    const res = await request(app)
      .get("/v1/products")
      .query({ name: "Apple iPhone 6S" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(JSON.parse(productSingle));
  });

  it("should get one product by id", async () => {
    const productSingle = fs.readFileSync(
      workingDir + "product-single-get-expected.json"
    );
    const res = await request(app).get(
      "/v1/products/DE1287C0-4B15-4A7B-9D8A-DD21B3CAFEC3"
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(JSON.parse(productSingle).Items[0]);
  });

  it("should create, update and delete a product", async () => {
    const res = await request(app)
      .post("/v1/products")
      .set("Content-type", "application/json")
      .send({
        Name: "Test product to be deleted",
        Description: "Test product description",
        Price: 1024.99,
        DeliveryPrice: 16.99,
      });
    expect(res.status).toBe(201);

    const updateRes = await request(app)
      .put("/v1/products/" + res.body.id)
      .set("Content-type", "application/json")
      .send({
        Name: "Test product update",
        Description: "Test product updated description",
        Price: 104.99,
        DeliveryPrice: 116.99,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.Name).toBe("Test product update");
    expect(updateRes.body.Description).toBe("Test product updated description");
    expect(updateRes.body.Price).toBe(104.99);
    expect(updateRes.body.DeliveryPrice).toBe(116.99);

    const delRes = await request(app).delete("/v1/products/" + res.body.id);
    expect(delRes.status).toBe(200);
  });

  it("should get product options", async () => {
    const res = await request(app).get(
      "/v1/products/8F2E9176-35EE-4F0A-AE55-83023D2DB1A3/options"
    );
    expect(res.status).toBe(200);
    expect(res.body.Items.length > 1).toBe(true);
  });

  it("should get product options by id", async () => {
    const optionSingle = fs.readFileSync(
      workingDir + "option-single-get-expected.json"
    );
    const res = await request(app).get(
      "/v1/products/8F2E9176-35EE-4F0A-AE55-83023D2DB1A3/options/0643CCF0-AB00-4862-B3C5-40E2731ABCC9"
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(JSON.parse(optionSingle));
  });

  it("should create, update and delete an option", async () => {
    const res = await request(app)
      .post("/v1/products/8F2E9176-35EE-4F0A-AE55-83023D2DB1A3/options")
      .set("Content-type", "application/json")
      .send({
        Name: "Test option to be deleted",
        Description: "Test option description",
      });
    expect(res.status).toBe(201);

    const updateRes = await request(app)
      .put(
        "/v1/products/8F2E9176-35EE-4F0A-AE55-83023D2DB1A3/options/" +
          res.body.Id
      )
      .set("Content-type", "application/json")
      .send({
        Name: "Test option update",
        Description: "Test option updated description",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.Name).toBe("Test option update");
    expect(updateRes.body.Description).toBe("Test option updated description");

    const delRes = await request(app).delete(
      "/v1/products/8F2E9176-35EE-4F0A-AE55-83023D2DB1A3/options/" + res.body.Id
    );
    expect(delRes.status).toBe(200);
  });

  it("should fail because of not matching raml definition", async () => {
    const res = await request(app)
      .post("/v1/products")
      .set("Content-type", "application/json")
      .send({
        Name: "Test product to be deleted",
        Description: "Test product description",
        Price: "1024.99",
        DeliveryPrice: 16.99,
      });
    expect(res.status).toBe(400);
  });
});
