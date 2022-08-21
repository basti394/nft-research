import {element, node} from "prop-types";

export default function formatMagicEdenToGraphData(wholeData): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    wholeData?.forEach( (data, index) => {

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

        let indexSeller = wholeData.findIndex(item => item.seller == data.seller)
        let indexBuyer = wholeData.findIndex(item => item.buyer == data.buyer)


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
