const connection = require('../../database/connection')
const crypto = require('crypto');


module.exports={
    async index(req,res){
        const token = req.headers.authorization
        const db_user_id = await connection('userid_token').where('token',token).select('user_id')
        let message = '';
        if(db_user_id.length==0){
            message='Acesso Negado'
            console.log("ACESSO NEGADO")
            res.json({message})
        }
        if(db_user_id.length==1){
            const user_id = db_user_id[0].user_id
            console.log(user_id)
            const form_data = await connection('users').where('id',user_id).select('*')
            if(form_data.length==1){
                message='Dados localizados'
                const username = form_data[0].username;
                const password = form_data[0].password;
                const email = form_data[0].email;
                const user_info = {username,password,email}
                res.json({message, user_info})
            }
        }
    },

    async update(req,res){
        //Pega o token e header
        const token = req.headers.authorization
        const {username,password,email} = req.body;

        //Puxa o token equivalente no banco de dados
        const db_user_id = await connection('userid_token').where('token',token).select('user_id')
        let message = '';
        if(db_user_id.length==0){
            message='Acesso Negado'
            console.log("ACESSO NEGADO")
            res.json({message})
        }
        if(db_user_id.length==1){
            const user_id = db_user_id[0].user_id
            //console.log('Usuario: ',user_id)
            const form_data = await connection('users').where('id',user_id).select('*')
            if(form_data.length==1){
                //console.log({token,user_id,name,username,email,whatsapp})
                let count=0;
                const db_username = await connection('users').where('username',username).select('id')
                const db_email = await connection('users').where('email',email).select('id')

                //VERIFICAÇÔES
                //username
                if(db_username.length==0){
                    //console.log("db_username=0")
                    count=count+1;
                    message=message+' | username:OK'
                }
                if((db_username.length==1)&&(db_username[0].id==user_id)){
                    //console.log("db_username=1")
                    count=count+1;
                    message=message+' | username:OK'
                }
                //email
                if(db_email.length==0){
                    //console.log("db_email=0")
                    count=count+1;
                    message=message+' | email:OK'
                }
                if((db_email.length==1)&&(db_email[0].id==user_id)){
                    //console.log("db_email=1")
                    count=count+1;
                    message=message+' | email:OK'
                }
                
                


                //RESPOSTA COM RETORNO message
                //OK
                if(count===2){
                    console.log("TUDO CERTO! VAMOS ATUALIZAR SEUS DADOS")
                    //BUSCA ID, APAGA TD MENOS ID E SENHA, INSERE DADO
                    const db_user_alldata = await connection('users').where('id',user_id).select('*')
                    await connection('users').where('id',user_id).delete()
                    const id = db_user_alldata[0].id
                    await connection('users').where('id',user_id).insert({id,username,password,email})
                    message='Dados atualizados com sucesso'
                    return res.json({message})
                }
                //FALHA
                else{
                    if(message===' | username:OK'){
                        console.log("email ja cadastrados por outro usuario... Tente novamente")
                        message='email ja cadastrados por outro usuario... Tente novamente'
                        return res.json({message})
                    }
                    if(message===' | email:OK'){
                        console.log("usuario ja cadastrados por outro usuario... Tente novamente")
                        message='usuario ja cadastrados por outro usuario... Tente novamente'
                        return res.json({message})
                    }
                    

                    if(message===''){
                        console.log("usuario e email ja cadastrados por outro usuario... Tente novamente")
                        message='usuario e email ja cadastrados por outro usuario... Tente novamente'
                        return res.json({message})
                    }
                }
            }
        }
    }
}
/*
id
3f263d9c

token
782bc68d
*/