import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getWashtradedVolume(name: String): Promise<number> {

    const session = driver.session();

    const query = `use ${name} match (n)-[r]->(m) where r.flagged = true or (n.washtrader = true and m.washtrader = true) return sum(r.price)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        console.log(e)
    }
    return data.records[0]._fields[0]
}