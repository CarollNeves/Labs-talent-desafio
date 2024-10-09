import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';


const prisma = new PrismaClient();
const app = express();
app.use(express.json());
// Endpoint para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});
// Endpoint para pegar todos os usuários
app.get('/pegartodos', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao pegar usuários:', error);
        res.status(500).json({ error: 'Erro ao pegar usuários' });
    }
});
const corsOptions = {
    origin: '*', // Permite todas as origens, pode ser ajustado para domínios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
// Porta configurada para produção ou localhost
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


/* usuario: rodolfo
senha: jzO03uoF9RZMCKs7*/