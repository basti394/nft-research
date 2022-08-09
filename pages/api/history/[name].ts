import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql} from "apollo-server-micro";
import formatHistoryData from "../../../lib/Formatter/formatHistoryData";
import checkIfCollectionIsStored from "../../../lib/checkIfCollectionIsStored";
import storeNewCollection from "../../../lib/storeNewCollection";
import foramtMagicEdenToGraphData from "../../../lib/Formatter/formatMagicEdenToGraphData";

export default async function handler(req, res) {
    const name = req.query.name;

    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache(),
    });

    let isCollectionStored;

    try {
        isCollectionStored = await checkIfCollectionIsStored(name);
    } catch (e) {
        res.status(500).send(e);
        return;
    }

    if (isCollectionStored) {
        const data = await client.query({
            query: gql`
          {
            users {
              address
              soldTo {
                address
               }
              soldToConnection {
                edges{
                  price
                  marketplace
                }
              }
            }
          }`
        });

        const formattedData = formatHistoryData(data.data)

        res.status(200).send(formattedData)
        return;
    }


    const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=0&limit=100`)
    const data = await response.json();

    await storeNewCollection(name.replaceAll('_', '.'), JSON.stringify(data));

    const filteredData = data.filter(function (data) {
        return data.type == 'buyNow';
    })
    const formattedData = foramtMagicEdenToGraphData(filteredData)

    res.status(200).send(formattedData);
}
