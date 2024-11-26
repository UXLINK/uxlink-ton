import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress, toNano } from "@ton/core";
import { UxlinkJetton } from "../output/UxlinkJetton_UxlinkJetton";
import { prepareTactDeployment } from "@tact-lang/deployer";
import { buildOnchainMetadata } from "../utils/jetton-helpers";
import { deployParams, tokenParams } from "./config";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
    // Parameters
    let testnet = deployParams.isTest;

    const ownerAddress = {
        mainnet: process.env.mainnet_address || "",
        testnet: process.env.testnet_address || "",
    };

    // Create content Cell
    let content = buildOnchainMetadata(tokenParams);
    let max_supply = deployParams.token_max_supply; // 🔴 Set the specific total supply in nano

    let packageName = "UxlinkJetton_UxlinkJetton.pkg";
    let owner = Address.parse(testnet ? ownerAddress.testnet : ownerAddress.mainnet);
    let init = await UxlinkJetton.init(owner, content, max_supply);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "../output", packageName));

    // Prepareing
    console.log("Uploading package...");
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Address");
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log("Please, follow deployment link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();
