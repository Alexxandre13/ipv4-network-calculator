
/**
 * Allow to calculate IPv4 subnet network informations such as the IP network address, the brodcast address, the number and range of usable hosts.  
 */
class IPv4PrivateNetworkCalculator {

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
        this.binMask = this.cidrToBinary(this.cidr)
        this.binNetwork = this.calcBinNetwork(this.binHost, this.cidr)
        this.binBroadcast = this.calcBinBroadcast(this.binNetwork, this.cidr)
        this.binFirstAddress = this.calcFirstAddress(this.binNetwork)
        this.binLastAddress = this.calcLastAddress(this.binBroadcast)

        // Decimal results
        this.decNetwork = this.ToDecBytes(this.binNetwork)
        this.decMask = this.ToDecBytes(this.binMask)
        this.decBroadcast = this.ToDecBytes(this.binBroadcast)
        this.decFirstAddress = this.ToDecBytes(this.binFirstAddress)
        this.decLastAddress = this.ToDecBytes(this.binLastAddress)

        // Others Results
        this.numberOfUsableHosts = this.calcNumberOfUsableHosts(this.binMask)
        this.increment = this.calcIncrement(this.cidr)
    }

    /**
     * @param {object} decimalBytes Take the object with the four bytes 
     * @returns {string} Returns the four bytes into one single binary string that keeps 0
     */
    decBytesToBinBytes = decimalBytes => {
        let binaryString = ''
        Object.values(decimalBytes).map(byte => { binaryString += this.toBinary(byte) })
        return String(binaryString)
    }

    /**
     * @param {number} decimal A decimal number
     * @returns {string} Returns the converted number into a binary string.
     */
    toBinary = decimal => {
        let binary = (decimal >>> 0).toString(2)
        if (binary.length < 8) {
            const numberOfIteration = 8 - binary.length
            for (let i = 0; i < numberOfIteration; i++) {
                binary = '0' + binary
            }
        }
        return String(binary)
    }

    /**
     * @param {number} cidr 
     * @returns Returns the cidr number into a full binary string - 32 characters.
     */
    cidrToBinary = cidr => String('1'.repeat(cidr) + '0'.repeat(32 - cidr))

    /**
     * @param {string} binary The full binary string - 32 characters
     * @returns {object} returns an object containing four keys corresponding to the 4 bytes
     */
    ToDecBytes = binary => {
        return {
            b1: this.toDecimal(binary.substring(0, 8)),
            b2: this.toDecimal(binary.substring(8, 16)),
            b3: this.toDecimal(binary.substring(16, 24)),
            b4: this.toDecimal(binary.substring(24, 32))
        }
    }

    /**
     * @param {string} binary 
     * @returns {number} Returns the input binary number into decimal
     */
    toDecimal = binary => parseInt(binary, 2)

    calcBinNetwork = (binHost, cidr) => binHost.substring(0, cidr) + '0'.repeat(32 - cidr)

    calcNumberOfUsableHosts = bin => this.toDecimal([...bin].map(bit => bit === '1' ? '0' : '1').join('')) - 1

    calcIncrement = cidr => 256 / 2 ** (cidr % 8)

    calcBinBroadcast = (binNetwork, cidr) => binNetwork.substring(0, cidr) + '1'.repeat(32 - cidr)

    calcFirstAddress = binNetwork => binNetwork.substring(0, 31) + '1'

    calcLastAddress = binBroadcast => binBroadcast.substring(0, 31) + '0'

    getAllResults = () => {
        return {
            binHost: this.binHost,
            binMask: this.binMask,
            binNetwork: this.binNetwork,
            binBroadcast: this.binBroadcast,
            binFirstAddress: this.binFirstAddress,
            binLastAddress: this.binLastAddress,
            decHost: this.decHost,
            decMask: this.decMask,
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

// const IPv4Calc = new IPv4PrivateNetworkCalculator({ b1: 192, b2: 168, b3: 0, b4: 1 }, 18)

// console.log(IPv4Calc.getAllResults())