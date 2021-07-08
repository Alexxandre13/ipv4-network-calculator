const IPv4 = require('./IPv4NetworkCalculator')

const classC = new IPv4('192.168.26.1/26')

console.log(classC.getAllResults())
console.log(classC.getSubNetworks())

const classB = new IPv4('172.16.5.54 255.255.0.0')

console.log(classB.getDecimalResults())
console.log(classB.getBinaryResults())
