import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, WalletContractV5R1,  internal, fromNano, Address } from "@ton/ton";
import { mnemonicToPrivateKey } from "ton-crypto";
import { UxlinkJetton, storeMint, Mint } from "../output/UxlinkJetton_UxlinkJetton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";
import * as dotenv from "dotenv";
import { contractAddressConfig, deployParams, mintParams, tokenParams } from "./config";
dotenv.config();

(async () => {
    let testnet = mintParams.isTest;
    console.log("Network: ", testnet ? "testnet" : "mainnet");

    //create client for testnet sandboxv4 API - alternative endpoint
    const endpoint = await getHttpV4Endpoint({
        network: testnet ? "testnet" : "mainnet",
      });
    const client4 = new TonClient4({
        endpoint,
    });
    let mnemonics = (process.env.mnemonics || "").toString();
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.
    // let deployer_wallet = WalletContractV5R1.create({ publicKey: keyPair.publicKey });
    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    console.log("deployer_wallet.address: ", deployer_wallet.address);


    let deployer_wallet_contract = client4.open(deployer_wallet);
    const walletSender = deployer_wallet_contract.sender(secretKey);
    const address_str = testnet ? contractAddressConfig.testnet : contractAddressConfig.mainnet;
    const contract_address = Address.parse(address_str);
    console.log("contract_address（jetton_master）：", contract_address);
    let contract = await UxlinkJetton.fromAddress(contract_address);
    let contract_open = await client4.open(contract);
    const mintAmount = mintParams.amount;
    const Mint: Mint = {
        $$type: "Mint",
        amount: mintAmount,
        receiver: Address.parse(mintParams.receiver_address),
    };
    await contract_open.send(walletSender, { value: toNano(0.5) }, Mint);
})();

