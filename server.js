import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const app = express()
app.use(express.json())




app.post('/usuarios', async (req, res) => {

    await prisma.user.create({
        data: {

            email: req.body.email,
            name: req.body.name,
            password: req.body.password


        }
    })



    res.status(201).json(req.body)
})


app.get('/pegartodos', async (req, res) => {  /* quando acessar (/usuarios) no get cai aqui*/

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.listen(3000)


/* usuario: rodolfo
senha: jzO03uoF9RZMCKs7*/