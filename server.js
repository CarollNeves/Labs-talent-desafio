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


const corsOptions = {
    origin: '*', // Permite todas as origens, pode ser ajustado para domínios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

app.listen(3000)




/* usuario: rodolfo
senha: jzO03uoF9RZMCKs7*/