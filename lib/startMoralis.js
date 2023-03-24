import Moralis from "moralis";

export default async function startMoralis() {
    try {
        await Moralis.start({
            apiKey: process.env.MORALIS_TOKEN,
        })
    } catch (error) {
        console.error(error);
    }
}