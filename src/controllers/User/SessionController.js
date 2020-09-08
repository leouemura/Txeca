const connection = require('../../database/connection');
const crypto = require('crypto');

module.exports = {
    async create(req,res){
        const { username, password } = req.body;
        const user_info = await connection('users').where('username',username).select('id','password');
        
        if(user_info.length == 1){
            let user_id = user_info[0].id;
            //console.log(`ID: ${user_info[0].id}\tPassword: ${user_info[0].password}`);
            if(password==user_info[0].password){
                //console.log("Senha correta")
                let db_session = await connection('userid_token').where('user_id',user_id).select('*')
                let token = crypto.randomBytes(4).toString('HEX');

                if(db_session.length==0){
                    console.log("Acesso Permitido! Primeiro login...");
                    await connection('userid_token').insert({user_id,token})
                }
                else{
                    console.log("Acesso Permitido! Deletando token antigo e gerando novo token")
                    await connection('userid_token').where('user_id',user_id).delete()
                    await connection('userid_token').insert({user_id,token})

                }
                return res.json({token})
            }
            else{
                return res.json({error:"Senha incorreta... Tente novamente"})
            }
        }
        else{
            return res.json({error:"Usuario incorreto"})
        }
        
    }
}