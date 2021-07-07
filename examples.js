const IPv4calculator = require('./IPv4NetworkCalculator')

const IPv4 = new IPv4calculator('192.168.26.1/27')

console.log(IPv4.getDecimalResults())
console.log(IPv4.getSubNetworks())