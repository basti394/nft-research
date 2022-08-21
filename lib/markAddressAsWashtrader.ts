import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default function markAddressAsWashTrader(address: string, collection: string) {

    const query = `use ${collection} MATCH (p:User {address: ${address}) SET p.washtrader = true RETURN p`

    try {
        await session.run(query);
    } catch (e) {
        console.log(e);
    }
}