import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://labstalentsbd_user:X4qfnKBCHejdFpnDdmmoP8TtuJYyo2Y6@dpg-cs4rv5q3esus73alfgng-a.oregon-postgres.render.com/labstalentsbd';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

// Endpoint de criação de usuários
app.post('/usuarios', async (req, res) => {
    const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

    try {
        console.log('Dados recebidos:', req.body);

        const existingUser = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const newUser = await prisma.user.create({
            data: { email: req.body.email, name: req.body.name, password: req.body.password },
        });

        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(404).json({ error: 'Email ou senha inválidos' });
        }

        const token = generateToken(user.id);
        res.status(200).json({ message: 'Login feito com sucesso', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    } finally {
        await prisma.$disconnect();
    }
});

// Endpoint para pegar todos os usuários
app.get('/pegartodos', async (req, res) => {
    const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, password: true },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao pegar usuários:', error);
        res.status(500).json({ error: 'Erro ao pegar usuários' });
    } finally {
        await prisma.$disconnect();
    }
});

// Endppint para editar usuário
app.put('/editarusuarios/:id', async (req, res) => {
    const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { email: req.body.email, name: req.body.name, password: req.body.password },
        });
        res.status(201).json(updatedUser);
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        res.status(500).json({ error: 'Erro ao editar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});

// Endpoint para deletar usuário
app.delete('/deletarusuarios/:id', async (req, res) => {
    const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

    try {
        await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    } finally {
        await prisma.$disconnect();
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


