import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getAmountWashTradedNFTs(name: String, token: string | null) {

    const session = driver.session();

    if (token != null) {
        return 1
    }

    const query = `match (n)-[r]->(m) where r.collection = "${name}" and r.flagged = true return count(distinct r.token)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    return data.records[0]._fields[0]
}