import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Salas ──────────────────────────────────────────────────────────────────
  const sala1 = await prisma.sala.upsert({
    where: { numero: 1 },
    update: {},
    create: { numero: 1, capacidade: 64 },
  });

  const sala2 = await prisma.sala.upsert({
    where: { numero: 2 },
    update: {},
    create: { numero: 2, capacidade: 48 },
  });

  console.log('✅ Salas criadas');

  // ── Filmes ─────────────────────────────────────────────────────────────────
  const filmes = [
    { titulo: 'Interestelar', genero: 'Ficção Científica', duracao: 169, classificacaoEtaria: 12 },
    { titulo: 'Vingadores: Ultimato', genero: 'Ação', duracao: 181, classificacaoEtaria: 12 },
    { titulo: 'O Rei Leão', genero: 'Animação', duracao: 118, classificacaoEtaria: 0 },
    { titulo: 'Coringa', genero: 'Drama', duracao: 122, classificacaoEtaria: 16 },
  ];

  const filmesCreated = [];
  for (const filme of filmes) {
    const existente = await prisma.filme.findFirst({ where: { titulo: filme.titulo } });
    filmesCreated.push(existente ?? (await prisma.filme.create({ data: filme })));
  }

  console.log('✅ Filmes criados');

  // ── Sessões ────────────────────────────────────────────────────────────────
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  if ((await prisma.sessao.count()) === 0) await prisma.sessao.createMany({
    data: [
      {
        filmeId: filmesCreated[0].id,
        salaId: sala1.id,
        dataHorario: new Date(hoje.setHours(19, 0, 0, 0)),
        valorIngresso: 30.0,
      },
      {
        filmeId: filmesCreated[0].id,
        salaId: sala2.id,
        dataHorario: new Date(hoje.setHours(21, 30, 0, 0)),
        valorIngresso: 25.0,
      },
      {
        filmeId: filmesCreated[1].id,
        salaId: sala1.id,
        dataHorario: new Date(amanha.setHours(18, 0, 0, 0)),
        valorIngresso: 35.0,
      },
      {
        filmeId: filmesCreated[2].id,
        salaId: sala2.id,
        dataHorario: new Date(amanha.setHours(15, 0, 0, 0)),
        valorIngresso: 20.0,
      },
    ],
  });

  console.log('✅ Sessões criadas');

  // ── Snacks ─────────────────────────────────────────────────────────────────
  if ((await prisma.snack.count()) === 0) await prisma.snack.createMany({
    data: [
      { nome: 'Pipoca Média', preco: 12.0 },
      { nome: 'Pipoca Grande', preco: 16.0 },
      { nome: 'Refrigerante', preco: 10.0 },
      { nome: 'Água', preco: 6.0 },
      { nome: 'Nachos', preco: 18.0 },
      { nome: 'Combo (Pipoca G + Refri)', preco: 24.0 },
    ],
  });

  console.log('✅ Snacks criados');

  // ── Usuário admin de teste ─────────────────────────────────────────────────
  const hash = await bcrypt.hash('senha123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@cinema.com' },
    update: { role: 'ADMIN' },
    create: {
      nome: 'Admin Cinema',
      email: 'admin@cinema.com',
      senha: hash,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@cinema.com' },
    update: {},
    create: {
      name: 'Admin Cinema',
      email: 'admin@cinema.com',
      password: hash,
    },
  });

  console.log('✅ Usuário de teste criado: admin@cinema.com / senha123');
  console.log('🎬 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
