import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Developer',
      passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Student',
      passwordHash,
    },
  });

  // Create Categories
  const agriculture = await prisma.category.upsert({
    where: { slug: 'agriculture' },
    update: {},
    create: { name: 'Agriculture', slug: 'agriculture' },
  });

  const education = await prisma.category.upsert({
    where: { slug: 'education' },
    update: {},
    create: { name: 'Education', slug: 'education' },
  });

  // Create Tags
  const aiTag = await prisma.tag.upsert({
    where: { slug: 'ai' },
    update: {},
    create: { name: 'AI', slug: 'ai' },
  });

  const iotTag = await prisma.tag.upsert({
    where: { slug: 'iot' },
    update: {},
    create: { name: 'IoT', slug: 'iot' },
  });

  const webTag = await prisma.tag.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'Web Development', slug: 'web-development' },
  });

  // Create Ideas
  const cropIdea = await prisma.idea.create({
    data: {
      title: 'AI-Based Crop Disease Detection',
      problem: 'Farmers cannot easily detect plant diseases early, leading to huge crop losses.',
      solution: 'A mobile app that scans leaves and detects diseases using a trained AI model.',
      impact: 'Reduce crop loss by 20% globally.',
      difficulty: 'Intermediate',
      suggestedTechStack: 'Python, TensorFlow, React Native',
      authorId: alice.id,
      categoryId: agriculture.id,
      tags: {
        create: [
          { tagId: aiTag.id },
          { tagId: iotTag.id }
        ]
      }
    }
  });

  const learningIdea = await prisma.idea.create({
    data: {
      title: 'Open Source Interactive Learning Platform',
      problem: 'High-quality interactive learning is often locked behind expensive paywalls.',
      solution: 'A free, open-source platform where educators can create interactive programming lessons.',
      impact: 'Democratize access to premium education.',
      difficulty: 'Advanced',
      suggestedTechStack: 'Next.js, Tailwind CSS, PostgreSQL',
      authorId: bob.id,
      categoryId: education.id,
      tags: {
        create: [
          { tagId: webTag.id }
        ]
      }
    }
  });

  // Create Votes
  await prisma.vote.create({
    data: { ideaId: cropIdea.id, userId: bob.id }
  });

  await prisma.vote.create({
    data: { ideaId: learningIdea.id, userId: alice.id }
  });

  // Create Comments
  await prisma.comment.create({
    data: {
      text: 'This is a fantastic idea! I would love to contribute to the React Native app.',
      ideaId: cropIdea.id,
      userId: bob.id
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
