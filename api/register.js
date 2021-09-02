import * as bcrypt from 'bcrypt'
import 'isomorphic-fetch'

const handler = async (req, res) => {
    const {data} = req.body.input;
    const headers = new Headers()
    headers.set('Authorization', process.env.API_TOKEN || "")

    const hashedPassword = await bcrypt.hash(data.password, 10)

    try {
        await fetch(`${process.env.API_URL}/register`, {
            body: JSON.stringify({...data, password: hashedPassword}),
            headers,
            method: 'post'
        })
        res.json({
            success: true
        })
    } catch (e) {
        res.status(400).json({
            message: 'Error registering.'
        })
    }

};

module.exports = handler;