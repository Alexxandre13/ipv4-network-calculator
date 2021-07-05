const IPv4 = require('./IPv4Calc')

console.log(new IPv4({ b1: 172, b2: 16, b3: 145, b4: 11 }, 24).getAllResults())