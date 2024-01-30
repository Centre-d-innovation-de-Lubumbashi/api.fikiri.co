import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as process from 'process';


const prisma = new PrismaClient();

async function main() {
  await prisma.label.createMany({
    data: [{ name: 'Bien' }, { name: 'Médiocre' }, { name: 'Assez bien' }, { name: 'Null' }, { name: 'Excellent' }, { name: 'Moyen' }, { name: 'Très bien' }, { name: 'Infrastructures' }],
  });

  await prisma.organisation.createMany({
    data: [
      { name: 'Ministère de l\'Environnement' },
      { name: 'Ministère de l\'Agriculture' },
      { name: 'Ministère de l\'Economie' },
      { name: 'Ministère de l\'Industrie' },
      { name: 'Ministère de l\'Energie' },
      { name: 'Ministère de l\'Enseignement' }
    ]
  })

  await prisma.pole.createMany({
    data: [{ name: 'Nord' }, { name: 'Sud' }, { name: 'Est' }, { name: 'Ouest' }],
  });

  await prisma.role.createMany({
    data: [{ name: 'ADMIN' }, { name: 'CURATOR' }, { name: 'EXPLORATOR' }, { name: 'USER' }],
  });

  await prisma.status.createMany({
    data: [{ name: 'En attente' }, { name: 'Cartographiée' }, { name: 'Explorée' }, { name: 'Experimentée' }],
  });

  await prisma.user.create({
    data: {
      name: 'Wilfried Musanzi',
      email: 'musanziwilfried@gmail.com',
      password: await bcrypt.hash('admin', 10),
      phoneNumber: '+243999999999',
      address: faker.location.streetAddress(),
      roles: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Moses Kal',
      email: 'moseskal@gmail.com',
      password: await bcrypt.hash('admin', 10),
      phoneNumber: '+243999999999',
      address: faker.location.streetAddress(),
      roles: {
        connect: {
          id: 2,
        },
      },
    },
  });

  for (let i = 0; i <= 120; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('12345', 10),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        roles: {
          connect: {
            id: 4,
          },
        },
      },
    });
  }

  for (let i = 0; i <= 5; i++) {
    const thematics = new Array(faker.number.int({ min: 5, max: 9 }))
      .fill(0)
      .map(() => {
        const challenges = new Array(faker.number.int({ min: 5, max: 9 }))
          .fill(0)
          .map(() => ({
            name: faker.lorem.words(15),
          }));
        return {
          name: faker.lorem.words(20),
          odds: `${faker.number.int({ min: 1, max: 17 })}, ${faker.number.int({ min: 1, max: 17 })}`,
          challenges: {
            create: challenges,
          },
        };
      });

    await prisma.call.create({
      data: {
        name: faker.lorem.words(10),
        startedAt: faker.date.past(),
        endedAt: faker.date.future(),
        description: faker.lorem.paragraph(),
        thematics: {
          create: thematics,
        },
      },
    });
  }

  for (let i = 0; i <= 120; i++) {
    await prisma.solution.create({
      data: {
        name: faker.lorem.words(18),
        description: faker.lorem.paragraph(),
        targetedProblem: faker.lorem.paragraph(),
        thematic: {
          connect: {
            id: faker.number.int({ min: 1, max: 9 }),
          },
        },
        pole: {
          connect: {
            id: faker.number.int({ min: 1, max: 4 }),
          }
        },
        call: {
          connect: {
            id: 1,
          },
        },
        user: {
          connect: {
            id: i + 1,
          },
        },
        challenges: {
          connect: {
            id: faker.number.int({ min: 1, max: 9 }),
          },
        },
        status: {
          connect: {
            id: faker.number.int({ min: 1, max: 3 }),
          },
        },
      },
    });
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });