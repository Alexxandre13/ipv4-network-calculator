const { IPv4 } = require('./dist/IPv4')

const ip = new IPv4('192.168.0.1/25') // OR new IPv4("192.168.0.1 255.255.255.128")

console.log(ip.getNetworkInfo())
console.log(ip.getSubNetworksInfo())
