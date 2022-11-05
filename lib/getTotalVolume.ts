import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getTotalVolume(name: String, token: string | undefined): Promise<number> {

    const session = driver.session();

    console.log("token2: ", token)

    const query = typeof token == "undefined"
        ? `match (n)-[r]->(m) where r.collection = "${name}" return sum(r.price)`
        : `match (n)-[r]->(m) where r.collection = "${name}" and r.token = "${token}" return sum(r.price)`

    console.log(query)

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    console.log(data)

    console.log()

    return data.records[0]._fields[0]
}