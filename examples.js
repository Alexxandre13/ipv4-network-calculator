const IPv4 = require('./IPv4NetworkCalculator')

const classC = new IPv4('192.168.26.1/26')

console.log(classC.getSubNetworksInfo())