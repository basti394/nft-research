import neo4j from "neo4j-driver";

const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
        { disableLosslessIntegers: true }
        );

export default async function getWashtradesAmount(name: String, token: string | undefined): Promise<number> {

    const session = driver.session();

    const query = typeof token == "undefined"
    ? `match (n)-[r]-() where r.collection = "${name}" and r.flagged = true return count(DISTINCT r)`
    : `match (n)-[r]-() where r.collection = "${name}" and r.token = "${token}" and r.flagged = true return count(DISTINCT r)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }
    
    return data.records[0]._fields[0]
}