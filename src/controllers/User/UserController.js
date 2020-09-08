const connection = require('../../database/connection')
const crypto = require('crypto');

module.exports = {
    async create(req, res) {
        const {
            username,
            password,
            email,
        } = req.body;

        const id = crypto.randomBytes(4).toString('HEX');

        const db_UserDuplicate = await connection('users').where('username', username).select('username', 'email');
        const obj_user = db_UserDuplicate[0];
        let message = "";
        if (db_UserDuplicate[0] == undefined) {

            await connection('users').insert({ id, username, password, email });
            message = "Novo usuario cadastrado com sucesso!"
            return res.json({
                message,
                id, username, password, email
            })

        }
        else{

            if ((username === obj_user.username) && (email === obj_user.email)) {
                //console.log("Usuario e email ja existentes")
                message = "Usuario e email ja existentes"//res.json("Usuario e email ja existentes")
                res.json({ message })
            }
            else {
                if (username === obj_user.username) {
                    //console.log('Usuario Existente');
                    message = "Usuario já cadastrado..."//res.json("Usuario já cadastrado...")
                    res.json({ message })
                }
                if (email === obj_user.email) {
                    console.log('E-mail Existente');
                    message = "E-mail já cadastrado..."//res.json("E-mail já cadastrado...")
                    res.json({ message })
                }
            }

        }


        //await trx.commit();



    },

    async index(req, res) {
        const users = await connection('users').select('*')
        return res.json(users)
    },

    async delete(req, res) {
        await connection('users').delete()
        return res.json("TD DELETADO")
    }



}
