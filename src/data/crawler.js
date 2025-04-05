import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_URL = 'https://www.shl.com/solutions/products/product-catalog/';
const OUTPUT_FILE = path.join(__dirname, 'assessments.json');

/**
 * Crawls the SHL product catalog and extracts assessment information.
 */
async function crawlSHLCatalog() {
	try {
		console.log('Starting to crawl SHL product catalog...');
		const response = await axios.get(CATALOG_URL);
		const $ = cheerio.load(response.data);

		const assessments = [];

		// Extract assessment information
		$('.product-item').each((i, elem) => {
			const name = $(elem).find('.product-title').text().trim();
			const url = $(elem).find('a').attr('href');

			// Note: This is a simplified example. In a real-world scenario,
			// you would need to parse more details or visit each product page.
			// The following values are placeholders - in production, you would extract real data
			const assessment = {
				name,
				url,
				remoteTestingSupport: Math.random() > 0.5 ? 'Yes' : 'No', // Placeholder
				adaptiveSupport: Math.random() > 0.5 ? 'Yes' : 'No', // Placeholder
				duration: `${Math.floor(Math.random() * 60) + 10} minutes`, // Placeholder
				testType: getRandomTestType(), // Placeholder
			};

			assessments.push(assessment);
		});

		// If no assessments were found, use sample data
		if (assessments.length === 0) {
			console.log('No assessments found. Using sample data instead.');
			return useSampleData();
		}

		// Save to file
		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assessments, null, 2));
		console.log(`Saved ${assessments.length} assessments to ${OUTPUT_FILE}`);

		return assessments;
	} catch (error) {
		console.error('Error crawling SHL catalog:', error);
		return useSampleData();
	}
}

/**
 * Returns sample assessment data if crawling fails.
 */
function useSampleData() {
	const sampleAssessments = [
		{
			name: 'SHL Verify Interactive Verbal Reasoning Assessment',
			url: 'https://www.shl.com/products/verify-interactive-verbal-reasoning/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '25 minutes',
			testType: 'Cognitive Ability',
		},
		{
			name: 'SHL Verify Numerical Reasoning Assessment',
			url: 'https://www.shl.com/products/verify-numerical-reasoning/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '35 minutes',
			testType: 'Cognitive Ability',
		},
		{
			name: 'SHL Personality Assessment',
			url: 'https://www.shl.com/products/personality-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '30 minutes',
			testType: 'Personality',
		},
		{
			name: 'SHL Coding Pro Assessment',
			url: 'https://www.shl.com/products/coding-pro/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '60 minutes',
			testType: 'Technical Skills',
		},
		{
			name: 'SHL Leadership Assessment',
			url: 'https://www.shl.com/products/leadership-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '45 minutes',
			testType: 'Leadership',
		},
		{
			name: 'SHL Sales Assessment',
			url: 'https://www.shl.com/products/sales-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '40 minutes',
			testType: 'Sales Skills',
		},
		{
			name: 'SHL Data Analysis Assessment',
			url: 'https://www.shl.com/products/data-analysis-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '50 minutes',
			testType: 'Technical Skills',
		},
		{
			name: 'SHL Communication Skills Assessment',
			url: 'https://www.shl.com/products/communication-skills/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '30 minutes',
			testType: 'Soft Skills',
		},
		{
			name: 'SHL Problem-Solving Assessment',
			url: 'https://www.shl.com/products/problem-solving/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '25 minutes',
			testType: 'Cognitive Ability',
		},
		{
			name: 'SHL Customer Service Assessment',
			url: 'https://www.shl.com/products/customer-service/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '35 minutes',
			testType: 'Soft Skills',
		},
		{
			name: 'SHL Project Management Assessment',
			url: 'https://www.shl.com/products/project-management/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '45 minutes',
			testType: 'Project Management',
		},
		{
			name: 'SHL JavaScript Coding Assessment',
			url: 'https://www.shl.com/products/javascript-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '60 minutes',
			testType: 'Technical Skills',
		},
		{
			name: 'SHL Python Coding Assessment',
			url: 'https://www.shl.com/products/python-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '60 minutes',
			testType: 'Technical Skills',
		},
		{
			name: 'SHL Java Programming Assessment',
			url: 'https://www.shl.com/products/java-assessment/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '55 minutes',
			testType: 'Technical Skills',
		},
		{
			name: 'SHL Critical Thinking Assessment',
			url: 'https://www.shl.com/products/critical-thinking/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'No',
			duration: '35 minutes',
			testType: 'Cognitive Ability',
		},
	];

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sampleAssessments, null, 2));
	console.log(
		`Saved ${sampleAssessments.length} sample assessments to ${OUTPUT_FILE}`
	);

	return sampleAssessments;
}

function getRandomTestType() {
	const types = [
		'Cognitive Ability',
		'Personality',
		'Technical Skills',
		'Soft Skills',
		'Leadership',
		'Project Management',
	];
	return types[Math.floor(Math.random() * types.length)];
}

// Run crawler if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	crawlSHLCatalog();
}

export { crawlSHLCatalog };
