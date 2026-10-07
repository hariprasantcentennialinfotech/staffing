/**
 * Generates an SEO-friendly URL slug for a job.
 * e.g., "Junior Data Analyst" -> "Junior-Data-Analyst"
 */
export const getJobSlug = (job) => {
    if (!job) return '';
    if (typeof job === 'string') {
        return job.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }
    if (job.slug) return job.slug;
    if (job.title) {
        return job.title
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }
    return job._id || '';
};
