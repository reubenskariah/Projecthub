'use server';

import { supabase } from '@/lib/supabase';

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
 * Creates a new project call, calculates the expiration date, and inserts it into the database.
 */
export async function createProjectCall(formData: FormData, selectedKeywords: string[]) {
  try {
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const caller_name = formData.get('caller_name') as string;
    const caller_dept = formData.get('caller_dept') as string;
    const slots_needed = parseInt(formData.get('slots_needed') as string, 10);
    const review_days = parseInt(formData.get('review_days') as string, 10);

    if (!title || !abstract || !caller_name || !caller_dept || isNaN(slots_needed) || isNaN(review_days)) {
      return { success: false, error: 'Missing or invalid fields in form submission.' };
    }

    // Dynamically calculate expires_at (Current date + review_days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + review_days);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        abstract,
        caller_name,
        caller_dept,
        slots_needed,
        review_days,
        expires_at: expiresAt.toISOString(),
        keywords: selectedKeywords,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error in createProjectCall server action:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Fetches active projects from the active_projects view.
 * Optionally filters by keyword and orders by created_at descending.
 */
export async function fetchActiveProjects(keywordFilter?: string) {
  try {
    let query = supabase.from('active_projects').select('*');

    if (keywordFilter && keywordFilter.trim() !== '') {
      // Uses the Postgres .contains array operator to return only matching projects
      query = query.contains('keywords', [keywordFilter.trim()]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching active projects:', error);
      return { success: false, error: error.message, data: [] };
    }

    // Fetch applicants for each active project to display confirmed/waitlisted members
    const projectsWithApplicants = await Promise.all(
      (data || []).map(async (project: any) => {
        const { data: applicants, error: appError } = await supabase
          .from('applicants')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: true });

        return {
          ...project,
          applicants: appError ? [] : applicants
        };
      })
    );

    return { success: true, data: projectsWithApplicants };
  } catch (err: any) {
    console.error('Error in fetchActiveProjects server action:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.', data: [] };
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
  try {
    if (!applicant.name || !applicant.dept_sem || !applicant.linkedin_url) {
      return { success: false, error: 'Name, Dept/Sem, and LinkedIn URL are all required.' };
    }

    // Validate LinkedIn URL basic format
    const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/i;
    if (!urlPattern.test(applicant.linkedin_url)) {
      return { success: false, error: 'Please enter a valid LinkedIn URL (e.g. linkedin.com/in/username).' };
    }

    // 1. Fetch the project details to find slots_needed
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('slots_needed')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return { success: false, error: 'Project not found.' };
    }

    const slotsNeeded = project.slots_needed;

    // 2. Fetch existing applicants for this project to check slot and waitlist counts
    const { data: existingApplicants, error: applicantsError } = await supabase
      .from('applicants')
      .select('status')
      .eq('project_id', projectId);

    if (applicantsError) {
      return { success: false, error: applicantsError.message };
    }

    const confirmedCount = (existingApplicants || []).filter(a => a.status === 'confirmed').length;
    const totalCount = (existingApplicants || []).length;

    // Implements an oversubscription waitlist buffer (allows entries up to double the requested team size)
    const maxAllowed = slotsNeeded * 2;
    if (totalCount >= maxAllowed) {
      return {
        success: false,
        error: `Oversubscription buffer reached. This project has already reached its maximum application limit (${maxAllowed}).`
      };
    }

    // If remaining slot counts are open, status is 'confirmed'. Otherwise, it is 'waitlist'.
    const status = confirmedCount < slotsNeeded ? 'confirmed' : 'waitlist';

    // 3. Insert applicant record
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

    return {
      success: true,
      status,
      data: inserted,
      message: status === 'confirmed'
        ? "Slot successfully reserved! The project creator can now view your professional profile."
        : "The confirmed slots are full. You have been placed on the waitlist."
    };
  } catch (err: any) {
    console.error('Error in reserveProjectSlot server action:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
