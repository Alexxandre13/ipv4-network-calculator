import type { iIPv4 } from "./types";
import * as p from "./properties";

export const checkRangeAndType = (
  name: string,
  value: number,
  min: number,
  max: number
): void => {
  if (value < min || value > max) {
    throw new RangeError(
      `${name}: ${value} is out of range ! It must be between ${min} and ${max}.`
    );
  }
  if (isNaN(value)) {
    throw new TypeError(
      `${name}: ${value} is not a number ! It must be between ${min} and ${max}.`
    );
  }
};

export const checkIp = (ip: iIPv4): void[] =>
  Object.values(ip).map((octet: number) =>
    checkRangeAndType("Value", octet, p.OCTET_MIN, p.OCTET_MAX)
  );

export const toBinOctet = (decOctet: number): string => {
  const binary = (decOctet >>> 0).toString(2);
  return "0".repeat(p.BITS_IN_OCTET - binary.length) + binary;
};

export const decIPtoBinIP = (decOctets: iIPv4): string =>
  toBinOctet(decOctets.o1) +
  toBinOctet(decOctets.o2) +
  toBinOctet(decOctets.o3) +
  toBinOctet(decOctets.o4);
