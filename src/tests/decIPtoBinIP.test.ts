import * as f from "../functions";
import { iIPv4 } from "../types";

const test = "should convert an IPv4 object to a binary string";

it(test, () => {
  const addr: iIPv4 = {
    o1: 192,
    o2: 168,
    o3: 0,
    o4: 1,
  };

  expect(f.decIPtoBinIP(addr)).toBe("11000000101010000000000000000001");
});

it(test, () => {
  const addr: iIPv4 = {
    o1: 0,
    o2: 0,
    o3: 0,
    o4: 0,
  };

  expect(f.decIPtoBinIP(addr)).toBe("00000000000000000000000000000000");
});

it(test, () => {
  const addr: iIPv4 = {
    o1: 255,
    o2: 255,
    o3: 255,
    o4: 255,
  };

  expect(f.decIPtoBinIP(addr)).toBe("11111111111111111111111111111111");
});
