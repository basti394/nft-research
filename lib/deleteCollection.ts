import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function deleteCollection(collection: string) {

    let query = `match (n)-[r]->(m) where r.collection = "${collection}" detach delete r`

    try {
        await session.run(query);
        console.log('Collection successfully deleted')
    } catch (e) {
        throw e;
    }
}