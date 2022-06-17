# ipv4-network-calculator

[![CodeFactor](https://www.codefactor.io/repository/github/alexandre-dos-reis/ipv4-network-calculator/badge)](https://www.codefactor.io/repository/github/alexandre-dos-reis/ipv4-network-calculator)

**!! This lib is under construction !!**

This library has the intention of providing various informations about IP v4 addresses. Here are some of the features :

- Host, mask, cidr, widlcard, network, broadcast, first usable address, last usable address and many more...
- Binary and decimal outputs
- Get also all the informations about sub networks.
- More to come...

## Get started

This library is intended to be use this way :

```js
const ip = new IPv4("192.168.0.1/24"); // OR new IPv4("192.168.0.1 255.255.255.128")

console.log(ip.getNetworkInfo());
// {
//     binHost: '11000000101010000000000000000001',
//     binMask: '11111111111111111111111110000000',
//     binWildCardMask: '00000000000000000000000001111111',
//     binNetwork: '11000000101010000000000000000000',
//     binBroadcast: '11000000101010000000000001111111',
//     binFirstAddr: '11000000101010000000000000000001',
//     binLastAddr: '11000000101010000000000001111110',
//     decHost: '192.168.0.1',
//     cidr: 25,
//     decMask: '255.255.255.128',
//     decWildCardMask: '0.0.0.127',
//     decNetwork: '192.168.0.0',
//     decBroadcast: '192.168.0.127',
//     decFirstAddress: '192.168.0.1',
//     decLastAddress: '192.168.0.126',
//     numberOfUsableHosts: 126,
//     increment: 128,
//     numberOfSubNetworks: 2
// }

console.log(ip.getSubNetworksInfo());

// [
//     {
//         binNetwork: '11000000101010000000000000000000',
//         binFirstAddr: '11000000101010000000000000000001',
//         binLastAddr: '11000000101010000000000001111110',
//         binBroadcast: '11000000101010000000000001111111',
//         decNetwork: '192.168.0.0',
//         decFirstAddr: '192.168.0.1',
//         decLastAddr: '192.168.0.126',
//         decBroadcast: '192.168.0.127'
//     },
//     {
//         binNetwork: '11000000101010000000000010000000',
//         binFirstAddr: '11000000101010000000000010000001',
//         binLastAddr: '11000000101010000000000001111110',
//         binBroadcast: '11000000101010000000000001111111',
//         decNetwork: '192.168.0.128',
//         decFirstAddr: '192.168.0.129',
//         decLastAddr: '192.168.0.126',
//         decBroadcast: '192.168.0.127'
//     }
// ]

```
