import deleteCollection from "../../../lib/deleteCollection";

export default async function handler(req, res) {
    const collection = req.query.collection;
    const password = req.query.password;

    if (password != process.env.DELETION_PASSWORD) {
        res.status(401)
        return
    }

    await deleteCollection(collection)

    res.status(200)
}