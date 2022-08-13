import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import {typeDefs} from "./schemas";
import {Neo4jGraphQLConfig} from "@neo4j/graphql/dist/classes/Neo4jGraphQL";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

    let database = req.headers.database

    const config: Neo4jGraphQLConfig = {
        driverConfig: {
            database: database
        }
    }

    const neoSchema = new Neo4jGraphQL({ typeDefs, config, driver});
    const apolloServer = new ApolloServer({
        schema: await neoSchema.getSchema(),
        playground: true,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
    });
    await apolloServer.start();
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}

export const config = {

    api: {
        bodyParser: false,
    },
};
