# ipv4-calc

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org) [![CodeFactor](https://www.codefactor.io/repository/github/alexandre-dos-reis/ipv4-calc/badge)](https://www.codefactor.io/repository/github/alexandre-dos-reis/ipv4-calc) [![codecov](https://codecov.io/gh/alexandre-dos-reis/ipv4-network-calculator/branch/main/graph/badge.svg?token=4HG9MWWFKO)](https://codecov.io/gh/alexandre-dos-reis/ipv4-network-calculator) [![Build Status](https://drone.reges.fr/api/badges/alexandre-dos-reis/ipv4-network-calculator/status.svg?ref=refs/heads/main)](https://drone.reges.fr/alexandre-dos-reis/ipv4-network-calculator)

This library has the intention of providing various informations about IP v4 addresses. Here are some of the features :

- Host, mask, cidr, widlcard, network, broadcast, first and last usable addresses and many more...
- Binary and decimal outputs
- Get also all the informations about sub networks.
- More to come like Class addresses, etc...
- No dependencies !

## TypeScript

The module is written in TypeScript and type definitions files are included.

## Contributing

Contributions, issues and feature requests are welcome!

## Get started

To install as a dependency :

```
npm install ipv4-calc
```

Use it like so :

```js
// Common JS
const { IPv4 } = require('ipv4-calc') 
// Module ES
import { IPv4 } from 'ipv4-calc'

const ip = new IPv4("192.168.0.1/25") // OR new IPv4("192.168.0.1 255.255.255.128")

console.log(ip.getNetworkInfo()); // Should output :
{
  binHost: "11000000101010000000000000000001",
  binMask: "11111111111111111111111110000000",
  binWildCardMask: "00000000000000000000000001111111",
  binNetwork: "11000000101010000000000000000000",
  binBroadcast: "11000000101010000000000001111111",
  binFirstAddr: "11000000101010000000000000000001",
  binLastAddr: "11000000101010000000000001111110",
  decHost: "192.168.0.1",
  cidr: 25,
  decMask: "255.255.255.128",
  decWildCardMask: "0.0.0.127",
  decNetwork: "192.168.0.0",
  decBroadcast: "192.168.0.127",
  decFirstAddress: "192.168.0.1",
  decLastAddress: "192.168.0.126",
  numberOfUsableHosts: 126,
  increment: 128,
  numberOfSubNetworks: 2
}

console.log(ip.getSubNetworksInfo()); // Should output :
[
  {
    binNetwork: "11000000101010000000000000000000",
    binFirstAddr: "11000000101010000000000000000001",
    binLastAddr: "11000000101010000000000001111110",
    binBroadcast: "11000000101010000000000001111111",
    decNetwork: "192.168.0.0",
    decFirstAddr: "192.168.0.1",
    decLastAddr: "192.168.0.126",
    decBroadcast: "192.168.0.127"
  },
  {
    binNetwork: "11000000101010000000000010000000",
    binFirstAddr: "11000000101010000000000010000001",
    binLastAddr: "11000000101010000000000011111110",
    binBroadcast: "11000000101010000000000011111111",
    decNetwork: "192.168.0.128",
    decFirstAddr: "192.168.0.129",
    decLastAddr: "192.168.0.254",
    decBroadcast: "192.168.0.255"
  }
]

// Or get the 2 functions above in 1 call with :
console.log(ip.getAllResults())
```
