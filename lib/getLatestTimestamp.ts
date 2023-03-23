import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getLatestTimestamp(chain: "eth"|"sol", collection: string) {

    const session = driver.session();


    const query = `MATCH (n)-[r]->(m) where r.collection = "${collection}" RETURN MAX(r.timeStamp)`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    console.log(data)

    console.log()

    return data.records[0]._fields[0].low
}