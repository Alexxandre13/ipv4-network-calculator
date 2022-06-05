import * as f from "../functions";

it("should be equals", () => {
  expect(f.toBinOctet(0)).toBe("00000000");
});

it("should be equals", () => {
  expect(f.toBinOctet(1)).toBe("00000001");
});

it("should be equals", () => {
  expect(f.toBinOctet(2)).toBe("00000010");
});

it("should be equals", () => {
  expect(f.toBinOctet(4)).toBe("00000100");
});

it("should be equals", () => {
  expect(f.toBinOctet(8)).toBe("00001000");
});

it("should be equals", () => {
  expect(f.toBinOctet(16)).toBe("00010000");
});

it("should be equals", () => {
  expect(f.toBinOctet(32)).toBe("00100000");
});

it("should be equals", () => {
  expect(f.toBinOctet(64)).toBe("01000000");
});

it("should be equals", () => {
  expect(f.toBinOctet(128)).toBe("10000000");
});

it("should be equals", () => {
  expect(f.toBinOctet(255)).toBe("11111111");
});
