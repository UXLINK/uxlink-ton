import { toNano } from "@ton/ton";

export const isTest = false; // 是否是测试网络

export const tokenParams = {
  name: "UXLINK Token",
  description: "UXLINK Governance Token, $UXLINK is to realize governance and capture benefits from UXLINK project and products.",
  symbol: "UXLINK",
  image: "https://avatars.githubusercontent.com/u/104382459?s=200&v=4",
}

export const deployParams = {
  isTest: isTest, // 网络环境
  token_max_supply: toNano(1000000000), // 最大供应量 10亿
}