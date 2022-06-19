// Common JS
const { IPv4 } = require('ipv4-calc') 
// Module ES
import { IPv4 } from 'ipv4-calc'

const ip = new IPv4('192.168.0.1/25') // OR new IPv4("192.168.0.1 255.255.255.128")

console.log(ip.getNetworkInfo())
console.log(ip.getSubNetworksInfo())
console.log(ip.getAllResults())
