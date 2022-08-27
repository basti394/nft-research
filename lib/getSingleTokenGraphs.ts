export default function getSingleTokenGraph(data): any[] {

    console.log('Data from which the single tokens are taken: ', data)

    const tokens = new Set<string>(data.links.map(element => element.token))

    let separateGraphs = []

    tokens.forEach(element => {
        separateGraphs.push(
            {
                nodes: data.nodes,
                links: data.links.filter(element1 => element1.token == element)
            }
        )
    })

    separateGraphs.forEach(element => element.nodes =  element.nodes.filter(node => element.links.some(link => link.source == node.id) || element.links.some(link => link.target == node.id)))

    console.log('tokenraphs calculated')

    return separateGraphs;
}