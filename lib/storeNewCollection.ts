import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function storeNewCollection(name: string, data: string) {

    if (data == "[]") {
        return
    }

    if (name == "system") {
        return
    }

    data = data.replace(/"([^"]+)":/g, '$1:');

    const createDatabaseQuery = `create database ${name}`;
    const createGraphQuery = `use ${name} with ${data} as dataList with [data in dataList where data.type = "buyNow"] as filteredData foreach (data in filteredData | merge (seller:User {address:data.seller}) merge (buyer:User {address: data.buyer}) create (seller)-[:SOLDTO {price: data.price, marketplace: data.source}]->(buyer) )`;

    try {
        await session.run(createDatabaseQuery);
        console.log(`"${name}" successfully created`)
        await session.run(createGraphQuery);
        console.log('Data successfully added')
    } catch (e) {
        console.log(e);
    }
}


