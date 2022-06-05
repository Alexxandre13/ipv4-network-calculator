import * as f from "../functions";
import { iIPv4 } from "../types";

it("should throw a range Error", () => {
  const name = "whatever";
  const value = 256;
  const min = 0;
  const max = 255;

  expect(() => f.checkRangeAndType(name, value, min, max)).toThrowError(
    `${name}: ${value} is out of range ! It must be between ${min} and ${max}.`
  );
});

// it("should throw a type Error", () => {
//   const name = "whatever";
//   const value = 'ABC';
//   const min = 0;
//   const max = 255;
  
//   expect(() => f.checkRangeAndType(name, value, min, max)).toThrowError(
//     `${name}: ${value} is not a number ! It must be between ${min} and ${max}.`
//   );
// });

it("should return void", () => {
  const ip: iIPv4 = {
    o1: 192,  
    o2: 168,
    o3: 0,
    o4: 1
  }

  expect(() => f.checkIp(ip)).not.toThrow();
});

