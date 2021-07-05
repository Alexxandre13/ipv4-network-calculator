/**
 * Allow to calculate IPv4 subnet network informations such as the IP network address, the brodcast address, the number and range of usable hosts.  
 */
module.exports = class IPv4 {

    // Static constants relative to IPv4 networks
    static BITS_IN_BYTE = 8
    static BITS_IN_IPV4 = 32
    static BYTE_POSSIBILITIES = 256

    /**
     * @param {object} decHost An object with the four decimals bytes
     * @param {number} decHost.b1 The first byte
     * @param {number} decHost.b2 The second byte
     * @param {number} decHost.b3 The third byte
     * @param {number} decHost.b4 The fourth byte
     * @param {number} cidr The CIDR number representing the mask, must be comprise between 1 and 32
     */
    constructor(decHost, cidr) {
        // Input needed
        this.decHost = decHost
        this.cidr = cidr

        // Binary calculation
        this.binHost = IPv4.#decBytesToBinBytes(this.decHost)
        this.binMask = IPv4.#cidrToBinMask(this.cidr)
        this.binNetwork = IPv4.#calcBinNetwork(this.binHost, this.cidr)
        this.binBroadcast = IPv4.#calcBinBroadcast(this.binNetwork, this.cidr)
        this.binFirstAddress = IPv4.#calcBinFirstAddress(this.binNetwork)
        this.binLastAddress = IPv4.#calcBinLastAddress(this.binBroadcast)
        this.binWildCardMask = IPv4.#calcBinWildCardMask(this.binMask)

        // Additionnal calculation
        this.numberOfUsableHosts = IPv4.#calcNumberOfUsableHosts(this.binMask)
        this.increment = IPv4.#calcIncrement(this.cidr)
    }

    /**
     * @param {object} decimalBytes Take the object with the four bytes 
     * @returns {string} Returns the four bytes into a single binary string that keeps 0
     */
    static #decBytesToBinBytes = decBytes => String(
        IPv4.#toBinByte(decBytes.b1) +
        IPv4.#toBinByte(decBytes.b2) +
        IPv4.#toBinByte(decBytes.b3) +
        IPv4.#toBinByte(decBytes.b4)
    )

    /**
     * @param {number} decByte A decimal byte number
     * @returns {string} Returns a binary byte string.
     */
    static #toBinByte = decByte => {
        const binary = (decByte >>> 0).toString(2)
        return String('0'.repeat(IPv4.BITS_IN_BYTE - binary.length) + binary)
    }

    /**
     * @param {number} cidr Take a number between 1 and 32.
     * @returns {string} Returns a binary byte string mask.
     */
    static #cidrToBinMask = cidr => String('1'.repeat(cidr) + '0'.repeat(IPv4.BITS_IN_IPV4 - cidr))

    /**
     * @param {string} binary The full binary string - 32 characters
     * @returns {object} returns an object containing four keys corresponding to the 4 bytes
     */
    static #toDecBytes = binary => {
        const firstByte = IPv4.#toDecimal(binary.substring(0, 8))
        const secondByte = IPv4.#toDecimal(binary.substring(8, 16))
        const thirdByte = IPv4.#toDecimal(binary.substring(16, 24))
        const fourthByte = IPv4.#toDecimal(binary.substring(24, 32))
        return `${firstByte}.${secondByte}.${thirdByte}.${fourthByte}`
    }

    /**
     * @param {string} binary A binary input string
     * @returns {number} Returns decimal
     */
    static #toDecimal = binary => Number(parseInt(binary, 2))

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
    static #calcIncrement = cidr => Number(IPv4.BYTE_POSSIBILITIES / 2 ** (cidr % IPv4.BITS_IN_BYTE))

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
    static #calcBinFirstAddress = binNetwork => String(binNetwork.substring(0, IPv4.BITS_IN_IPV4 - 1) + '1')


    /**
     * @param {string} binBroadcast Take the binary broadcast address
     * @returns {string} Returns the last usable address for a host
     */
    static #calcBinLastAddress = binBroadcast => String(binBroadcast.substring(0, IPv4.BITS_IN_IPV4 - 1) + '0')

    /**
     * @returns {object} Returns all the results in decimal form plus additionnal information
     */
    getDecimalResults = () => {
        return {
            decHost: `${this.decHost.b1}.${this.decHost.b2}.${this.decHost.b3}.${this.decHost.b4}`,
            decMask: IPv4.#toDecBytes(this.binMask),
            decNetwork: IPv4.#toDecBytes(this.binNetwork),
            decWildCardMask: IPv4.#toDecBytes(this.binWildCardMask),
            decBroadcast: IPv4.#toDecBytes(this.binBroadcast),
            decFirstAddress: IPv4.#toDecBytes(this.binFirstAddress),
            decLastAddress: IPv4.#toDecBytes(this.binLastAddress),
            cidr: this.cidr,
            numberOfUsableHosts: this.numberOfUsableHosts,
            increment: this.increment
        }
    }

    /**
     * @returns {object} Returns all the results in binary form
     */
    getBinaryResults = () => {
        return {
            binHost: this.binHost,
            binMask: this.binMask,
            binWildCardMask: this.binWildCardMask,
            binNetwork: this.binNetwork,
            binBroadcast: this.binBroadcast,
            binFirstAddress: this.binFirstAddress,
            binLastAddress: this.binLastAddress
        }
    }

    /**
     * @returns {object} Returns all the results in binary and decimal form
     */
    getAllResults = () => Object.assign(this.getDecimalResults(), this.getBinaryResults());
}