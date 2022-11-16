import Graph from "./Graph"

export default function getWTSCCs(allNodes: any[], allLinks: any[], threshold: number): string[][] {

    const nodesParseMap = new Map()

    allNodes.forEach((element, index) => nodesParseMap.set(element.id, index))

    console.log(allNodes.length)

    let graph: Graph = new Graph(allNodes.length)

    let parsedLinks: { source: number, target: number }[] = []

    allLinks.forEach(element => {
        parsedLinks.push({source: nodesParseMap.get(element.source), target: nodesParseMap.get(element.target)})
    })

    console.log(parsedLinks)

    parsedLinks.forEach(element => {
        graph.addEdge(element.source, element.target)
    })

    let finalSCCs: number[][] = []
    let found: boolean = true

    while (found) {
        let sccs = graph.SCC()

        found = sccs.length != 0;


        sccs.forEach((scc) => {
            console.log('scc: ', scc)
            scc.forEach((element) => {
                //console.log('element: ', element)
                scc.forEach((element1) => {
                    //console.log('element1: ', element1)
                    let links = parsedLinks.filter((element2) => element2.source == element && element2.target == element1)
                    parsedLinks = parsedLinks.filter((element2) => element2.source != element || element2.target != element1)

                    links.shift()

                    if (links.length > 0) {
                        links.forEach((link) => parsedLinks.push(link))
                    }
                })
            })
        })

        graph = new Graph(allNodes.length)

        console.log("parsedLinks in scc detectiong: ", parsedLinks)

        parsedLinks.forEach(element => {
            graph.addEdge(element.source, element.target)
        })

        sccs.forEach((element) => {
            if (element.length != 0) {
                finalSCCs.push(element)
            }
        })

        console.log("finalSCCs, ", finalSCCs)
    }

    let parsedSCCs = []
    finalSCCs.forEach((element) => {
        console.log('element: ', element)
        let x = []
        element.forEach((value) => {
            x.push(getByValue(nodesParseMap, value))
        })
        parsedSCCs.push(x)
    })

    console.log('sccs in normal values: ', parsedSCCs)

    const parsedLinksAsSet: number[][] = parsedSCCs.slice()

    parsedLinksAsSet.forEach((element, index) => {
        let test = parsedLinksAsSet.filter((test) => areEqual(test, element))
        if (test.length > 1) {
            parsedLinksAsSet.splice(index, 1)
        }
    })
    let wtSCCs = []

    parsedLinksAsSet.forEach((element) => {
        let repetitions = 0
        parsedSCCs.forEach((element1) => {
            if (areEqual(element1, element)) {
                repetitions = repetitions + 1;
            }
        })
        if (repetitions >= threshold) {
            wtSCCs.push(element)
        }
    })

    console.log(wtSCCs)

    return wtSCCs
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

function areEqual(array1, array2) {
    if (array1.length === array2.length) {
        return array1.every((element, index) => {
            return element === array2[index];
        });
    }

    return false;
}
