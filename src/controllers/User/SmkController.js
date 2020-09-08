const connection = require('../../database/connection')
const crypto = require('crypto');

module.exports = {
    async update(req, res) {
        //Pega o token e header
        const token = req.headers.authorization
    let { bolador, sanguessuga } = req.body;

        //Puxa o token equivalente no banco de dados
        const db_user_id = await connection('userid_token').where('token', token).select('user_id')
        let message = '';
        if (db_user_id.length == 0) {
            message = 'Acesso Negado'
            console.log("ACESSO NEGADO")
            res.json({ message })
        }
        if (db_user_id.length == 1) {
            const user_id = db_user_id[0].user_id
            //console.log('Usuario: ',user_id)
            const form_data = await connection('users').where('id', user_id).select('*')
            if (form_data.length == 1) {
                let timestamp = Date.now();
                //react deve enviar 'bolador' ou 'sanguessuga' ao apertar o botao
                if ((bolador === 'bolador') && (sanguessuga === 'sanguessuga')) {
                    //console.log(Object.values(form_data[0]))
                    message = `${form_data[0].username} fez a boa [${timestamp}]`
                    await connection('smk').insert({ user_id, timestamp, bolador, sanguessuga })
                    return res.json({message})
                }
                else {
                    if (sanguessuga === 'sanguessuga') {
                        bolador = 'out'
                        message = `${form_data[0].username} ta fumando [${timestamp}]`
                        await connection('smk').insert({ user_id, timestamp, bolador, sanguessuga })
                        return res.json({message})
                    }
                    if (bolador === 'bolador') {
                        bolador = 'out'
                        message = `Ué ${form_data[0].username}... qm bola fuma pô [${timestamp}]`
                        await connection('smk').insert({ user_id, timestamp, bolador, sanguessuga })
                        return res.json({message})
                    }

                }
            }
        }
    }
}

// pegar timestamp
// nao permitir que um nego clique no botao para enviar varias requisições iguais durante um intervalo de tempo (antitroll)
// mas o nego pode enviar uma requisição como bolador e outra como sanguessuga nesse msm intervalo (se n tiver enviado uma req com bolador e sanguessuga)

