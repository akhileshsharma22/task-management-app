import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import app from "../src/app.js";

test("GET /api/health returns the standard success envelope", async () => {
  const response = await request(app).get("/api/health").expect(200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, "ok");
});

test("GET /api/tasks rejects unauthenticated requests", async () => {
  const response = await request(app).get("/api/tasks").expect(401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Authentication required");
});
