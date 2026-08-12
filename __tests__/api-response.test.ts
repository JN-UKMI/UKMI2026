import { describe, expect, it } from "vitest";
import {
  apiBadRequest,
  apiCreated,
  apiNotFound,
  apiOk,
  apiRateLimited,
  apiResponse,
  apiServerError,
  apiUnauthorized,
} from "@/lib/api-response";

async function parse(response: Response) {
  return { status: response.status, body: await response.json() };
}

describe("apiResponse envelope", () => {
  it("returns ok:true for 2xx", async () => {
    const { status, body } = await parse(apiResponse(200, "Berhasil", { data: { id: 1 } }));
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.message).toBe("Berhasil");
    expect(body.data).toEqual({ id: 1 });
    expect(body.code).toBeNull();
  });

  it("returns ok:false with code for 4xx/5xx", async () => {
    const { status, body } = await parse(apiResponse(500, "Gagal", { code: "INTERNAL" }));
    expect(status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.code).toBe("INTERNAL");
  });
});

describe("convenience helpers", () => {
  it("apiOk -> 200", async () => {
    const { status, body } = await parse(apiOk("OK", ["a"]));
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data).toEqual(["a"]);
  });

  it("apiCreated -> 201", async () => {
    const { status, body } = await parse(apiCreated("Dibuat", { slug: "x" }));
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
  });

  it("apiBadRequest -> 400 with BAD_REQUEST code", async () => {
    const { status, body } = await parse(apiBadRequest("Payload tidak valid"));
    expect(status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.code).toBe("BAD_REQUEST");
  });

  it("apiUnauthorized -> 403 with AUTH_REQUIRED code", async () => {
    const { status, body } = await parse(apiUnauthorized());
    expect(status).toBe(403);
    expect(body.code).toBe("AUTH_REQUIRED");
  });

  it("apiNotFound -> 404", async () => {
    const { status, body } = await parse(apiNotFound("Tidak ditemukan"));
    expect(status).toBe(404);
    expect(body.code).toBe("NOT_FOUND");
  });

  it("apiRateLimited -> 429 with Retry-After header", async () => {
    const response = apiRateLimited("Terlalu banyak percobaan", 900);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("900");
    const body = await response.json();
    expect(body.code).toBe("RATE_LIMITED");
  });

  it("apiRateLimited omits Retry-After when absent", () => {
    const response = apiRateLimited("Terlalu banyak percobaan");
    expect(response.headers.get("Retry-After")).toBeNull();
  });

  it("apiServerError -> 500 with INTERNAL code", async () => {
    const { status, body } = await parse(apiServerError());
    expect(status).toBe(500);
    expect(body.code).toBe("INTERNAL");
  });
});
