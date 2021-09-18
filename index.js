import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors()); 
app.use(express.json()); 

app.get('/produtos', async (req, resp) => {
    try{ 
        let p = await db.tb_produto.findAll({ order: [[ 'id_produto', 'desc']] }); 
        resp.send(p); 
    } catch (e) { 
        resp.send({ erro: e.toString() })
    }
})

app.post('/produtos', async (req, resp) => { 
    try { 
            let { nome, categoria, precoDe, precoPor, avaliacao,
                 descricao, quantidade, imagem} = req.body; 
            
            
     let validacao = await db.tb_produto.findOne({where: {vl_avaliacao: avaliacao, vl_preco_de: precoDe, vl_preco_por: precoPor, qtd_estoque: quantidade}});
     let validacao2 =  await db.tb_produto.findOne({where: { nm_produto: nome}});

     if(nome == '')
            return resp.send({ erro: 'O campo nome é obrigatório!' });
    
     if(precoDe == '')
            return  resp.send({ erro: 'O número da precoDe deve ser positivo!'}) 
            
    if(categoria == '')
         return resp.send({ erro: 'O campo categoria é obrigatório!' });
    
    if(precoPor == '')
        return  resp.send({ erro: 'O número da precoPor é obrigatório!'})
        
    if(avaliacao == '')
        return resp.send({ erro: 'O campo avaliacao é obrigatório!' });
        
    if(quantidade == '')
        return resp.send({ erro: 'O campo quantidade é obrigatório!' });

    if(imagem == '')
        return resp.send({ erro: 'O campo imagem é obrigatório!' });

    if(descricao == '')
        return resp.send({ erro: 'O campo descricao é obrigatório!' });

    if(validacao == NaN)
        return resp.send({ erro: 'Os campos Validação, Preços e de Quantidade devem ser números!'})

    if(validacao2 != null)
            return resp.send({ erro: 'O produto inserido já existe!'});

            let p = await db.tb_produto.create({
                nm_produto: nome,
                ds_categoria: categoria,
                vl_preco_de: precoDe,   
                vl_preco_por: precoPor, 
                vl_avaliacao: avaliacao,       
                qtd_estoque: quantidade,
                img_produto: imagem, 
                ds_produto: descricao, 
                bt_ativo: true,
                dt_inclusao: new Date()
            })    
            
               resp.send(p); 
               
    } catch (e) { 
        resp.send({ erro: e.toString() })
    }
})

app.put('/produtos/:id', async (req, resp) => {
 try { 
    let { nome, categoria, precoDe, precoPor, avaliacao,
        descricao, quantidade, imagem} = req.body; 

     let { id } = req.params; 

     let p = await db.tb_produto.update({ 
        nm_produto: nome,
        ds_categoria: categoria,
        vl_preco_de: precoDe,   
        vl_preco_por: precoPor, 
        vl_avaliacao: avaliacao,       
        qtd_estoque: quantidade,
        img_produto: imagem, 
        ds_produto: descricao, 
        bt_ativo: true,
        dt_inclusao: new Date()

     },
     { 
         where: { id_produto: id }
     })

     resp.sendStatus(200); 

 } catch (e) { 
    resp.send({ erro: e.toString() })
 }
})

app.delete('/produtos/:id', async (req, resp) => { 
    try { 
        let {id} = req.params;

        let r = await db.tb_produto.destroy({ where: {id_produto: id}})
        resp.sendStatus(200);

    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.listen(process.env.PORT,
           x => console.log(`Server up at port ${process.env.PORT}`))