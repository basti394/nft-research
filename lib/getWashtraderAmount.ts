import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getWashtraderAmount(name: String): Promise<number> {

    const session = driver.session();

    const query = `use ${name} match (n) where n.washtrader = true return count(*)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        console.log(e)
    }
    return data.records[0]._fields[0]
}