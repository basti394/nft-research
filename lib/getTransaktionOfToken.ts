import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getTransaktionOfToken(name: String, token: String): Promise<number> {

    const session = driver.session();

    const query = `match (n)-[r]->(m) where r.collection = "${name}" and r.token = "${token}" return n, r, m`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    return data.records.map((element) => element._fields)
}