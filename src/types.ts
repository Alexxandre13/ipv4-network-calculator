export interface iIPv4 {
  o1: number
  o2: number
  o3: number
  o4: number
}

export interface iClass {
  class: 'A' | 'B' | 'C' | 'D' | 'E'
}

export interface iNetworkInfo {
  binHost: string
  binMask: string
  binWildCardMask: string
  binNetwork: string
  binBroadcast: string
  binFirstAddr: string
  binLastAddr: string
  decHost: string
  cidr: number
  decMask: string
  decWildCardMask: string
  decNetwork: string
  decBroadcast: string
  decFirstAddress: string
  decLastAddress: string
  numberOfUsableHosts: number
  increment: number
  numberOfSubNetworks: number
}

export interface iSubNetworkInfo {
  binNetwork: string
  binFirstAddr: string
  binLastAddr: string
  binBroadcast: string
  decNetwork: string
  decFirstAddr: string
  decLastAddr: string
  decBroadcast: string
}
