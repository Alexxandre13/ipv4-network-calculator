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

export const checkIp = (ip: iIPv4): void[] => {
  return Object.values(ip).map((octet: number) =>
    checkRangeAndType("Value", octet, p.OCTET_MIN, p.OCTET_MAX)
  );
};

export const toBinOctet = (decOctet: number): string => {
  const binary = (decOctet >>> 0).toString(2);
  return "0".repeat(p.BITS_IN_OCTET - binary.length) + binary;
};

export const decIPtoBinIP = (decOctets: iIPv4): string => {
  return (
    toBinOctet(decOctets.o1) +
    toBinOctet(decOctets.o2) +
    toBinOctet(decOctets.o3) +
    toBinOctet(decOctets.o4)
  );
};

export const binMasktoCidr = (binMask: string): number => {
  return [...binMask].filter((bit) => bit === "1").length;
};

export const cidrToBinMask = (cidr: number): string => {
  return "1".repeat(cidr) + "0".repeat(p.BITS_IN_IPV4 - cidr);
};

export const toDecimalIP = (binary: string): string => {
  const firstOctet = toDecimal(binary.substring(0, 8));
  const secondOctet = toDecimal(binary.substring(8, 16));
  const thirdOctet = toDecimal(binary.substring(16, 24));
  const fourthOctet = toDecimal(binary.substring(24, 32));
  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
};

export const toDecimal = (binary: string): number => parseInt(binary, 2);

export const calcBinNetwork = (binHost: string, cidr: number): string => {
  return binHost.substring(0, cidr) + "0".repeat(p.BITS_IN_IPV4 - cidr);
};

export const calcNumberOfUsableHosts = (binMask: string): number => {
  const number = toDecimal(calcInverseBit(binMask)) - 1;
  return number <= 0 ? 0 : number;
};

export const calcInverseBit = (bin: string): string => {
  return [...bin].map((bit) => (bit === "1" ? "0" : "1")).join("");
};

export const calcIncrement = (cidr: number): number => {
  return p.OCTET_POSSIBILITIES / 2 ** (cidr % p.BITS_IN_OCTET);
};

export const calcBinBroadcast = (binNetwork: string, cidr: number): string => {
  return binNetwork.substring(0, cidr) + "1".repeat(p.BITS_IN_IPV4 - cidr);
};

export const calcbinFirstAddr = (binNetwork: string): string => {
  return binNetwork.substring(0, p.BITS_IN_IPV4 - 1) + "1";
};

export const calcbinLastAddr = (binBroadcast: string): string => {
  return binBroadcast.substring(0, p.BITS_IN_IPV4 - 1) + "0";
};

export const calcBinNeighbourNetwork = (
  binOctet: string,
  cidr: number,
  netBitsInCurrentOctet: number,
  binNetwork: string
): string => {
  const floorCidr = cidr - netBitsInCurrentOctet;
  const floorBinNetwork = calcBinNetwork(binNetwork, floorCidr);
  return (
    floorBinNetwork.substring(0, floorCidr) +
    binOctet +
    floorBinNetwork.substring(floorCidr + p.BITS_IN_OCTET, p.BITS_IN_IPV4)
  );
};
