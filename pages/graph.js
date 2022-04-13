import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql} from "apollo-server-micro";

export async function getStaticProps() {

    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache()
    })

    const { data, loading, networkStatus } = await client.query({
        query: gql`
        {
          users ( options: {limit: 5} ) {
            address 
            soldTo {
              address
              soldToConnection {
                edges{
                  price
                  marketplace
                }
              }
            }
          }
        }
        `
    })

    return {
        props: { data }
    }
}

function Graph({ data }) {

    console.log(data);

    return (
        <div>
            <span>lol</span>
        </div>
    )
}

export default Graph
