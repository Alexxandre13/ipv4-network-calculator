import * as f from "../functions";
import { iIPv4 } from "../types";

const cases: [iIPv4, string][] = [
  [
    {
      o1: 192,
      o2: 168,
      o3: 0,
      o4: 1,
    },
    "11000000101010000000000000000001",
  ],
  [
    {
      o1: 0,
      o2: 0,
      o3: 0,
      o4: 0,
    },
    "00000000000000000000000000000000",
  ],
  [
    {
      o1: 255,
      o2: 255,
      o3: 255,
      o4: 255,
    },
    "11111111111111111111111111111111",
  ],
];

test.each(cases)("decIPtoBinIP( %s ) should return %s", (ipv4, bin) => {
  expect(f.decIPtoBinIP(ipv4)).toBe(bin);
});
