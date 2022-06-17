import * as f from "../functions";
import { iIPv4 } from "../types";

const cases: [string, string][] = [
  ["00000000000000000000000000000000", "0.0.0.0"],
  ["11000000101010000000000000000001", "192.168.0.1"],
  ["11111111" + "11111111" + "11111111" + "11111111", "255.255.255.255"],
];

// A retravailler, tester d'abord les autres functions et revenir sur celle-ci

test.each(cases)("toDecimalIP( %s ) should return %s", (bin, ip) => {
  expect(f.toDecimalIP(bin)).toBe(ip);
});
