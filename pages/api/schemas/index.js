import {gql} from "apollo-server-micro";

export const typeDefs = gql`
    type User @exclude(operations: [CREATE, UPDATE, DELETE]) {
        address: String!
        soldTo: [User!]! @relationship(type: "SoldTo", direction: OUT, properties: "properties")
    }
    
    interface properties @relationshipProperties {
        marketplace: String!
        price: Float!
        token: String!
    }
    
`;
