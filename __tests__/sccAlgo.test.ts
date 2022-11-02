import getWTSCCs from "../lib/getWTSCCs";
import {expect} from "@jest/globals";

describe('SCC detecting Algorithm', function() {

    test('test for normal values', () => {

        const threshold = 3

        const formattedDataME = {
            nodes: [
                {id: "A", group: 3},
                {id: "B", group: 3},
                {id: "C", group: 3},
                {id: "D", group: 3},

                {id: "E", group: 3},
                {id: "F", group: 3},
                ],
            links: [
                {
                    source: "A",
                    target: "B",
                    name: "lolo",
                    token: "asdflkasjdf",
                    curvature: "test"
                },
                {
                    source: "A",
                    target: "B",
                    name: "lolol",
                    token: "asdflkasjf",
                    curvature: "test"
                },
                {
                    source: "A",
                    target: "B",
                    name: "loll",
                    token: "asdfljdf",
                    curvature: "test"
                },

                {
                    source: "B",
                    target: "C",
                    name: "loll",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "B",
                    target: "C",
                    name: "lol",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "B",
                    target: "C",
                    name: "lll",
                    token: "afljdf",
                    curvature: "test"
                },

                {
                    source: "C",
                    target: "A",
                    name: "loll",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "C",
                    target: "A",
                    name: "lo",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "C",
                    target: "A",
                    name: "loll",
                    token: "aljdf",
                    curvature: "test"
                },

                {
                    source: "C",
                    target: "D",
                    name: "lol",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "C",
                    target: "D",
                    name: "lol",
                    token: "ajdf",
                    curvature: "test"
                },
                {
                    source: "C",
                    target: "D",
                    name: "lol",
                    token: "asddf",
                    curvature: "test"
                },

                {
                    source: "D",
                    target: "C",
                    name: "loll",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "D",
                    target: "C",
                    name: "loll",
                    token: "asdfljdf",
                    curvature: "test"
                },
                {
                    source: "D",
                    target: "C",
                    name: "ll",
                    token: "asdf",
                    curvature: "test"
                },

                {
                    source: "E",
                    target: "F",
                    name: "loll",
                    token: "aljdf",
                    curvature: "test"
                },{
                    source: "E",
                target: "F",
                name: "loll",
                token: "aljdf",
                curvature: "test"
            },

                {
                    source: "F",
                    target: "E",
                    name: "loll",
                    token: "aljdf",
                    curvature: "test"
                },{
                    source: "F",
                target: "E",
                name: "loll",
                token: "aljdf",
                curvature: "test"
            },

                ]
        }

        const allNodes = formattedDataME.nodes
        const allLinks = formattedDataME.links

        const wtSCCs = getWTSCCs(allNodes, allLinks, threshold)

        const expectations = [ [ 'D', 'C', 'B', 'A' ] ]

        expect(wtSCCs).toStrictEqual(expectations)
    })
});
