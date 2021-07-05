/**
 * Allow to calculate IPv4 subnet network informations such as the IP network address, the brodcast address, the number and range of usable hosts.  
 */
 module.exports = class IPv4Calc {

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

        // Binary results
        this.binHost = this.decBytesToBinBytes(this.decHost)
        this.binMask = this.cidrToBinMask(this.cidr)
        this.binNetwork = this.calcBinNetwork(this.binHost, this.cidr)
        this.binBroadcast = this.calcBinBroadcast(this.binNetwork, this.cidr)
        this.binFirstAddress = this.calcBinFirstAddress(this.binNetwork)
        this.binLastAddress = this.calcBinLastAddress(this.binBroadcast)
        this.binWildCardMask = this.calcBinWildCardMask(this.binMask)

        // Decimal results
        this.decNetwork = this.toDecBytes(this.binNetwork)
        this.decMask = this.toDecBytes(this.binMask)
        this.decBroadcast = this.toDecBytes(this.binBroadcast)
        this.decFirstAddress = this.toDecBytes(this.binFirstAddress)
        this.decLastAddress = this.toDecBytes(this.binLastAddress)
        this.decWildCardMask = this.toDecBytes(this.binWildCardMask)

        // Additionnal Results
        this.numberOfUsableHosts = this.calcNumberOfUsableHosts(this.binMask)
        this.increment = this.calcIncrement(this.cidr)
    }

    /**
     * @param {object} decimalBytes Take the object with the four bytes 
     * @returns {string} Returns the four bytes into a single binary string that keeps 0
     */
    decBytesToBinBytes = decBytes => String(
        this.toBinByte(decBytes.b1) +
        this.toBinByte(decBytes.b2) +
        this.toBinByte(decBytes.b3) +
        this.toBinByte(decBytes.b4)
    )

    /**
     * @param {number} decByte A decimal byte number
     * @returns {string} Returns a binary byte string.
     */
    toBinByte = decByte => {
        const binary = (decByte >>> 0).toString(2)
        return String('0'.repeat(IPv4Calc.BITS_IN_BYTE - binary.length) + binary)
    }

    /**
     * @param {number} cidr Take a number between 1 and 32.
     * @returns Returns a binary byte string mask.
     */
    cidrToBinMask = cidr => String('1'.repeat(cidr) + '0'.repeat(IPv4Calc.BITS_IN_IPV4 - cidr))

    /**
     * @param {string} binary The full binary string - 32 characters
     * @returns {object} returns an object containing four keys corresponding to the 4 bytes
     */
    toDecBytes = binary => {
        return {
            b1: this.toDecimal(binary.substring(0, 8)),
            b2: this.toDecimal(binary.substring(8, 16)),
            b3: this.toDecimal(binary.substring(16, 24)),
            b4: this.toDecimal(binary.substring(24, 32))
        }
    }

    /**
     * @param {string} binary A binary input string
     * @returns {number} Returns decimal
     */
    toDecimal = binary => parseInt(binary, 2)

    /**
     * @param {string} binHost A binary host
     * @param {number} cidr The cidr number between 1 and 32
     * @returns {string}  Returns a binary network address
     */
    calcBinNetwork = (binHost, cidr) => String(binHost.substring(0, cidr) + '0'.repeat(IPv4Calc.BITS_IN_IPV4 - cidr))

    /**
     * @param {string} binMask Take a binary mask as input
     * @returns {string} Returns the binary wildcard mask
     */
    calcBinWildCardMask = binMask => String(this.calcInverseBit(binMask))

    /**
     * @param {string} binMask Take a binary mask as input
     * @returns {number} Returns the number of usable hosts for the current mask
     */
    calcNumberOfUsableHosts = binMask => this.toDecimal(this.calcInverseBit(binMask)) - 1

    
    /**
     * @param {string} bin A binary string
     * @returns {string} Returns the binary input but with bits inversed
     */
    calcInverseBit = bin => String([...bin].map(bit => bit === '1' ? '0' : '1').join(''))


    /**
     * @param {number} cidr The CIDR notation between 1 and 32
     * @returns {number} Returns the increment for the next subnet network
     */
    calcIncrement = cidr => IPv4Calc.BYTE_POSSIBILITIES / 2 ** (cidr % IPv4Calc.BITS_IN_BYTE)

    /**
     * @param {string} binNetwork Take a binary network address string
     * @param {number} cidr Take the CIDR notation number between 1 and 32
     * @returns {string} Returns the broadcast address in binary format
     */
    calcBinBroadcast = (binNetwork, cidr) => {
        return String(binNetwork.substring(0, cidr) + '1'.repeat(IPv4Calc.BITS_IN_IPV4 - cidr))
    }

    /**
     * @param {string} binNetwork Take the binary network address
     * @returns {string} Returns the first usable address for a host
     */
    calcBinFirstAddress = binNetwork => String(binNetwork.substring(0, IPv4Calc.BITS_IN_IPV4 - 1) + '1')

    
    /**
     * @param {string} binBroadcast Take the binary broadcast address
     * @returns {string} Returns the last usable address for a host
     */
    calcBinLastAddress = binBroadcast => String(binBroadcast.substring(0, IPv4Calc.BITS_IN_IPV4 - 1) + '0')

    getAllResults = () => {
        return {
            binHost: this.binHost,
            binMask: this.binMask,
            binWildCardMask: this.binWildCardMask,
            binNetwork: this.binNetwork,
            binBroadcast: this.binBroadcast,
            binFirstAddress: this.binFirstAddress,
            binLastAddress: this.binLastAddress,
            decHost: this.decHost,
            decMask: this.decMask,
            decWildCardMask: this.decWildCardMask,
            decNetwork: this.decNetwork,
            decBroadcast: this.decBroadcast,
            decFirstAddress: this.decFirstAddress,
            decLastAddress: this.decLastAddress,
            cidr: this.cidr,
            numberOfUsableHosts: this.numberOfUsableHosts,
            increment: this.increment
        }
    }
}