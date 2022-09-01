import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function markTransactionAsWashtrade(seller: string, buyer: string, collection: string) {

    const query = `match (n)-[r]->(m) where n.address = "${seller}" and m.address = "${buyer}" set r.flagged = true`

    try {
        await session.run(query)
        console.log("Transactions flagged")
    } catch (e) {
        throw e;
    }
}