const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function globalHardening() {
    try {
        console.log("Starting Global Metadata Hardening...");
        
        // Fix common null fields across all problems
        const problems = await prisma.problem.findMany();
        let updateCount = 0;

        for (const p of problems) {
            let needsUpdate = false;
            const updateData = {};

            if (p.tags === null) { updateData.tags = JSON.stringify([]); needsUpdate = true; }
            if (p.constraints === null) { updateData.constraints = JSON.stringify([]); needsUpdate = true; }
            if (p.examples === null) { updateData.examples = JSON.stringify([]); needsUpdate = true; }
            if (p.brute_force_steps === null) { updateData.brute_force_steps = JSON.stringify([]); needsUpdate = true; }
            if (p.optimal_steps === null || p.optimal_steps === '[]') { 
                // Don't update optimal_steps if it's already an empty array, unless we want to populate it.
                // But for null, definitely set to [].
                if (p.optimal_steps === null) {
                    updateData.optimal_steps = JSON.stringify([]); 
                    needsUpdate = true;
                }
            }
            if (p.codeSnippets === null) { updateData.codeSnippets = JSON.stringify([]); needsUpdate = true; }
            if (p.structuredExamples === null) { updateData.structuredExamples = JSON.stringify([]); needsUpdate = true; }
            if (p.companyTags === null) { updateData.companyTags = JSON.stringify([]); needsUpdate = true; }
            if (p.patternSignals === null) { updateData.patternSignals = JSON.stringify([]); needsUpdate = true; }
            if (p.secondaryPatterns === null) { updateData.secondaryPatterns = JSON.stringify([]); needsUpdate = true; }
            if (p.thinking_guide === null) { updateData.thinking_guide = JSON.stringify({}); needsUpdate = true; }

            if (needsUpdate) {
                await prisma.problem.update({
                    where: { id: p.id },
                    data: updateData
                });
                updateCount++;
                if (updateCount % 100 === 0) console.log(`Updated ${updateCount} problems...`);
            }
        }

        console.log(`Global Hardening Complete! Total problems sanitized: ${updateCount}`);
    } catch (error) {
        console.error("Error during global hardening:", error);
    } finally {
        await prisma.$disconnect();
    }
}

globalHardening();
