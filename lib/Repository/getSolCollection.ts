export default async function getSolCollection(collection: string) {
    let list = []

    let lastData = [""];

    for (let i = 0; i < 3000; i++) {
        if (lastData.length == 0) {
            break;
        }
        console.log("sending request ", i)
        console.log("amount to receive ", i * 100)
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${collection}/activities?offset=${i * 100}&limit=100`)
        console.log("received response: ", response.status)
        if (response.status == 429) {
            await new Promise(f => setTimeout(f, 30000));
            i--;
            continue;
        }
        if (response.status == 400) {
            break;
        }
        const data = await response.json();
        if (response.status != 200) {
            console.log("data: ", data)
        }
        lastData = data;
        console.log('data length ',data.length)
        console.log("-----------------------------------------")
        list.push(data)
    }

    return list
}