export default async function getETHPrice(): Promise<number> {

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur`)

    let body
    try {
        body = await data.json()
    } catch (e) {
        console.log(e)
        console.log(data)
        return 1500
    }

    return body.ethereum.eur.toFixed(2)
}
