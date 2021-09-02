import 'isomorphic-fetch'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const handler = async (req, res) => {
    const {data} = req.body.input;
    const headers = new Headers()
    headers.set('X-Hasura-Admin-Secret', process.env.API_TOKEN || "")

    try {
        const response = await fetch(`${process.env.API_URL}/users/${data.username}`, {headers}).then(_res => _res.json())

        if (response.users.length === 0) {
            return res.status(400).json({
                message: 'Error Login'
            })
        }

        const user = response.users[0]
        const isPasswordMatching = await bcrypt.compare(data.password, user.password)

        if (!isPasswordMatching) {
            return res.status(400).json({
                message: 'Error Login'
            })
        }

        const token = jwt.sign({
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": ["user"],
                "x-hasura-default-role": "user",
                "x-hasura-user-id": String(user.id),
            }
        }, process.env.JWT_KEY || "")

        return res.json({
            token,
            userId: String(user.id)
        })

    } catch (e){
        console.log(e)
        return res.status(400).json({
            message: 'Error Login'
        })
    }

};

module.exports = handler;