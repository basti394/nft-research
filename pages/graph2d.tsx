import {ForceGraph2D} from "react-force-graph"

export default function Graph2d({ data }) {

    const testData = {
        nodes: [{ id: 'a', group: 1 }, { id: 'b', group: 1 }, { id: 'c', group: 2 }],
        links: [
            { source: 'b', target: 'c' },
            { source: 'b', target: 'a', name: 'sdaf' },
            { source: 'a', target: 'c', name: 'sdaf' }
        ]
    };

    console.log('Graph given data', data);
    console.log('testData', testData);

    // const [data, setData] = useState({nodes: [], links: []});
    // const [isLoading, setLoading] = useState(false);
    //
    // const updateData = useCallback((r: any) => {
    //     console.log('r: ', r)
    //     console.log('data: ', data)
    //     if (data?.nodes?.length === 0 ) {
    //         setData(r)
    //     }
    // },[data])
    //
    // useEffect(() => {
    //     setLoading(true);
    //     const client = new ApolloClient({
    //         uri: 'http://localhost:3000/api/graphql',
    //         cache: new InMemoryCache(),
    //     })
    //     const getData = async () => {
    //         try {
    //             const res = await client.query({
    //                 query: gql`
    //                 {
    //                   users {
    //                     address
    //                     soldTo {
    //                       address
    //                      }
    //                     soldToConnection {
    //                       edges{
    //                         price
    //                         marketplace
    //                       }
    //                     }
    //                   }
    //                 }`
    //             });
    //             console.log('res.data', res.data)
    //             return formatData(res.data)
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     getData().then(r => {
    //         updateData(r);
    //         setLoading(false);
    //     })
    // }, [updateData]);
    //
    // if (isLoading) return <p>Loading...</p>
    // if (!data) return <p>No profile data</p>
    //
    // console.log('data', data)


    return <ForceGraph2D
        graphData={testData}
        nodeRelSize={10}
        width={1111}
        height={1111}
        linkDirectionalArrowLength={5}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
    />
}
