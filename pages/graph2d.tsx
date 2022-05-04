import {useCallback, useEffect, useRef, useState} from "react";
import {ForceGraph2D} from "react-force-graph"
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql} from "apollo-server-micro";

const testData = {
    nodes: [{ id: 'a', group: 1 }, { id: 'b', group: 1 }, { id: 'c', group: 2 }],
    links: [
        { source: 'b', target: 'c' },
        { source: 'b', target: 'a', name: 'sdaf' },
        { source: 'a', target: 'c', name: 'sdaf' }
    ]
};

const formatData = (data) => {
    const nodes = []
    const links = []

    if (!data?.users) {
        return { nodes, links }
    }

    console.log(data?.users.length)

    data?.users.forEach( (user) => {

        if (user.address == '8GSiZbxkd6nR2sNRftCNuAaPyX9Aoa9ER8RsiZDNzGuM') {
            nodes.push({
                id: user.address,
                group: 2
            })
        } else {
            nodes.push({
                id: user.address,
                group: 1
            })
        }

        if (user.soldTo != null && user.soldToConnection != null) {
            user.soldTo.forEach((address, index) => {
                links.push({
                    source: user.address,
                    target: address,
                    name: `price: ${user.soldToConnection.edges[index].price} SOL \n marketplace: ${user.soldToConnection.edges[index].marketplace}`
                })
            });
        }
    })

    return { nodes, links }
}

export default function Graph2d() {

    const [data, setData] = useState({nodes: [], links: []});

    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache(),
    })

    const updateData = useCallback((r: any) => {
        console.log('r: ', r)
        console.log('data: ', data)
        if (data?.nodes?.length === 0 ) {
            setData(r)
        }
    },[data])

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await client.query({
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
                console.log('res.data', res.data)
                return formatData(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        getData().then(r => {
            updateData(r);
        })
    }, [client, updateData]);

    console.log('data', data)

    return <ForceGraph2D
        graphData={data}
        nodeRelSize={10}
        width={1111}
        height={1111}
        linkDirectionalArrowLength={5}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
    />
}
