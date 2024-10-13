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
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
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






