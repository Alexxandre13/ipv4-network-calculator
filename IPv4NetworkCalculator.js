'use strict';
/** 
 *  @licence MIT
 * 
 *  @author Alexandre Dos Reis
 * 
 *  @description Allow to calculate IPv4 subnet network informations such as IP network address, brodcast address, number and range of usable hosts and other things.
 */
module.exports = class IPv4 {

    // Constants relative to IPv4 networks
    static BITS_IN_OCTET = 8
    static BITS_IN_IPV4 = 32
    static CIDR_MIN = 1
    static CIDR_MAX = 32
    static OCTET_MIN = 0
    static OCTET_MAX = 255
    static OCTET_POSSIBILITIES = 256

    #decHost; #decMask; #cidr;
    #binMask; #binHost; #binNetwork; #binBroadcast; #binFirstAddr; #binLastAddr; #binWildCardMask; 
    #numberOfUsableHosts; #increment; #netBitsInCurrentOctet; #numberOfSubNetworks

    /**
     * @param {string} hostAddr - An IP address in cidr or mask format - '192.168.1.1/24' or '192.168.1.1 255.255.255.0'
     */
    constructor(hostAddr) {
        const octets = hostAddr.replace(/(\.|\/| )/g, '.').split('.');

        // Host object
        this.#decHost = { o1: octets[0], o2: octets[1], o3: octets[2], o4: octets[3] }
        try { IPv4.#checkIp(this.#decHost) } catch (e) { console.log(e); return }

        if (octets.length === 5) {

            // CIDR NOTATION
            this.#cidr = Number(octets[4])
            try { IPv4.#checkRangeAndIsNan('CIDR', this.#cidr, IPv4.CIDR_MIN, IPv4.CIDR_MAX) } catch (e) { console.log(e); return }
            this.#binMask = IPv4.#cidrToBinMask(this.#cidr)

        } else if (octets.length === 8) {

            // MASK NOTATION
            this.#decMask = { o1: octets[4], o2: octets[5], o3: octets[6], o4: octets[7] }
            try { IPv4.#checkIp(this.#decMask) } catch (e) { console.log(e); return }
            // TO ADD : CHeck if mask is valid
            this.#binMask = IPv4.#decIPtoBinIP(this.#decMask)
            this.#cidr = IPv4.#binMasktoCidr(this.#binMask)

        } else {
            throw new Error("The host input isn't valid, must be like : '192.168.0.1/24' or '192.168.0.1 255.255.255.0'")
        }

        // Binary calculation
        this.#binHost = IPv4.#decIPtoBinIP(this.#decHost)
        this.#binNetwork = IPv4.#calcBinNetwork(this.#binHost, this.#cidr)
        this.#binBroadcast = IPv4.#calcBinBroadcast(this.#binNetwork, this.#cidr)
        this.#binFirstAddr = IPv4.#calcbinFirstAddr(this.#binNetwork)
        this.#binLastAddr = IPv4.#calcbinLastAddr(this.#binBroadcast)
        this.#binWildCardMask = IPv4.#calcBinWildCardMask(this.#binMask)

        // Additionnal informations
        this.#numberOfUsableHosts = IPv4.#calcNumberOfUsableHosts(this.#binMask)
        this.#increment = IPv4.#calcIncrement(this.#cidr)
        this.#netBitsInCurrentOctet = this.#cidr % IPv4.BITS_IN_OCTET
        this.#numberOfSubNetworks = 2 ** this.#netBitsInCurrentOctet
    }

    /**
     * Used to check if an IP object is valid
     * @param {object} Ip
     * @param {number} Ip.o1 The first octet
     * @param {number} Ip.o2 The second octet
     * @param {number} Ip.o3 The third octet
     * @param {number} Ip.o4 The fourth octet
     */
    static #checkIp = ip => Object.values(ip).map(octet => IPv4.#checkRangeAndIsNan('Value', octet, IPv4.OCTET_MIN, IPv4.OCTET_MAX))

    /**
     * Check if value is within the range and is a number type.
     * @param {*} name Name of the value
     * @param {*} value The value itself
     * @param {*} min The min value
     * @param {*} max The max value
     * @throws {Error} RangeError or TypeError
     */
    static #checkRangeAndIsNan = (name, value, min, max) => {
        if (name < min || name > max) {
            throw new RangeError(`${name}: ${value} is out of range ! It must be between ${min} and ${max}.`)
        }
        if (isNaN(value)) {
            throw new TypeError(`${name}: ${value} is not a number ! It must be between ${min} and ${max}.`)
        }
    }

    /**
     * @param {object} decimalBytes Take the object with the four bytes 
     * @returns {string} Returns the four bytes into a single binary string that keeps 0
     */
    static #decIPtoBinIP = decOctets => String(
        IPv4.#toBinOctet(decOctets.o1) +
        IPv4.#toBinOctet(decOctets.o2) +
        IPv4.#toBinOctet(decOctets.o3) +
        IPv4.#toBinOctet(decOctets.o4)
    )

    /**
     * @param {number} decOctet A decimal octet number
     * @returns {string} Returns a binary byte string.
     */
    static #toBinOctet = decOctet => {
        const binary = (decOctet >>> 0).toString(2)
        return String('0'.repeat(IPv4.BITS_IN_OCTET - binary.length) + binary)
    }

    /**
     * @param {string} binMask - The mask in binary form
     * @returns {number} Returns the cidr notation in number format
     */
    static #binMasktoCidr = binMask => [...binMask].filter(bit => bit === '1').length

    /**
     * @param {number} cidr Take a number between 1 and 32.
     * @returns {string} Returns a binary byte string mask.
     */
    static #cidrToBinMask = cidr => String('1'.repeat(cidr) + '0'.repeat(IPv4.BITS_IN_IPV4 - cidr))

    /**
     * @param {string} binary The full binary string - 32 characters
     * @returns {object} returns an object containing four keys corresponding to the 4 octets
     */
    static #toDecimalIP = binary => {
        const firstOctet = IPv4.#toDecimal(binary.substring(0, 8))
        const secondOctet = IPv4.#toDecimal(binary.substring(8, 16))
        const thirdOctet = IPv4.#toDecimal(binary.substring(16, 24))
        const fourthOctet = IPv4.#toDecimal(binary.substring(24, 32))
        return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`
    }

    /**
     * @param {string} binary A binary input string
     * @returns {number} Returns decimal
     */
    static #toDecimal = binary => Number(parseInt(binary, 2))

    // static #toBinary = decimal => Strin

    /**
     * @param {string} binHost A binary host
     * @param {number} cidr The cidr number between 1 and 32
     * @returns {string}  Returns a binary network address
     */
    static #calcBinNetwork = (binHost, cidr) => String(binHost.substring(0, cidr) + '0'.repeat(IPv4.BITS_IN_IPV4 - cidr))

    /**
     * @param {string} binMask Take a binary mask as input
     * @returns {string} Returns the binary wildcard mask
     */
    static #calcBinWildCardMask = binMask => String(IPv4.#calcInverseBit(binMask))

    /**
     * @param {string} binMask Take a binary mask as input
     * @returns {number} Returns the number of usable hosts for the current mask
     */
    static #calcNumberOfUsableHosts = binMask => {
        const number = Number(IPv4.#toDecimal(IPv4.#calcInverseBit(binMask)) - 1)
        return number <= 0 ? 0 : number
    }

    /**
     * @param {string} bin A binary string
     * @returns {string} Returns the binary input but with bits inversed
     */
    static #calcInverseBit = bin => String([...bin].map(bit => bit === '1' ? '0' : '1').join(''))

    /**
     * @param {number} cidr The CIDR notation between 1 and 32
     * @returns {number} Returns the increment for the next subnet network
     */
    static #calcIncrement = cidr => Number(IPv4.OCTET_POSSIBILITIES / 2 ** (cidr % IPv4.BITS_IN_OCTET))

    /**
     * @param {string} binNetwork Take a binary network address string
     * @param {number} cidr Take the CIDR notation number between 1 and 32
     * @returns {string} Returns the broadcast address in binary format
     */
    static #calcBinBroadcast = (binNetwork, cidr) => {
        return String(binNetwork.substring(0, cidr) + '1'.repeat(IPv4.BITS_IN_IPV4 - cidr))
    }

    /**
     * @param {string} binNetwork Take the binary network address
     * @returns {string} Returns the first usable address for a host
     */
    static #calcbinFirstAddr = binNetwork => String(binNetwork.substring(0, IPv4.BITS_IN_IPV4 - 1) + '1')


    /**
     * @param {string} binBroadcast Take the binary broadcast address
     * @returns {string} Returns the last usable address for a host
     */
    static #calcbinLastAddr = binBroadcast => String(binBroadcast.substring(0, IPv4.BITS_IN_IPV4 - 1) + '0')

    /**
     * @param {string} binOctet The binary octet that contains the network ID and the host ID.
     * @returns Returns a network neighbour in binary format when CIDR or MASK allows subnet network
     */
     #calcBinNeighbourNetwork = binOctet => {
        const floorCidr = this.#cidr - this.#netBitsInCurrentOctet
        const floorBinNetwork = IPv4.#calcBinNetwork(this.#binNetwork, floorCidr)
        return floorBinNetwork.substring(0, floorCidr)
            + binOctet
            + floorBinNetwork.substring(floorCidr + IPv4.BITS_IN_OCTET, IPv4.BITS_IN_IPV4)
    }

    /**
     * @returns {object} Returns all the results in decimal and binary form plus additionnal information
     */
    getNetworkInfo = () => {
        return {
            binHost: this.#binHost,
            binMask: this.#binMask,
            binWildCardMask: this.#binWildCardMask,
            binNetwork: this.#binNetwork,
            binBroadcast: this.#binBroadcast,
            binFirstAddr: this.#binFirstAddr,
            binLastAddr: this.#binLastAddr,
            decHost: `${this.#decHost.o1}.${this.#decHost.o2}.${this.#decHost.o3}.${this.#decHost.o4}`,
            cidr: this.#cidr,
            decMask: IPv4.#toDecimalIP(this.#binMask),
            decWildCardMask: IPv4.#toDecimalIP(this.#binWildCardMask),
            decNetwork: IPv4.#toDecimalIP(this.#binNetwork),
            decBroadcast: IPv4.#toDecimalIP(this.#binBroadcast),
            decFirstAddress: IPv4.#toDecimalIP(this.#binFirstAddr),
            decLastAddress: IPv4.#toDecimalIP(this.#binLastAddr),
            numberOfUsableHosts: this.#numberOfUsableHosts,
            increment: this.#increment,
            numberOfSubNetworks: this.#numberOfSubNetworks === 1 ? 0 : this.#numberOfSubNetworks
        }
    }

    /**
     * @returns Returns all the results about the subnet networks in binary and decimal formats
     */
     getSubNetworksInfo = () => {
        if (this.#numberOfSubNetworks === 1) { return null }

        const results = []
        for (let i = 0; i < this.#numberOfSubNetworks; i++) {

            const binNetwork = this.#calcBinNeighbourNetwork(IPv4.#toBinOctet(i * this.#increment))
            const binBroadcast = IPv4.#calcBinBroadcast(this.#binNetwork, this.#cidr)
            const binFirstAddr = IPv4.#calcbinFirstAddr(binNetwork)
            const binLastAddr = IPv4.#calcbinLastAddr(binBroadcast)

            results.push({
                binNetwork,
                binFirstAddr,
                binLastAddr,
                binBroadcast,
                decNetwork: IPv4.#toDecimalIP(binNetwork),
                decFirstAddr: IPv4.#toDecimalIP(binFirstAddr),
                decLastAddr: IPv4.#toDecimalIP(binLastAddr),
                decBroadcast: IPv4.#toDecimalIP(binBroadcast),
            })
        }
        return results
    }

    /**
     * @returns {object} Returns all the results in binary and decimal formats
     */
     getAllResults = () => {
         return {
            network: this.getNetworkInfo(),
            subNetworks: this.getSubNetworksInfo()
         }
     }

}