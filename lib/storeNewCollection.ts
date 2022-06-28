import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function storeNewCollection(name: string, data: any) {

    const query = `create database ${name}`;

    // call apoc.load.json(${data}) yield value where value.type starts with "buyNow" merge (seller:User {address:value.seller}) merge (buyer:User {address: value.buyer}) merge (seller)-[:SoldTo]->(buyer)`;
    try {
        await session.run(query);
    } catch (e) {
        console.log(e)
    }
}
