import * as f from "../functions";

const cases: [number, string][] = [
  [0, "00000000"],
  [1, "00000001"],
  [2, "00000010"],
  [4, "00000100"],
  [8, "00001000"],
  [16, "00010000"],
  [32, "00100000"],
  [64, "01000000"],
  [128, "10000000"],
  [255, "11111111"],
];

test.each(cases)("toBinOctet( %s ) should return %s", (dec, bin) => {
  expect(f.toBinOctet(dec)).toBe(bin);
});
