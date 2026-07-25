import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Applicant, sendProjectReportEmail } from '@/app/actions/projectActions';

export async function POST(req: Request) {
  try {
    // 1. Verify Vercel Cron authorization header (bypassed in development mode)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date().toISOString();

    // 2. Fetch up to 15 expired active or closed projects with unsent emails
    const { data: expiredProjects, error: fetchError } = await supabase
      .from('projects')
      .select('*, applicants(*)')
      .in('status', ['active', 'closed'])
      .eq('email_sent', false)
      .lte('expires_at', now)
      .limit(15);

    if (fetchError) {
      console.error('Supabase error fetching expired projects:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!expiredProjects || expiredProjects.length === 0) {
      return NextResponse.json({ success: true, message: 'No expired projects requiring notifications.' });
    }

    const processed: string[] = [];

    // 3. Process each expired project
    for (const project of expiredProjects) {
      const emailRes = await sendProjectReportEmail(project.id);
      if (emailRes.success) {
        processed.push(project.id);
      } else {
        console.error(`Cron failed to send email report for project ${project.id}:`, emailRes.error);
        const { data: updatedProj } = await supabase
          .from('projects')
          .select('email_sent')
          .eq('id', project.id)
          .single();
        if (updatedProj?.email_sent) {
          processed.push(project.id);
        }
      }
    }

    return NextResponse.json({ success: true, processedCount: processed.length, processedIds: processed });
  } catch (err: unknown) {
    console.error('Error in cron route handler:', err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Next.js App Router route supports GET trigger for Vercel Cron trigger calls
export async function GET(req: Request) {
  return POST(req);
}
