import {gql} from "apollo-server-micro";

export const typeDefs = gql`
    type User @exclude(operations: [CREATE, UPDATE, DELETE]) {
        address: String!
        washtrader: Boolean!
        soldTo: [User!]! @relationship(type: "SOLDTO", direction: OUT, properties: "properties")
        flagged: Boolean!
    }
    
    interface properties @relationshipProperties {
        flagged: Boolean!
        marketplace: String!
        price: Float!
        token: String!
    }
`;
