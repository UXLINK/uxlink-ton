import { Address, beginCell, contractAddress, toNano, TonClient4, internal, fromNano, WalletContractV4, WalletContractV5R1, SendMode } from "@ton/ton";
import {  printSeparator } from "../utils/print";
import { mnemonicToPrivateKey } from "ton-crypto";
import * as dotenv from "dotenv";
dotenv.config();
import { UxlinkJetton, storeTokenTransfer, storeTokenBurn } from "../output/UxlinkJetton_UxlinkJetton";
import { burnParams, contractAddressConfig, deployParams, tokenParams, transferParams } from "./config";

(async () => {
    let testnet = burnParams.isTest;
    console.log("NetWork: ", testnet ? "testnet" : "mainnet");
    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: testnet ? "https://sandbox-v4.tonhubapi.com" : "https://mainnet-v4.tonhubapi.com",
    });
    let mnemonics = (process.env.mnemonics || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.
    
    // let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let deployer_wallet = WalletContractV5R1.create({ publicKey: keyPair.publicKey });

    console.log("deployer_wallet.address: ", deployer_wallet.address);

    let deployer_wallet_contract = client4.open(deployer_wallet);

    const address_str = testnet ? contractAddressConfig.testnet : contractAddressConfig.mainnet;
    const contract_address = Address.parse(address_str);
    console.log("contract_address（jetton_master）：", contract_address);
    let contract = await UxlinkJetton.fromAddress(contract_address);
    let contract_open = await client4.open(contract);


    let jetton_wallet = await contract_open.getGetWalletAddress(deployer_wallet_contract.address);
    console.log("✨ " + deployer_wallet_contract.address + "'s JettonWallet ==> ");

    // ✨Pack the forward message into a cell
    const test_message_left = beginCell()
        .storeBit(0) // 🔴  whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
        .storeUint(0, 32)
        .storeBuffer(Buffer.from("Hello, GM -- Left.", "utf-8"))
        .endCell();

    // ========================================
    let forward_string_test = beginCell().storeBit(1).storeUint(0, 32).storeStringTail("EEEEEE").endCell();
    let packed = beginCell()
        .store(
          storeTokenBurn({
              $$type: "TokenBurn",
                query_id: 0n,
                amount: burnParams.amount,
                response_destination: deployer_wallet_contract.address,
                custom_payload: forward_string_test,
            })
        )
        .endCell();

    let deployAmount = toNano("0.3");
    let seqno: number = await deployer_wallet_contract.getSeqno();
    let balance: bigint = await deployer_wallet_contract.getBalance();
    // ========================================
    printSeparator();
    console.log("Current deployment wallet balance: ", fromNano(balance).toString(), "💎TON");
    console.log("\n🛠️ Calling To JettonWallet:\n" + jetton_wallet + "\n");
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        messages: [
            internal({
                to: jetton_wallet,
                value: deployAmount,
                // init: {
                //     code: init.code,
                //     data: init.data,
                // },
                bounce: true,
                body: packed,
            }),
        ],
    });
})();
