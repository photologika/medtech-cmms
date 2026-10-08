const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Dispatcher
  await prisma.user.upsert({
    where: { email: 'dispatcher@med.ru' },
    update: {},
    create: {
      email: 'dispatcher@med.ru',
      name: 'Иван Диспетчер',
      password: passwordHash,
      role: 'DISPATCHER',
    },
  });

  // Technician 1
  await prisma.user.upsert({
    where: { email: 'tech1@med.ru' },
    update: {},
    create: {
      email: 'tech1@med.ru',
      name: 'Петр Мастер',
      password: passwordHash,
      role: 'TECHNICIAN',
    },
  });
  
  // Technician 2
  await prisma.user.upsert({
    where: { email: 'tech2@med.ru' },
    update: {},
    create: {
      email: 'tech2@med.ru',
      name: 'Сергей Мастер',
      password: passwordHash,
      role: 'TECHNICIAN',
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
