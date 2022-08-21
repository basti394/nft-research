import {element, node} from "prop-types";

export default function formatGraphToAdjacencyList(data): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    data?.forEach( (data) => {

        if (!nodes.some(element => element.id == data.seller)) {
            nodes.push({
                id: data.seller,
                group: 1
            })
        }

        if (!nodes.some(element => element.id == data.buyer)) {
            nodes.push({
                id: data.buyer,
                group: 1
            })
        }

        let repetitions = links.filter((element) => element.source == data.seller && element.target == data.target).length

        if (repetitions % 2 == 0) {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} SOL, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                token: data.tokenMint,

                curvature: 0.3 * repetitions,
            })
        } else {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} SOL, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                token: data.tokenMint,
                curvature: -0.3 * repetitions,
            })
        }
    })

    return { nodes, links }
}
