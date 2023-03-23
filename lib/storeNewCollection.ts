import neo4j from "neo4j-driver";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import {cloneRangeCov} from "@bcoe/v8-coverage";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function storeNewCollection(name: string, data: string, chain: "sol" | "eth") {

    if (data == "[]") {
        return
    }

    data = data.replace(/"([^"]+)":/g, '$1:');

    let createGraphQuery
    if (chain == "sol") {
        createGraphQuery = `with ${data} as dataList with [data in dataList where data.type = "buyNow"] as filteredData foreach (data in filteredData | merge (seller:User {address:data.seller, washtrader:false}) merge (buyer:User {address: data.buyer, washtrader:false}) create (seller)-[:SOLDTO {price: data.price, marketplace: data.source, token: data.tokenMint, flagged: false, timeStamp: data.blockTime, collection: "${name}", chain: "${chain}" }]->(buyer) )`;
    } else if (chain == "eth") {
        createGraphQuery = `with ${data} as filteredData foreach (data in filteredData | merge (seller:User {address:data.seller, washtrader:false}) merge (buyer:User {address: data.buyer, washtrader:false}) create (seller)-[:SOLDTO {price: data.price, marketplace: data.source, token: data.tokenMint, flagged: false, timeStamp: data.blockTime, collection: "${name}", txshash: data.hash, chain: "${chain}", priceAssumed: data.priceAssumed }]->(buyer) )`
    }

    try {
        await session.run(createGraphQuery);
        console.log('Data successfully added')
    } catch (e) {
        throw e;
    }
}


