import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { pull } from "../mod.ts";

Deno.test("Make sure fetch is correct", async () => {
  const expect = chai.expect;

  const response = await pull(1);

  expect(response[0]).to.have.property("keyword");
  expect(response[0]).to.have.property("count");
  expect(response[0]).to.have.property("image");
  expect(response[0]).to.have.property("source");
  expect(response[0]).to.have.property("timestamp");
});
