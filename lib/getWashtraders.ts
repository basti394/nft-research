import getData from "./getData";

export default async function getWashTraders(name: String): Promise<Set<string>> {

    const data = await getData(name)

    let washtraders = []

    data.forEach((element) => {
        if (element[0].properties.washtrader == true) {
            washtraders.push(element[0].properties.address)
        }
        if (element[2].properties.washtrader == true) {
            washtraders.push(element[2].properties.address)
        }
    })

    return new Set<string>(washtraders)
}