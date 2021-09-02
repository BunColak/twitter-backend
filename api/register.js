import * as bcrypt from 'bcrypt'
import 'isomorphic-fetch'

const handler = async (req, res) => {
    const {data} = req.body.input;
    const headers = new Headers()
    headers.set('X-Hasura-Admin-Secret', process.env.API_TOKEN || "")

    const hashedPassword = await bcrypt.hash(data.password, 10)

    try {
        const result = await fetch(`${process.env.API_URL}/register`, {
            body: JSON.stringify({...data, password: hashedPassword}),
            headers,
            method: 'post'
        })
        if (result.ok) {
            return res.json({
                success: true
            })
        } else {
            return res.status(400).json({
                message: 'Error registering.'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Error registering.'
        })
    }

};

module.exports = handler;