import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, internal, fromNano, Address, WalletContractV5R1 } from "@ton/ton";
import { mnemonicToPrivateKey } from "ton-crypto";
import { UxlinkJetton, storeMint, Mint, UpdateOwnerAddress } from "../output/UxlinkJetton_UxlinkJetton";
import * as dotenv from "dotenv";
import { contractAddressConfig, deployParams, isTest, mintParams, tokenParams } from "./config";
dotenv.config();

(async () => {
    let testnet = isTest;
    console.log("Network: ", testnet ? "testnet" : "mainnet");

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: testnet ? "https://sandbox-v4.tonhubapi.com" : "https://mainnet-v4.tonhubapi.com",
    });
    let mnemonics = (process.env.mnemonics || "").toString();
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    // let deployer_wallet = WalletContractV5R1.create({ publicKey: keyPair.publicKey });
    
    console.log("deployer_wallet.address: ", deployer_wallet.address);

    let deployer_wallet_contract = client4.open(deployer_wallet);
    const walletSender = deployer_wallet_contract.sender(secretKey);

    const address_str = testnet ? contractAddressConfig.testnet : contractAddressConfig.mainnet;
    const contract_address = Address.parse(address_str);
    console.log("contract_address（jetton_master）：", contract_address);
    let contract = await UxlinkJetton.fromAddress(contract_address);
    let contract_open = await client4.open(contract);

    // send Mint message
    // await contract_open.send(walletSender, { value: toNano(1) }, "Mint:100");
    const UpdateOwnerAddress: UpdateOwnerAddress = {
        $$type: "UpdateOwnerAddress",
        address: Address.parse("EQBsestcbGavIyp27nDxFWtG7Yt7-sagkeLs--9rS3aVpReT"),
    };
    await contract_open.send(walletSender, { value: toNano(0.1) }, UpdateOwnerAddress);


})();
