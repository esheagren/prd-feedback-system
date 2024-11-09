import { prisma } from './prisma';

// Error handling wrapper
async function handleDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error('Database operation failed');
  }
}

// PRD Operations with Vercel Postgres optimizations
export async function createPRD(sections: any) {
  return handleDbOperation(async () => {
    const prd = await prisma.prd.create({
      data: {
        content: sections
      }
    });
    
    // Return minimal data for initial response
    return {
      id: prd.id,
      createdAt: prd.createdAt
    };
  });
}

export async function getPRD(id: string) {
  return handleDbOperation(() => 
    prisma.prd.findUnique({
      where: { id },
      include: { 
        feedback: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  );
}

// Optimized query for dashboard
export async function getDashboardStats() {
  return handleDbOperation(async () => {
    // Use Promise.all for parallel queries
    const [totalPRDs, totalFeedback, recentPRDs] = await Promise.all([
      prisma.prd.count(),
      prisma.feedback.count(),
      prisma.prd.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          feedback: {
            take: 2, // Only get 2 most recent feedback items
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    ]);

    return {
      totalPRDs,
      totalFeedback,
      averageFeedbackPerPRD: totalPRDs ? totalFeedback / totalPRDs : 0,
      recentPRDs
    };
  });
}