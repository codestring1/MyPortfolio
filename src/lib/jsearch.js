/**
 * JSearch API Service (RapidAPI)
 * 
 * Documentation: https://rapidapi.com/letscrape-6bR7neUHB/api/jsearch/
 */

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

/**
 * fetchJobs via JSearch
 * 
 * @param {Object} options 
 * @param {string} options.query - The search query (What + Where)
 * @param {number} options.page - Page number
 */
export async function fetchJobs({ what = '', where = '', page = 1 } = {}) {
  try {
    const query = `${what} ${where}`.trim() || 'Software Engineer';
    
    const url = `https://${RAPID_API_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`;
    
    if (!RAPID_API_KEY) {
      console.warn('[JSearch] Missing VITE_RAPID_API_KEY. Returning demo data.');
      return {
        results: [
          {
            id: 'demo-1',
            title: 'Lead Frontend Operative',
            company: 'Cyberdyne Systems',
            location: 'Neo-Tokyo',
            description: 'Building high-performance neural interfaces.',
            category: 'Full-time'
          },
          {
            id: 'demo-2',
            title: 'Full Stack Architect',
            company: 'Orbital Dynamics',
            location: 'L5 Colony',
            description: 'Scaling decentralized communication arrays.',
            category: 'Contract'
          }
        ],
        count: 2
      };
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`Uplink Interrupted: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform JSearch response to our internal schema
    return {
      results: (data.data || []).map(job => ({
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        logo: job.employer_logo,
        location: `${job.job_city ? job.job_city + ', ' : ''}${job.job_country}`,
        description: job.job_description,
        salary_min: job.job_min_salary,
        salary_max: job.job_max_salary,
        currency: job.job_salary_currency || 'INR',
        salary_period: job.job_salary_period,
        redirect_url: job.job_apply_link,
        created: job.job_posted_at_datetime_utc,
        category: job.job_employment_type || 'Full-time'
      })),
      count: data.data?.length || 0
    };
  } catch (error) {
    console.error('[JSearchService] Fetch failed:', error);
    throw error;
  }
}
