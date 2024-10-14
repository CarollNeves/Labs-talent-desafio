import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
// Variável global para a URL do banco de dados NeonDB
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://labstalentsbd_user:X4qfnKBCHejdFpnDdmmoP8TtuJYyo2Y6@dpg-cs4rv5q3esus73alfgng-a.oregon-postgres.render.com/labstalentsbd';

const app = express();
app.use(express.json());  // Endpoint para criar um novo usuário

app.post('/usuarios', async (req, res) => {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL },
        },
    });
    try {
        console.log('Dados recebidos:', req.body);
        
        // Verifica se o email já está cadastrado
        const existingUser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            },
        });
        
        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});


//Endpoint para validar login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid Email format' });
    }

    if (!password || password.length < 6) { 
        return res.status(400).json({ error: 'Invalid Password format' });
    }

    const prisma = new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL },
        },
    });

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'Invalid email' });
        }

        if (user.password !== password) {
            return res.status(404).json({ error: 'Invalid password' });
        }
        return res.status(200).json({ message: 'Login feito com sucesso' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ error: 'Erro ao fazer login' });
    } finally {
        await prisma.$disconnect();
    }
});

// Endpoint para pegar todos os usuários
app.get('/pegartodos', async (req, res) => {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL },
        },
    });
    try {
        const users = await prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });
          
        res.status(200).json(users);

    } catch (error) {
        console.error('Erro ao pegar usuários:', error);
        res.status(500).json({ error: 'Erro ao pegar usuários' });
    } finally {
        await prisma.$disconnect();
    }
});

app.put('/editarusuarios/:id', async (req, res) => {

    const prisma = new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL },
        },
    });
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            },
        });
        res.status(201).json(req.body);

    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        res.status(500).json({ error: 'Erro ao editar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});
app.delete('/deletarusuarios/:id', async (req, res) => {

    const prisma = new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL },
        },
    });
    try {
        const updatedUser = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.status(201).json(req.body);
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});
const corsOptions = {
    origin: '*', // Permite todas as origens, pode ser ajustado para domínios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});






