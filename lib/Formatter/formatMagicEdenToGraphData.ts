export default function foramtMagicEdenToGraphData(data): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    let previous = 0;

    data?.forEach( (data) => {

        if (!nodes.includes(data.seller)) {
            nodes.push({
                id: data.seller,
                group: 1
            })
        }

        if (!nodes.includes(data.buyer)) {
            nodes.push({
                id: data.buyer,
                group: 1
            })
        }

        if (previous % 2 == 0) {
            links.push({
                source: data.seller,
                target: data.buyer,
                // curvature: 0.3 * previous
            })
        } else {
            links.push({
                source: data.seller,
                target: data.buyer,
                // curvature: -0.3 * previous
            })
        }

        previous += 1;
    })

    return { nodes, links }
}
