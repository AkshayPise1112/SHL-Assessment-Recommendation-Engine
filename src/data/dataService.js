import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crawlSHLCatalog } from './crawler.js';
import NodeCache from 'node-cache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'assessments.json');

// Cache for assessments data with TTL of 1 hour
const assessmentsCache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'assessments';

/**
 * Loads assessment data from the file or crawls if necessary
 */
async function getAssessments() {
	// Try to get from cache first
	const cachedData = assessmentsCache.get(CACHE_KEY);
	if (cachedData) {
		return cachedData;
	}

	try {
		// Try to read from file
		if (fs.existsSync(DATA_FILE)) {
			const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
			assessmentsCache.set(CACHE_KEY, data);
			return data;
		} else {
			// If file doesn't exist, crawl the data
			const assessments = await crawlSHLCatalog();
			assessmentsCache.set(CACHE_KEY, assessments);
			return assessments;
		}
	} catch (error) {
		console.error('Error loading assessment data:', error);
		throw new Error('Failed to load assessment data');
	}
}

export { getAssessments };
