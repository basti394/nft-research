import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getTotalVolume(name: String, token: string | null): Promise<number> {

    const session = driver.session();

    const query = token == null
        ? `match (n)-[r]->(m) where r.collection = "${name}" return sum(r.price)`
        : `match (n)-[r]->(m) where r.collection = "${name}" and r.token = "${token}" return sum(r.price)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }
    return data.records[0]._fields[0]
}