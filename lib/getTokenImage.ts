
export default async function getTokenImage(token: string): Promise<string> {
    const response = await fetch(`https://api-mainnet.magiceden.dev/v2/tokens/${token}`)
    const data = await response.json();
    return data.image;
}