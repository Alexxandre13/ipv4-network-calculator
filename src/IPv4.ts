import type { iIPv4 } from "./types";
import * as f from "./functions";
import * as p from "./properties";

/**
 *  @licence MIT
 *
 *  @author Alexandre Dos Reis
 *
 *  @description Allow to calculate IPv4 subnet network informations such as IP network address, brodcast address, number and range of usable hosts and other things.
 */
export class IPv4 {
  // Constants relative to IPv4 networks
  private static BITS_IN_OCTET = p.BITS_IN_OCTET;
  private static BITS_IN_IPV4 = p.BITS_IN_IPV4;
  private static CIDR_MIN = p.CIDR_MIN;
  private static CIDR_MAX = p.CIDR_MAX;
  private static OCTET_MIN = p.OCTET_MIN;
  private static OCTET_MAX = p.OCTET_MAX;
  private static OCTET_POSSIBILITIES = p.OCTET_POSSIBILITIES;

  private decHost: iIPv4;
  private decMask: iIPv4 | undefined;
  private cidr: number | undefined;
  private binMask: string | undefined;
  private binHost: string | undefined;
  private binNetwork: string | undefined;
  private binBroadcast: string | undefined;
  private binFirstAddr: string | undefined;
  private binLastAddr: string | undefined;
  private binWildCardMask: string | undefined;
  private numberOfUsableHosts: number | undefined;
  private increment: number | undefined;
  private netBitsInCurrentOctet: number | undefined;
  private numberOfSubNetworks: number | undefined;

  /**
   * @param {string} hostAddr - An IP address in cidr or mask format - '192.168.1.1/24' or '192.168.1.1 255.255.255.0'
   */
  constructor(hostAddr: string) {
    const octets = hostAddr.replace(/(\.|\/| )/g, ".").split(".");

    // Host object
    this.decHost = {
      o1: +octets[0],
      o2: +octets[1],
      o3: +octets[2],
      o4: +octets[3],
    };
    try {
      IPv4.checkIp(this.decHost);
    } catch (e) {
      console.log(e);
      return;
    }

    if (octets.length === 5) {
      // CIDR NOTATION
      this.cidr = Number(octets[4]);
      try {
        IPv4.checkRangeAndType("CIDR", this.cidr, IPv4.CIDR_MIN, IPv4.CIDR_MAX);
      } catch (e) {
        console.log(e);
        return;
      }
      this.binMask = IPv4.cidrToBinMask(this.cidr);
    } else if (octets.length === 8) {
      // MASK NOTATION
      this.decMask = {
        o1: +octets[4],
        o2: +octets[5],
        o3: +octets[6],
        o4: +octets[7],
      };
      try {
        IPv4.checkIp(this.decMask);
      } catch (e) {
        console.error(e);
        return;
      }
      // TODO : CHeck if mask is valid
      this.binMask = IPv4.decIPtoBinIP(this.decMask);
      this.cidr = IPv4.binMasktoCidr(this.binMask);
    } else {
      throw new Error(
        "The host input isn't valid, must be like : '192.168.0.1/24' or '192.168.0.1 255.255.255.0'"
      );
    }

    // Binary calculation
    this.binHost = IPv4.decIPtoBinIP(this.decHost);
    this.binNetwork = IPv4.calcBinNetwork(this.binHost, this.cidr);
    this.binBroadcast = IPv4.calcBinBroadcast(this.binNetwork, this.cidr);
    this.binFirstAddr = IPv4.calcbinFirstAddr(this.binNetwork);
    this.binLastAddr = IPv4.calcbinLastAddr(this.binBroadcast);
    this.binWildCardMask = IPv4.calcBinWildCardMask(this.binMask);

    // Additionnal informations
    this.numberOfUsableHosts = IPv4.calcNumberOfUsableHosts(this.binMask);
    this.increment = IPv4.calcIncrement(this.cidr);
    this.netBitsInCurrentOctet = this.cidr % IPv4.BITS_IN_OCTET;
    this.numberOfSubNetworks = 2 ** this.netBitsInCurrentOctet;
  }

  /**
   * Check if the byte is valid
   * @param {object} Ip
   * @param {number} Ip.o1 The first octet
   * @param {number} Ip.o2 The second octet
   * @param {number} Ip.o3 The third octet
   * @param {number} Ip.o4 The fourth octet
   */
  private static checkIp = f.checkIp;

  /**
   * Check if value is within the range and is a number type.
   * @param {*} name Name of the value
   * @param {*} value The value itself
   * @param {*} min The min value
   * @param {*} max The max value
   * @throws {Error} RangeError or TypeError
   */
  private static checkRangeAndType = f.checkRangeAndType;

  /**
   * @param {iIPv4} decimalBytes Take the object with the four bytes
   * @returns {string} Returns the four bytes into a single binary string that keeps 0
   */
  private static decIPtoBinIP = f.decIPtoBinIP;

  /**
   * @param {number} decOctet A decimal octet number
   * @returns {string} Returns a binary byte string.
   */
  private static toBinOctet = f.toBinOctet;

  /**
   * @param {string} binMask - The mask in binary form
   * @returns {number} Returns the cidr notation in number format
   */
  private static binMasktoCidr = (binMask: string): number =>
    [...binMask].filter((bit) => bit === "1").length;

  /**
   * @param {number} cidr Take a number between 1 and 32.
   * @returns {string} Returns a binary byte string mask.
   */
  private static cidrToBinMask = (cidr: number): string =>
    "1".repeat(cidr) + "0".repeat(IPv4.BITS_IN_IPV4 - cidr);

  /**
   * @param {string} binary The full binary string - 32 characters
   * @returns {string} returns a string containing four keys corresponding to the 4 octets
   */
  private static toDecimalIP = (binary: string): string => {
    const firstOctet = IPv4.toDecimal(binary.substring(0, 8));
    const secondOctet = IPv4.toDecimal(binary.substring(8, 16));
    const thirdOctet = IPv4.toDecimal(binary.substring(16, 24));
    const fourthOctet = IPv4.toDecimal(binary.substring(24, 32));
    return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
  };

  /**
   * @param {string} binary A binary input string
   * @returns {number} Returns decimal
   */
  private static toDecimal = (binary: string): number => parseInt(binary, 2);

  /**
   * @param {string} binHost A binary host
   * @param {number} cidr The cidr number between 1 and 32
   * @returns {string}  Returns a binary network address
   */
  private static calcBinNetwork = (binHost: string, cidr: number): string =>
    binHost.substring(0, cidr) + "0".repeat(IPv4.BITS_IN_IPV4 - cidr);

  /**
   * @param {string} binMask Take a binary mask as input
   * @returns {string} Returns the binary wildcard mask
   */
  private static calcBinWildCardMask = (binMask: string): string =>
    IPv4.calcInverseBit(binMask);

  /**
   * @param {string} binMask Take a binary mask as input
   * @returns {number} Returns the number of usable hosts for the current mask
   */
  private static calcNumberOfUsableHosts = (binMask: string): number => {
    const number = IPv4.toDecimal(IPv4.calcInverseBit(binMask)) - 1;
    return number <= 0 ? 0 : number;
  };

  /**
   * @param {string} bin A binary string
   * @returns {string} Returns the binary input but with bits inversed
   */
  private static calcInverseBit = (bin: string): string =>
    [...bin].map((bit) => (bit === "1" ? "0" : "1")).join("");

  /**
   * @param {number} cidr The CIDR notation between 1 and 32
   * @returns {number} Returns the increment for the next subnet network
   */
  private static calcIncrement = (cidr: number): number =>
    IPv4.OCTET_POSSIBILITIES / 2 ** (cidr % IPv4.BITS_IN_OCTET);

  /**
   * @param {string} binNetwork Take a binary network address string
   * @param {number} cidr Take the CIDR notation number between 1 and 32
   * @returns {string} Returns the broadcast address in binary format
   */
  private static calcBinBroadcast = (
    binNetwork: string,
    cidr: number
  ): string =>
    binNetwork.substring(0, cidr) + "1".repeat(IPv4.BITS_IN_IPV4 - cidr);

  /**
   * @param {string} binNetwork Take the binary network address
   * @returns {string} Returns the first usable address for a host
   */
  private static calcbinFirstAddr = (binNetwork: string): string =>
    binNetwork.substring(0, IPv4.BITS_IN_IPV4 - 1) + "1";

  /**
   * @param {string} binBroadcast Take the binary broadcast address
   * @returns {string} Returns the last usable address for a host
   */
  private static calcbinLastAddr = (binBroadcast: string): string =>
    binBroadcast.substring(0, IPv4.BITS_IN_IPV4 - 1) + "0";

  /**
   * @param {string} binOctet The binary octet that contains the network ID and the host ID.
   * @returns Returns a network neighbour in binary format when CIDR or MASK allows subnet network
   */
  private calcBinNeighbourNetwork = (binOctet: string): string => {
    if (
      this.cidr === undefined ||
      this.netBitsInCurrentOctet === undefined ||
      this.binNetwork === undefined
    ) {
      throw new Error("CIDR or Network Bits are undefined !");
    }
    const floorCidr = this.cidr - this.netBitsInCurrentOctet;
    const floorBinNetwork = IPv4.calcBinNetwork(this.binNetwork, floorCidr);
    return (
      floorBinNetwork.substring(0, floorCidr) +
      binOctet +
      floorBinNetwork.substring(
        floorCidr + IPv4.BITS_IN_OCTET,
        IPv4.BITS_IN_IPV4
      )
    );
  };

  /**
   * @returns {object} Returns all the results in decimal and binary form plus additionnal information
   */
  public getNetworkInfo = (): object => {
    return {
      binHost: this.binHost,
      binMask: this.binMask,
      binWildCardMask: this.binWildCardMask,
      binNetwork: this.binNetwork,
      binBroadcast: this.binBroadcast,
      binFirstAddr: this.binFirstAddr,
      binLastAddr: this.binLastAddr,
      decHost: `${this.decHost.o1}.${this.decHost.o2}.${this.decHost.o3}.${this.decHost.o4}`,
      cidr: this.cidr,
      decMask: IPv4.toDecimalIP(this.binMask!),
      decWildCardMask: IPv4.toDecimalIP(this.binWildCardMask!),
      decNetwork: IPv4.toDecimalIP(this.binNetwork!),
      decBroadcast: IPv4.toDecimalIP(this.binBroadcast!),
      decFirstAddress: IPv4.toDecimalIP(this.binFirstAddr!),
      decLastAddress: IPv4.toDecimalIP(this.binLastAddr!),
      numberOfUsableHosts: this.numberOfUsableHosts,
      increment: this.increment,
      numberOfSubNetworks:
        this.numberOfSubNetworks === 1 ? 0 : this.numberOfSubNetworks,
    };
  };

  /**
   * @returns Returns all the results about the subnet networks in binary and decimal formats
   */
  public getSubNetworksInfo = (): {}[] | null => {
    if (this.numberOfSubNetworks === 1) {
      return null;
    }

    const results = [];
    for (let i = 0; i < this.numberOfSubNetworks!; i++) {
      const binNetwork = this.calcBinNeighbourNetwork(
        IPv4.toBinOctet(i * this.increment!)
      );
      const binBroadcast = IPv4.calcBinBroadcast(this.binNetwork!, this.cidr!);
      const binFirstAddr = IPv4.calcbinFirstAddr(binNetwork);
      const binLastAddr = IPv4.calcbinLastAddr(binBroadcast);

      results.push({
        binNetwork,
        binFirstAddr,
        binLastAddr,
        binBroadcast,
        decNetwork: IPv4.toDecimalIP(binNetwork),
        decFirstAddr: IPv4.toDecimalIP(binFirstAddr),
        decLastAddr: IPv4.toDecimalIP(binLastAddr),
        decBroadcast: IPv4.toDecimalIP(binBroadcast),
      });
    }
    return results;
  };

  /**
   * @returns {object} Returns all the results in binary and decimal formats
   */
  public getAllResults = (): object => {
    return {
      network: this.getNetworkInfo(),
      subNetworks: this.getSubNetworksInfo(),
    };
  };
}
