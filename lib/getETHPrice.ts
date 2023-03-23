export default async function getETHPrice(): Promise<number> {

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur`)

    const body = await data.json()

    return body.ethereum.eur.toFixed(2)
}
