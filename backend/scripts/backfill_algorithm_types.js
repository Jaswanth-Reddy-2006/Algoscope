const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  console.log('🚀 Starting AlgorithmType Backfill...');
  
  const problems = await prisma.problem.findMany({
    where: {
      status: 'complete',
      OR: [
        { algorithmType: null },
        { algorithmType: '' },
        { algorithmType: 'arrays' },
        { algorithmType: 'array' }
      ]
    },
    select: {
      id: true,
      title: true,
      primaryPattern: true,
      algorithmType: true
    }
  });

  console.log(`🔍 Found ${problems.length} problems to refine.`);

  const typeMap = {
    'two pointers': 'two_pointers',
    'sliding window': 'sliding_window',
    'linked list': 'linked_list',
    'binary search': 'binary_search',
    'tree': 'tree',
    'dfs': 'recursion',
    'bfs': 'graph',
    'heap': 'heap',
    'trie': 'trie',
    'stack': 'stack',
    'queue': 'queue',
    'matrix': 'matrix',
    'bit': 'bit_manipulation',
    'kadane': 'arrays',
    'greedy': 'arrays',
    'sorting': 'arrays',
    'backtracking': 'recursion',
    'hash map': 'hash_table'
  };

  let updatedCount = 0;

  for (const prob of problems) {
    const pattern = (prob.primaryPattern || "").toLowerCase();
    let newType = null;

    for (const [key, type] of Object.entries(typeMap)) {
      if (pattern.includes(key)) {
        newType = type;
        break;
      }
    }

    if (newType && newType !== prob.algorithmType) {
      await prisma.problem.update({
        where: { id: prob.id },
        data: { algorithmType: newType }
      });
      console.log(`✅ Updated [${prob.title}]: ${prob.algorithmType || 'null'} -> ${newType} (Pattern: ${prob.primaryPattern})`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Backfill Complete! Updated ${updatedCount} problems.`);
  process.exit(0);
}

backfill().catch(err => {
  console.error(err);
  process.exit(1);
});
