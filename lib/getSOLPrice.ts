export default async function getSOLPrice(): Promise<number> {

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur`)

    const body = await data.json()

    return body.solana.eur.toFixed(2)
}
