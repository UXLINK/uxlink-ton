import { toNano } from "@ton/ton";

export const isTest = false;

export const tokenParams = {
  name: "UXLINK Token",
  description: "UXLINK Governance Token, $UXLINK is to realize governance and capture benefits from UXLINK project and products.",
  symbol: "UXLINK",
  image: "https://avatars.githubusercontent.com/u/104382459?s=200&v=4",
}

export const contractAddressConfig = {
  mainnet: "EQCLkV7L4e-Huokhm-UVILXwB1L6AaM1OTwNE_RjYVH1uGDs",
  testnet: "kQC_FyxnQCNq5mR_5YtDDh3-PwVBdT9641a1ZqK6KJ_WPriG",
}

export const deployParams = {
  isTest: isTest,
  token_max_supply: toNano(1000000000),
}

export const mintParams = {
  isTest: isTest,
  amount: toNano(10000),
  receiver_address: "EQBQnRwXb5wjaTog9QkKNTe3W6nJCax4984Hd0t8KrNrXn6j",
}

export const transferParams = {
  isTest: isTest,
  amount: toNano(1000),
  receiver_address: "0QA0nHSSV_2XDpdpV10vT22gVOyAZRwZDoOpzaMLB65PKO_x",
  transferMessage: "Hello~~",
}

export const burnParams = {
  isTest: isTest,
  amount: toNano(1000),
}
