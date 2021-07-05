const IPv4Calc = require('./IPv4Calc')

console.log(new IPv4Calc({ b1: 172, b2: 16, b3: 145, b4: 11 }, 16).getAllResults())