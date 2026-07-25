'use server';

import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

function isDbConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('placeholder-url') && !key.includes('placeholder-anon'));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const ENV_ERROR = {
  success: false,
  error: 'Supabase environment variables are missing on Vercel. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Project Settings and redeploy.'
};

export interface ProjectCall {
  id: string;
  title: string;
  abstract: string;
  caller_name: string;
  caller_dept: string;
  slots_needed: number;
  review_days: number;
  expires_at: string;
  keywords: string[];
  status: string;
  created_at: string;
}

export interface Applicant {
  id?: string;
  project_id: string;
  name: string;
  dept_sem: string;
  linkedin_url: string;
  status: 'confirmed' | 'waitlist';
  created_at?: string;
}

/**
 * Creates a new project call, calculates the expiration date, and inserts it with status set to 'pending'.
 */
export async function createProjectCall(formData: FormData, selectedKeywords: string[]) {
  if (!isDbConfigured()) return ENV_ERROR;
  try {
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const caller_name = formData.get('caller_name') as string;
    const caller_dept = formData.get('caller_dept') as string;
    const caller_email = formData.get('caller_email') as string;
    const passkey = formData.get('passkey') as string;
    const slots_needed = parseInt(formData.get('slots_needed') as string, 10);
    const review_days = parseInt(formData.get('review_days') as string, 10);

    if (!title || !abstract || !caller_name || !caller_dept || !caller_email || !passkey || isNaN(slots_needed) || isNaN(review_days)) {
      return { success: false, error: 'Missing or invalid fields in form submission.' };
    }

    if (slots_needed < 2 || slots_needed > 6) {
      return { success: false, error: 'Team size must be between 2 and 6 participants.' };
    }

    // Backend length limits for spam control
    if (title.length > 200) {
      return { success: false, error: 'Project title exceeds maximum length of 200 characters.' };
    }
    if (abstract.length > 5000) {
      return { success: false, error: 'Project abstract exceeds maximum length of 5000 characters.' };
    }
    if (caller_name.length > 100) {
      return { success: false, error: 'Your name exceeds maximum length of 100 characters.' };
    }

    // Strict regex email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(caller_email.trim())) {
      return { success: false, error: 'Please enter a valid email address (e.g. name@college.edu).' };
    }

    // Passkey validation
    const passkeyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/;`~|]).{8}$/;
    if (!passkeyRegex.test(passkey)) {
      return { success: false, error: 'Passkey must be exactly 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.' };
    }

    // Escape HTML tags to prevent Cross-Site Scripting (XSS)
    const escapedTitle = escapeHtml(title);
    const escapedAbstract = escapeHtml(abstract);
    const escapedCallerName = escapeHtml(caller_name);

    // Dynamically calculate expires_at (Current date + review_days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + review_days);

    // Default status is 'pending' for review approval
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: escapedTitle,
        abstract: escapedAbstract,
        caller_name: escapedCallerName,
        caller_dept,
        caller_email: caller_email.trim(),
        passkey: passkey.trim(),
        slots_needed,
        review_days,
        expires_at: expiresAt.toISOString(),
        keywords: selectedKeywords,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('Error in createProjectCall server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Fetches active projects from the database, nested-selecting applicants in a single query.
 */
export async function fetchActiveProjects(keywordFilter?: string) {
  if (!isDbConfigured()) return { success: false, error: ENV_ERROR.error, data: [] };
  try {
    let query = supabase
      .from('projects')
      .select('*, applicants(*)')
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString());

    if (keywordFilter && keywordFilter.trim() !== '') {
      query = query.contains('keywords', [keywordFilter.trim()]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching active projects:', error);
      return { success: false, error: error.message, data: [] };
    }

    // Sort applicants for each project and filter out filled ones
    const activeProjects = ((data || []) as (ProjectCall & { applicants: Applicant[] })[])
      .map((project) => {
        const sortedApplicants = (project.applicants || []).sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        );
        return {
          ...project,
          applicants: sortedApplicants
        };
      })
      .filter((project) => {
        const confirmedCount = project.applicants.filter((a) => a.status === 'confirmed').length;
        return confirmedCount < project.slots_needed;
      });

    return { success: true, data: activeProjects };
  } catch (err: unknown) {
    console.error('Error in fetchActiveProjects server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.', data: [] };
  }
}

/**
 * Fetches all pending projects (status = 'pending') for the admin queue.
 */
export async function fetchPendingProjects() {
  if (!isDbConfigured()) return { success: false, error: ENV_ERROR.error, data: [] };
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching pending projects:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    console.error('Error in fetchPendingProjects:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.', data: [] };
  }
}

/**
 * Fetches all projects (both active and pending) for the admin directory, nested-selecting applicants in a single query.
 */
export async function fetchAllProjects() {
  if (!isDbConfigured()) return { success: false, error: ENV_ERROR.error, data: [] };
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, applicants(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching all projects:', error);
      return { success: false, error: error.message, data: [] };
    }

    // Sort applicants for each project
    const projectsWithApplicants = ((data || []) as (ProjectCall & { applicants: Applicant[] })[]).map((project) => {
      const sortedApplicants = (project.applicants || []).sort(
        (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      return {
        ...project,
        applicants: sortedApplicants
      };
    });

    return { success: true, data: projectsWithApplicants };
  } catch (err: unknown) {
    console.error('Error in fetchAllProjects:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.', data: [] };
  }
}

/**
 * Approves a project call: sets status to 'active' and bumps created_at to NOW() (putting it at top of feed).
 */
export async function approveProjectCall(projectId: string, adminPass: string) {
  if (!isDbConfigured()) return ENV_ERROR;
  if (adminPass !== 'iykyk@things') {
    return { success: false, error: 'Unauthorized: Invalid admin credentials.' };
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'active',
        created_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error approving project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('Error in approveProjectCall:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Deletes a project call: ensures related applicant bookings are deleted first to avoid FK constraint errors.
 */
export async function deleteProjectCall(projectId: string, adminPass: string) {
  if (!isDbConfigured()) return ENV_ERROR;
  if (adminPass !== 'iykyk@things') {
    return { success: false, error: 'Unauthorized: Invalid admin credentials.' };
  }
  try {
    // 1. Delete associated applicant bookings first
    const { error: appDeleteError } = await supabase
      .from('applicants')
      .delete()
      .eq('project_id', projectId);

    if (appDeleteError) {
      console.error('Supabase error deleting applicants for project:', appDeleteError);
      return { success: false, error: appDeleteError.message };
    }

    // 2. Delete the project record
    const { error: projectDeleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (projectDeleteError) {
      console.error('Supabase error deleting project:', projectDeleteError);
      return { success: false, error: projectDeleteError.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error in deleteProjectCall:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Reserves a slot for an applicant.
 * Validates remaining slots and waitlist buffer (double slots_needed).
 */
export async function reserveProjectSlot(
  projectId: string,
  applicant: { name: string; dept_sem: string; linkedin_url: string }
) {
  if (!isDbConfigured()) return ENV_ERROR;
  try {
    if (!applicant.name || !applicant.dept_sem || !applicant.linkedin_url) {
      return { success: false, error: 'Name, Dept/Sem, and LinkedIn URL are all required.' };
    }

    // Backend length limits for spam control
    if (applicant.name.length > 100) {
      return { success: false, error: 'Name exceeds maximum length of 100 characters.' };
    }
    if (applicant.dept_sem.length > 50) {
      return { success: false, error: 'Department/Semester exceeds maximum length of 50 characters.' };
    }
    if (applicant.linkedin_url.length > 200) {
      return { success: false, error: 'LinkedIn URL exceeds maximum length of 200 characters.' };
    }

    // Validate LinkedIn URL basic format
    const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/i;
    if (!urlPattern.test(applicant.linkedin_url)) {
      return { success: false, error: 'Please enter a valid LinkedIn URL (e.g. linkedin.com/in/username).' };
    }

    // Fetch project details to find slots_needed
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('slots_needed')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return { success: false, error: 'Project not found.' };
    }

    const slotsNeeded = project.slots_needed;

    // Fetch existing applicants to check slots and waitlist counts
    const { data: existingApplicants, error: applicantsError } = await supabase
      .from('applicants')
      .select('status')
      .eq('project_id', projectId);

    if (applicantsError) {
      return { success: false, error: applicantsError.message };
    }

    const confirmedCount = (existingApplicants || []).filter(a => a.status === 'confirmed').length;
    const totalCount = (existingApplicants || []).length;

    // Oversubscription limit
    const maxAllowed = slotsNeeded * 2;
    if (totalCount >= maxAllowed) {
      return {
        success: false,
        error: `Oversubscription buffer reached. This project has already reached its maximum application limit (${maxAllowed}).`
      };
    }

    // Status: confirmed if remaining slots are open, else waitlist.
    const status = confirmedCount < slotsNeeded ? 'confirmed' : 'waitlist';

    // Insert applicant record
    const { data: inserted, error: insertError } = await supabase
      .from('applicants')
      .insert({
        project_id: projectId,
        name: applicant.name,
        dept_sem: applicant.dept_sem,
        linkedin_url: applicant.linkedin_url,
        status
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    const isCompletedNow = status === 'confirmed' && confirmedCount + 1 === slotsNeeded;
    if (isCompletedNow) {
      await sendProjectReportEmail(projectId);
    }

    return {
      success: true,
      status,
      data: inserted,
      message: isCompletedNow
        ? "Slot successfully reserved! All target slots are now filled and the project creator has been instantly notified by email."
        : status === 'confirmed'
        ? "Slot successfully reserved! The project creator can now view your professional profile."
        : "The confirmed slots are full. You have been placed on the waitlist."
    };
  } catch (err: unknown) {
    console.error('Error in reserveProjectSlot server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Fetches mentors from the database. Falls back if table doesn't exist.
 */
export async function fetchMentors() {
  if (!isDbConfigured()) return { success: false, isTableMissing: true, data: [] };
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error fetching mentors:', error);
      if (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('relation "mentors"')) {
        return { success: false, isTableMissing: true, data: [] };
      }
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    console.error('Error in fetchMentors:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.', data: [] };
  }
}

/**
 * Adds a new mentor to the database.
 */
export async function addMentor(mentor: { name: string; college: string; dept: string; contact: string }, adminPass: string) {
  if (adminPass !== 'iykyk@things') {
    return { success: false, error: 'Unauthorized: Invalid admin credentials.' };
  }
  if (!isDbConfigured()) return { success: false, isTableMissing: true };
  try {
    const { data, error } = await supabase
      .from('mentors')
      .insert({
        name: mentor.name,
        college: mentor.college,
        dept: mentor.dept,
        contact: mentor.contact
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding mentor:', error);
      if (error.message.includes('does not exist') || error.message.includes('relation "mentors"')) {
        return { success: false, isTableMissing: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Updates an existing mentor in the database.
 */
export async function updateMentor(mentor: { id: string; name: string; college: string; dept: string; contact: string }, adminPass: string) {
  if (adminPass !== 'iykyk@things') {
    return { success: false, error: 'Unauthorized: Invalid admin credentials.' };
  }
  if (!isDbConfigured()) return { success: false, isTableMissing: true };
  try {
    const { data, error } = await supabase
      .from('mentors')
      .update({
        name: mentor.name,
        college: mentor.college,
        dept: mentor.dept,
        contact: mentor.contact
      })
      .eq('id', mentor.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating mentor:', error);
      if (error.message.includes('does not exist') || error.message.includes('relation "mentors"')) {
        return { success: false, isTableMissing: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Deletes a mentor from the database.
 */
export async function deleteMentor(mentorId: string, adminPass: string) {
  if (adminPass !== 'iykyk@things') {
    return { success: false, error: 'Unauthorized: Invalid admin credentials.' };
  }
  if (!isDbConfigured()) return { success: false, isTableMissing: true };
  try {
    const { error } = await supabase
      .from('mentors')
      .delete()
      .eq('id', mentorId);

    if (error) {
      console.error('Supabase error deleting mentor:', error);
      if (error.message.includes('does not exist') || error.message.includes('relation "mentors"')) {
        return { success: false, isTableMissing: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Updates a project call by the creator, verifying the creator's email address.
 */
export async function updateProjectAsCreator(
  projectId: string,
  callerEmail: string,
  passkey: string,
  formData: FormData,
  selectedKeywords: string[]
) {
  if (!isDbConfigured()) return ENV_ERROR;
  try {
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const caller_dept = formData.get('caller_dept') as string;
    const slots_needed = parseInt(formData.get('slots_needed') as string, 10);
    const review_days = parseInt(formData.get('review_days') as string, 10);

    if (!title || !abstract || !caller_dept || isNaN(slots_needed) || isNaN(review_days) || !callerEmail || !passkey) {
      return { success: false, error: 'Missing or invalid fields in form submission.' };
    }

    if (slots_needed < 2 || slots_needed > 6) {
      return { success: false, error: 'Team size must be between 2 and 6 participants.' };
    }

    // Backend length limits for spam control
    if (title.length > 200) {
      return { success: false, error: 'Project title exceeds maximum length of 200 characters.' };
    }
    if (abstract.length > 5000) {
      return { success: false, error: 'Project abstract exceeds maximum length of 5000 characters.' };
    }

    // Fetch the project to verify caller email and passkey
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('caller_email, passkey, status')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return { success: false, error: 'Project not found.' };
    }

    if (project.caller_email.toLowerCase().trim() !== callerEmail.toLowerCase().trim()) {
      return { success: false, error: 'Unauthorized: The provided email does not match the project creator\'s email.' };
    }

    if (project.passkey && project.passkey.trim() !== passkey.trim()) {
      return { success: false, error: 'Unauthorized: Invalid passkey.' };
    }

    // Escape HTML tags to prevent XSS
    const escapedTitle = escapeHtml(title);
    const escapedAbstract = escapeHtml(abstract);

    // Dynamically calculate expires_at (Current date + review_days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + review_days);

    const { data, error } = await supabase
      .from('projects')
      .update({
        title: escapedTitle,
        abstract: escapedAbstract,
        caller_dept,
        slots_needed,
        review_days,
        expires_at: expiresAt.toISOString(),
        keywords: selectedKeywords
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('Error in updateProjectAsCreator server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Deletes a project call by the creator, verifying the creator's email address.
 */
export async function deleteProjectAsCreator(projectId: string, callerEmail: string, passkey: string) {
  if (!isDbConfigured()) return ENV_ERROR;
  if (!callerEmail || !passkey) {
    return { success: false, error: 'Email and passkey are required to delete the project.' };
  }
  try {
    // Fetch the project to verify caller email and passkey
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('caller_email, passkey')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return { success: false, error: 'Project not found.' };
    }

    if (project.caller_email.toLowerCase().trim() !== callerEmail.toLowerCase().trim()) {
      return { success: false, error: 'Unauthorized: The provided email does not match the project creator\'s email.' };
    }

    if (project.passkey && project.passkey.trim() !== passkey.trim()) {
      return { success: false, error: 'Unauthorized: Invalid passkey.' };
    }

    // Delete associated applicant bookings first
    const { error: appDeleteError } = await supabase
      .from('applicants')
      .delete()
      .eq('project_id', projectId);

    if (appDeleteError) {
      console.error('Supabase error deleting applicants for project:', appDeleteError);
      return { success: false, error: appDeleteError.message };
    }

    // Delete the project record
    const { error: projectDeleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (projectDeleteError) {
      console.error('Supabase error deleting project:', projectDeleteError);
      return { success: false, error: projectDeleteError.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error in deleteProjectAsCreator server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}

/**
 * Sends a summary matching report of candidates to the project creator's email.
 * This runs when a project's review window concludes or when it is fully matched early.
 */
export async function sendProjectReportEmail(projectId: string) {
  if (!isDbConfigured()) return { success: false, error: 'Database not configured.' };
  try {
    // 1. Fetch project details and applicants
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*, applicants(*)')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      console.error('Error fetching project for email summary report:', fetchError);
      return { success: false, error: 'Project not found.' };
    }

    // Prevent duplicate emails
    if (project.email_sent) {
      return { success: true, message: 'Email has already been sent.' };
    }

    const callerEmail = project.caller_email;
    if (!callerEmail) {
      // Mark as sent to prevent loop blockages
      await supabase.from('projects').update({ email_sent: true }).eq('id', projectId);
      return { success: false, error: 'Creator email address is missing.' };
    }

    const applicants = project.applicants || [];
    
    // Build candidate list HTML table
    let applicantsHtml = '';
    if (applicants.length === 0) {
      applicantsHtml = `<p style="font-style: italic; color: #4a6178; font-family: sans-serif;">No slot reservations were made for this project call.</p>`;
    } else {
      // Sort applicants by creation date
      const sortedApplicants = [...applicants].sort(
        (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      
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
            ${sortedApplicants.map((app) => `
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

    const isEarlyCompletion = new Date().getTime() < new Date(project.expires_at).getTime();
    
    // Build clean HTML summary template
    const emailBody = `
      <div style="max-width: 600px; margin: 0 auto; padding: 24px; font-family: sans-serif; background-color: #ffffff; color: #0f2a47; border: 1.5px solid #0f2a47; box-shadow: 4px 4px 0 #0f2a47; border-radius: 4px;">
        <h2 style="font-family: monospace; color: #0f2a47; border-bottom: 2px dashed #0f2a47; padding-bottom: 10px; margin-top: 0;">
          ${isEarlyCompletion ? 'PROJECT MATCH COMPLETED (EARLY)' : 'PROJECT MATCHING REPORT'}
        </h2>
        <p>Hello <strong>${project.caller_name}</strong>,</p>
        <p>
          ${isEarlyCompletion 
            ? `All target slots for your project call <strong>"${project.title}"</strong> have been successfully reserved early!` 
            : `The review window for your project call <strong>"${project.title}"</strong> has concluded.`}
          Here is the final summary of slot reservations and waitlist applications from your campus team match:
        </p>
        
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

    // 4. Send email via SMTP, SendGrid, or Resend API POST request
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!smtpUser && !smtpPass && !sendgridApiKey && !resendApiKey) {
      console.error('Neither SMTP_USER, SENDGRID_API_KEY nor RESEND_API_KEY is defined in environment variables. Marking status as closed and email_sent as true to prevent queue blockage.');
      await supabase
        .from('projects')
        .update({
          status: 'closed',
          email_sent: true
        })
        .eq('id', projectId);
      return { success: false, error: 'Email service API keys are not configured.' };
    }

    const subject = isEarlyCompletion 
      ? `Project Match Completed (Early): ${project.title}`
      : `Project Match Complete: ${project.title}`;

    let setSent = false;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"ProjectHub" <${smtpUser}>`,
          to: callerEmail,
          subject: subject,
          html: emailBody
        });

        setSent = true;
      } catch (smtpError) {
        console.error(`Gmail SMTP sending failed for project ${projectId}:`, smtpError);
      }
    } else if (sendgridApiKey) {
      const fromEmail = process.env.EMAIL_FROM || 'reubenin12@gmail.com'; // Default verified Single Sender Gmail
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sendgridApiKey}`
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: callerEmail }]
            }
          ],
          from: {
            email: fromEmail,
            name: 'ProjectHub'
          },
          subject: subject,
          content: [
            {
              type: 'text/html',
              value: emailBody
            }
          ]
        })
      });

      if (emailResponse.ok) {
        setSent = true;
      } else {
        const errorText = await emailResponse.text();
        console.error(`SendGrid API failed for project ${projectId}:`, errorText);
        if (emailResponse.status === 400 || emailResponse.status === 401 || emailResponse.status === 403) {
          setSent = true; // Mark as sent to prevent loops
        }
      }
    } else if (resendApiKey) {
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
          subject: subject,
          html: emailBody
        })
      });

      if (emailResponse.ok) {
        setSent = true;
      } else {
        const errorText = await emailResponse.text();
        console.error(`Resend API failed for project ${projectId}:`, errorText);
        if (emailResponse.status === 400 || emailResponse.status === 401 || emailResponse.status === 403 || emailResponse.status === 422) {
          setSent = true;
        }
      }
    }

    // 5. Always update status to closed and set the computed email_sent status
    await supabase
      .from('projects')
      .update({
        status: 'closed',
        email_sent: setSent
      })
      .eq('id', projectId);

    return { success: true };
  } catch (err: unknown) {
    console.error('Error in sendProjectReportEmail server action:', err);
    return { success: false, error: (err as Error).message || 'An unexpected error occurred.' };
  }
}


