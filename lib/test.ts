import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session()

export default async function test() {

    const query = 'create database test';

    try {
        await session.run(query)
    } catch (e) {
        throw e;
    }
}