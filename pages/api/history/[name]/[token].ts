import {getToken} from "@neo4j/graphql/dist/utils/get-token";
import getTransaktionOfToken from "../../../../lib/getTransaktionOfToken";
import formatHistoryData from "../../../../lib/Formatter/formatHistoryData";
import getData from "../../../../lib/getData";
import getWashTraders from "../../../../lib/getWashtraders";

export default async function handler(req, res) {
    const name = req.query.name;
    const token = req.query.token

    console.log(name)
    console.log(token)

    const tokenHistory = await getTransaktionOfToken(name, token)

    const washTraders = await getWashTraders(name)

    console.log('tokenHistory: ', tokenHistory)
    console.log('washTraders: ', washTraders)

    const formattedData = formatHistoryData(tokenHistory, washTraders)

    console.log(formattedData)

    res.status(200).send(formattedData)
}