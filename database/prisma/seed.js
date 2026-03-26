const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const problemsPath = path.join(__dirname, '../../problems_expanded.json');
  
  if (!fs.existsSync(problemsPath)) {
    console.error('Could not find problems_expanded.json at', problemsPath);
    return;
  }

  const rawData = fs.readFileSync(problemsPath, 'utf8');
  const problems = JSON.parse(rawData);

  console.log(`Found ${problems.length} problems in JSON.`);

  for (const p of problems) {
    try {
      await prisma.problem.upsert({
        where: { slug: p.slug },
        update: {
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          algorithmType: p.algorithmType,
          status: p.status,
          tags: JSON.stringify(p.tags || []),
          primaryPattern: p.primaryPattern,
          shortPatternReason: p.shortPatternReason,
          time_complexity: p.time_complexity,
          space_complexity: p.space_complexity,
          problem_statement: p.problem_statement,
          constraints: JSON.stringify(p.constraints || []),
          examples: JSON.stringify(p.examples || []),
          brute_force_explanation: p.brute_force_explanation,
          optimal_explanation: p.optimal_explanation,
          brute_force_steps: JSON.stringify(p.brute_force_steps || []),
          optimal_steps: JSON.stringify(p.optimal_steps || []),
          complexity: JSON.stringify(p.complexity || {}),
          patternSignals: JSON.stringify(p.patternSignals || []),
          edgeCases: JSON.stringify(p.edgeCases || []),
          thinking_guide: JSON.stringify(p.thinking_guide || {}),
          secondaryPatterns: JSON.stringify(p.secondaryPatterns || [])
        },
        create: {
          id: p.id,
          slug: p.slug,
          title: p.title,
          difficulty: p.difficulty,
          algorithmType: p.algorithmType,
          status: p.status,
          tags: JSON.stringify(p.tags || []),
          primaryPattern: p.primaryPattern,
          shortPatternReason: p.shortPatternReason,
          time_complexity: p.time_complexity,
          space_complexity: p.space_complexity,
          problem_statement: p.problem_statement,
          constraints: JSON.stringify(p.constraints || []),
          examples: JSON.stringify(p.examples || []),
          brute_force_explanation: p.brute_force_explanation,
          optimal_explanation: p.optimal_explanation,
          brute_force_steps: JSON.stringify(p.brute_force_steps || []),
          optimal_steps: JSON.stringify(p.optimal_steps || []),
          complexity: JSON.stringify(p.complexity || {}),
          patternSignals: JSON.stringify(p.patternSignals || []),
          edgeCases: JSON.stringify(p.edgeCases || []),
          thinking_guide: JSON.stringify(p.thinking_guide || {}),
          secondaryPatterns: JSON.stringify(p.secondaryPatterns || [])
        }
      });
    } catch (err) {
      console.error(`Failed to seed problem ${p.slug}:`, err.message);
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
