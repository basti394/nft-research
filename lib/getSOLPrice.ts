export default async function getSOLPrice(): Promise<number> {

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur`)

    let body
    try {
        body = await data.json()
    } catch (e) {
        console.log(e)
        console.log(data)
        return 20
    }

    return body.solana.eur.toFixed(2)
}
