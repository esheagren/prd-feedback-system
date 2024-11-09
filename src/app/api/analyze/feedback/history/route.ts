// src/app/api/feedback/history/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async (req: Request) => {
  try {
    const prds = await prisma.prd.findMany({
      include: {
        feedback: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ prds });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feedback history' },
      { status: 500 }
    );
  }
};