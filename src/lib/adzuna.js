/**
 * Adzuna API Service (Proxy Uplink Edition)
 * 
 * Documentation: https://developer.adzuna.com/overview
 * Note: Uses allorigins proxy to bypass browser CORS restrictions.
 */

const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;
const DEFAULT_COUNTRY = 'in'; 

/**
 * fetchJobs
 * 
 * Searches for jobs using keywords and location.
 */
export async function fetchJobs({ what = '', where = '', page = 1 } = {}) {
  try {
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${DEFAULT_COUNTRY}/search/${page}`;
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: '15',
      what: what,
      where: where,
      content_type: 'application/json'
    });

    const fullUrl = `${adzunaUrl}?${params}`;
    
    // Proxy wrapper to bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fullUrl)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Proxy Node Error: ${response.status}`);
    }

    const proxyData = await response.json();
    
    // AllOrigins returns the raw response body in the 'contents' field
    const data = JSON.parse(proxyData.contents);
    
    // Transform Adzuna response to match our internal Job schema
    return {
      results: data.results.map(job => ({
        id: job.id,
        title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description.replace(/<\/?[^>]+(>|$)/g, ""),
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        contract_type: job.contract_type,
        created: job.created,
        redirect_url: job.redirect_url,
        category: job.category?.label || 'General'
      })),
      count: data.count
    };
  } catch (error) {
    console.error('[AdzunaService] Proxy Fetch failed:', error);
    throw error;
  }
}
