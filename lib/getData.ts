import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export default async function getData(name: String) {

    const session = driver.session();

    const query = `use ${name} Match (n)-[r]->(m) Return n,r,m`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        console.log(e)
    }

    return data.records.map((element) => element._fields)
}
