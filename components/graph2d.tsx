import {ForceGraph2D} from "react-force-graph"
import {useRef} from "react";


const testData = {
    nodes: [{ id: 'a', group: 1 }, { id: 'b', group: 1 }, { id: 'c', group: 2 }],
    links: [
        { source: 'b', target: 'c' },
        { source: 'b', target: 'c', curvature: 0.3 },
        { source: 'b', target: 'c', curvature: -0.3 },
        { source: 'b', target: 'c', curvature: 0.6 },
        { source: 'b', target: 'c', curvature: -0.6 },
        { source: 'b', target: 'a', name: 'sdaf' },
        { source: 'a', target: 'c', name: 'sdaf' }
    ]
};

export default function Graph2d({ data }) {

    console.log('Graph given data', data);

    const fgRef = useRef<any>();
    fgRef.current?.d3Force('link').distance(30)
    fgRef.current?.d3Force('charge')
        .strength(-20)
        .distanceMax(100)

    return (
        <div>
            <ForceGraph2D
                enableNodeDrag={false}
                ref={fgRef}
                graphData={data}
                cooldownTicks={100}
                onEngineStop={() => fgRef.current?.zoomToFit(400)}
                nodeRelSize={6}
                linkCurvature="curvature"
                linkDirectionalArrowLength={5}
                nodeLabel="id"
            />
        </div>
    )
}
