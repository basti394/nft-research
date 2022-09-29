import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getAmountTrades(name: String): Promise<number> {

    const session = driver.session();

    const query = `match (n)-[r]->(m) where r.collection = "${name}" return count(r)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }
    return data.records[0]._fields[0]
}