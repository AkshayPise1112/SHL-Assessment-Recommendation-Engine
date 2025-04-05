import natural from 'natural';
import { getAssessments } from '../data/dataService.js';
import fetch from 'node-fetch';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const tfidf = new natural.TfIdf();

// List of common skills and their related keywords for rule-based matching
const skillKeywords = {
	programming: [
		'coding',
		'developer',
		'software',
		'engineer',
		'javascript',
		'python',
		'java',
		'html',
		'css',
		'web',
	],
	'data analysis': [
		'data',
		'analytics',
		'statistics',
		'analysis',
		'sql',
		'database',
		'excel',
		'visualization',
		'reporting',
	],
	leadership: [
		'leadership',
		'management',
		'supervisor',
		'team lead',
		'director',
		'executive',
		'manage',
	],
	communication: [
		'communication',
		'writing',
		'speaking',
		'presentation',
		'interpersonal',
		'verbal',
		'written',
	],
	'customer service': [
		'customer',
		'service',
		'support',
		'client',
		'satisfaction',
		'helpdesk',
	],
	sales: [
		'sales',
		'selling',
		'business development',
		'account',
		'revenue',
		'quota',
		'negotiate',
	],
	'project management': [
		'project',
		'management',
		'agile',
		'scrum',
		'waterfall',
		'planning',
		'coordination',
	],
};

/**
 * Preprocesses text for NLP operations
 * @param {string} text - Text to preprocess
 * @returns {string[]} - Array of stemmed tokens
 */
function preprocessText(text) {
	const tokens = tokenizer.tokenize(text.toLowerCase());
	return tokens.map((token) => stemmer.stem(token));
}

/**
 * Extracts important features from job description
 * @param {string} text - Job description text
 * @returns {Object} - Extracted features
 */
function extractFeatures(text) {
	const tokens = preprocessText(text);
	const skills = [];

	// Identify skills using keyword matching
	Object.keys(skillKeywords).forEach((skill) => {
		const keywords = skillKeywords[skill].map((kw) => preprocessText(kw)[0]);
		const found = keywords.some((kw) => tokens.includes(kw));
		if (found) {
			skills.push(skill);
		}
	});

	// Extract duration constraints (simplified)
	const durationMatch = text.match(/(\d+)\s*(?:min|hour|minute)/i);
	const maxDuration = durationMatch ? parseInt(durationMatch[1]) : null;

	return {
		skills,
		maxDuration,
		tokens,
	};
}

/**
 * Performs rule-based filtering on assessments
 * @param {Array} assessments - List of all assessments
 * @param {Object} features - Extracted features from query
 * @returns {Array} - Filtered assessments
 */
function ruleBasedFiltering(assessments, features) {
	return assessments.filter((assessment) => {
		// Filter by duration if constraint exists
		if (features.maxDuration) {
			const durationMinutes = parseInt(assessment.duration);
			if (durationMinutes > features.maxDuration) {
				return false;
			}
		}

		// Keep assessment if no skills detected
		if (features.skills.length === 0) {
			return true;
		}

		// Check if assessment matches any of the detected skills
		const assessmentText =
			`${assessment.name} ${assessment.testType}`.toLowerCase();
		return features.skills.some((skill) => {
			return skillKeywords[skill].some((keyword) =>
				assessmentText.includes(keyword.toLowerCase())
			);
		});
	});
}

/**
 * Performs ML-based similarity ranking
 * @param {Array} assessments - List of assessments to rank
 * @param {string} query - Original query text
 * @returns {Array} - Ranked assessments
 */
async function mlBasedRanking(assessments, query) {
	// Reset TF-IDF
	while (tfidf.documents.length > 0) {
		tfidf.documents.pop();
	}

	// Add query and assessment docs to TF-IDF
	tfidf.addDocument(preprocessText(query).join(' '));

	assessments.forEach((assessment, i) => {
		const doc = `${assessment.name} ${assessment.testType}`;
		tfidf.addDocument(preprocessText(doc).join(' '));
	});

	// Calculate similarity scores
	const scores = assessments.map((assessment, i) => {
		let similarity = 0;

		// TF-IDF similarity calculation
		tfidf.tfidfs(preprocessText(query).join(' '), (j, measure) => {
			if (j === i + 1) {
				// +1 because the query is the first document
				similarity = measure;
			}
		});

		return {
			assessment,
			score: similarity,
		};
	});

	// Sort by score in descending order
	return scores.sort((a, b) => b.score - a.score);
}

/**
 * Fetches content from a URL
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} - HTML content
 */
async function fetchUrlContent(url) {
	try {
		const response = await fetch(url);
		return await response.text();
	} catch (error) {
		console.error('Error fetching URL:', error);
		throw new Error('Failed to fetch URL content');
	}
}

/**
 * Main recommendation function
 * @param {string} input - Query text or URL
 * @param {boolean} isUrl - Whether input is a URL
 * @returns {Promise<Array>} - Recommended assessments
 */
async function getRecommendations(input, isUrl = false) {
	try {
		// If input is a URL, fetch its content
		let queryText = input;
		if (isUrl) {
			queryText = await fetchUrlContent(input);
		}

		// Get all assessments
		const allAssessments = await getAssessments();

		// Extract features from query
		const features = extractFeatures(queryText);

		// Rule-based filtering
		const filteredAssessments = ruleBasedFiltering(allAssessments, features);

		// If no assessments left after filtering, use top 10 from all assessments
		const assessmentsForRanking =
			filteredAssessments.length > 0
				? filteredAssessments
				: allAssessments.slice(0, 10);

		// ML-based ranking
		const rankedAssessments = await mlBasedRanking(
			assessmentsForRanking,
			queryText
		);

		// Return top 10 (or fewer if not enough)
		return rankedAssessments.slice(0, 10).map((item) => item.assessment);
	} catch (error) {
		console.error('Error generating recommendations:', error);
		throw new Error('Failed to generate recommendations');
	}
}

/**
 * Calculates evaluation metrics for the recommendations
 * @param {Array} recommendations - Recommended assessments
 * @param {Array} relevantAssessments - Ground truth relevant assessments
 * @returns {Object} - Evaluation metrics
 */
function calculateMetrics(recommendations, relevantAssessments) {
	// Mean Recall@3
	const topK = 3;
	const relevantIds = new Set(relevantAssessments.map((a) => a.name));
	const topKRecommendations = recommendations.slice(0, topK);
	const relevantFound = topKRecommendations.filter((r) =>
		relevantIds.has(r.name)
	).length;
	const recall = relevantFound / Math.min(relevantIds.size, topK);

	// MAP@3
	let ap = 0;
	let relevantSoFar = 0;

	for (let i = 0; i < topK; i++) {
		if (relevantIds.has(topKRecommendations[i]?.name)) {
			relevantSoFar++;
			ap += relevantSoFar / (i + 1);
		}
	}

	const map = relevantSoFar > 0 ? ap / relevantSoFar : 0;

	return {
		recall,
		map,
	};
}

export { getRecommendations, calculateMetrics };
