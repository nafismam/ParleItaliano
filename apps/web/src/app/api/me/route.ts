import { NextResponse } from 'next/server';
import { User } from '@parle/database';
import { requireUser } from '@/server/authorization';
import { apiHandler } from '@/server/http';
export const GET = apiHandler(async () => {
  const user = await requireUser();
  const profile = await User.findById(user.id)
    .select('name email avatarUrl currentLevel xp streakDays lastActiveDate role')
    .lean();
  return NextResponse.json({ user: profile });
});
