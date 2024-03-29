import {ForceGraph2D} from "react-force-graph"
import {useRef} from "react";
import {Center, Text} from "@chakra-ui/react";


const testData = {
    nodes: [{ id: 1, group: 1, name: "TESt" }, { id: 2, group: 1, name: "TEST1" }, { id: 3, group: 2, name: "test3" }],
    links: [
        { source: 2, target: 3 },
        { source: 2, target: 3, curvature: 0.3 },
        { source: 2, target: 3, curvature: -0.3 },
        { source: 2, target: 3, curvature: 0.6 },
        { source: 2, target: 3, curvature: -0.6 },
        { source: 2, target: 1, name: 'sdaf' },
        { source: 1, target: 3, name: 'sdaf' }
    ]
};

export default function Graph2d({ data }) {

    console.log('Graph given data', data);

    const fgRef = useRef<any>();
    fgRef.current?.d3Force('link').distance(link => 30)
    fgRef.current?.d3Force('charge')
        .strength(-10)
        .distanceMax(150)
        .distanceMin(100)

    function goToAddressPage(address: string) {
        window.open(`https://magiceden.io/u/${address}`)
    }

    if (data.nodes.length == 0) {
        return <Center>
            <Text
                textAlign="center"
            >
                Please enter the name of a NFT collection
            </Text>
        </Center>
    }

    return (
        <div>
            <ForceGraph2D
                onNodeClick={(node, event) => goToAddressPage(node.id.toString())}
                enableNodeDrag={true}
                ref={fgRef}
                graphData={data}
                cooldownTicks={20}
                //onEngineStop={() => fgRef.current?.zoomToFit(100, 10)}
                nodeRelSize={5}
                linkCurvature="curvature"
                linkDirectionalArrowLength={5}
                nodeLabel="id"
                nodeAutoColorBy={"group"}
                linkAutoColorBy={"group"}
            />
        </div>
    )
}
