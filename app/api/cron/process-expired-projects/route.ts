import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      const callerEmail = project.caller_email;
      if (!callerEmail) {
        // Mark as sent to avoid getting stuck in the queue if email is missing
        await supabase.from('projects').update({ email_sent: true }).eq('id', project.id);
        continue;
      }

      const applicants = project.applicants || [];
      
      // Build candidate list HTML table
      let applicantsHtml = '';
      if (applicants.length === 0) {
        applicantsHtml = `<p style="font-style: italic; color: #4a6178; font-family: sans-serif;">No slot reservations were made for this project call.</p>`;
      } else {
        applicantsHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-family: sans-serif; font-size: 13px;">
            <thead>
              <tr style="background-color: #0f2a47; color: #ffffff; text-align: left;">
                <th style="padding: 10px; border: 1px solid #c9d6d1;">Name</th>
                <th style="padding: 10px; border: 1px solid #c9d6d1;">Dept/Sem</th>
                <th style="padding: 10px; border: 1px solid #c9d6d1;">LinkedIn Profile</th>
                <th style="padding: 10px; border: 1px solid #c9d6d1;">Match Status</th>
              </tr>
            </thead>
            <tbody>
              ${applicants.map((app: any) => `
                <tr style="border-bottom: 1px solid #eef2ee;">
                  <td style="padding: 10px; border: 1px solid #c9d6d1; font-weight: bold; color: #0f2a47;">${app.name}</td>
                  <td style="padding: 10px; border: 1px solid #c9d6d1;">${app.dept_sem}</td>
                  <td style="padding: 10px; border: 1px solid #c9d6d1;">
                    <a href="${app.linkedin_url.startsWith('http') ? app.linkedin_url : `https://${app.linkedin_url}`}" target="_blank" style="color: #2563EB; font-weight: 600; text-decoration: none;">
                      View LinkedIn Profile
                    </a>
                  </td>
                  <td style="padding: 10px; border: 1px solid #c9d6d1;">
                    <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase; ${
                      app.status === 'confirmed' 
                        ? 'background-color: #e6f4ea; color: #137333;' 
                        : 'background-color: #fef7e0; color: #b06000;'
                    }">
                      ${app.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      // Build clean HTML summary template
      const emailBody = `
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; font-family: sans-serif; background-color: #ffffff; color: #0f2a47; border: 1.5px solid #0f2a47; box-shadow: 4px 4px 0 #0f2a47; border-radius: 4px;">
          <h2 style="font-family: monospace; color: #0f2a47; border-bottom: 2px dashed #0f2a47; padding-bottom: 10px; margin-top: 0;">PROJECT MATCHING REPORT</h2>
          <p>Hello <strong>${project.caller_name}</strong>,</p>
          <p>The review window for your project call <strong>"${project.title}"</strong> has concluded. Here is the final summary of slot reservations and waitlist applications from your campus team match:</p>
          
          <div style="background-color: #eef2ee; border: 1px solid #0f2a47; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
            <span style="font-family: monospace; font-size: 10px; text-transform: uppercase; color: #c68227; font-weight: bold; display: block; margin-bottom: 2px;">PROJECT SUMMARY</span>
            <strong style="font-size: 15px; color: #0f2a47;">${project.title}</strong>
            <div style="font-size: 11.5px; margin-top: 4px; color: #4a6178;">
              Department: ${project.caller_dept} &middot; Total Target Slots: ${project.slots_needed} &middot; Review Window: ${project.review_days} days
            </div>
          </div>

          <h3 style="font-family: monospace; font-size: 14px; text-transform: uppercase; color: #0f2a47; margin: 24px 0 8px 0; border-bottom: 1px dashed #c9d6d1; padding-bottom: 4px;">Candidate Applications</h3>
          ${applicantsHtml}

          <p style="margin-top: 24px; font-size: 12px; color: #4a6178; font-style: italic; border-top: 1px dashed #c9d6d1; padding-top: 10px;">
            This matches the conclusion of your ProjectHub review window. Thank you for using ProjectHub!
          </p>
        </div>
      `;

      // 4. Send email via Resend API POST request
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.error('RESEND_API_KEY is not defined in environment variables. Marking status as closed and email_sent as true to prevent queue blockage.');
        await supabase
          .from('projects')
          .update({
            status: 'closed',
            email_sent: true
          })
          .eq('id', project.id);
        processed.push(project.id);
        continue; 
      }

      // We default to Resend's standard sandbox email for onboarding domains
      const fromEmail = process.env.EMAIL_FROM || 'ProjectHub <onboarding@resend.dev>';

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: callerEmail,
          subject: `Project Match Complete: ${project.title}`,
          html: emailBody
        })
      });

      let setSent = false;
      if (emailResponse.ok) {
        setSent = true;
      } else {
        const errorText = await emailResponse.text();
        console.error(`Resend API failed for project ${project.id}:`, errorText);
        
        // Handle permanent Resend API client errors gracefully to prevent infinite cron loops
        if (emailResponse.status === 400 || emailResponse.status === 401 || emailResponse.status === 403 || emailResponse.status === 422) {
          console.warn(`Permanent email dispatch failure for project ${project.id} (Status ${emailResponse.status}). Marking email_sent = true to prevent blocking the cron queue.`);
          setSent = true;
        }
      }

      // 5. Always update status to closed and set the computed email_sent status
      await supabase
        .from('projects')
        .update({
          status: 'closed',
          email_sent: setSent
        })
        .eq('id', project.id);
      
      processed.push(project.id);
    }

    return NextResponse.json({ success: true, processedCount: processed.length, processedIds: processed });
  } catch (err: any) {
    console.error('Error in cron route handler:', err);
    return NextResponse.json({ success: false, error: err.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Next.js App Router route supports GET trigger for Vercel Cron trigger calls
export async function GET(req: Request) {
  return POST(req);
}
