import { jest } from '@jest/globals';
import {
	getRecommendations,
	calculateMetrics,
} from '../src/services/recommendationService.js';
import { getAssessments } from '../src/data/dataService.js';

// Mock the data service
jest.mock('../src/data/dataService.js', () => ({
	getAssessments: jest.fn(),
}));

describe('Recommendation Service', () => {
	// Sample assessment data for testing
	const mockAssessments = [
		{
			name: 'SHL Verify Numerical Reasoning Assessment',
			url: 'https://www.shl.com/products/verify-numerical-reasoning/',
			remoteTestingSupport: 'Yes',
			adaptiveSupport: 'Yes',
			duration: '35 minutes',
			testType: 'Cognitive Ability',
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
	];

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();
		// Set up the mock to return our sample assessments
		getAssessments.mockResolvedValue(mockAssessments);
	});

	test('should return recommendations for a programming job description', async () => {
		const query =
			'Looking for a software engineer with JavaScript and React experience';
		const recommendations = await getRecommendations(query);

		expect(recommendations).toBeDefined();
		expect(Array.isArray(recommendations)).toBe(true);
		expect(recommendations.length).toBeGreaterThan(0);

		// The coding assessment should be ranked highly
		const foundCodingAssessment = recommendations.some(
			(rec) => rec.name.includes('Coding') || rec.testType.includes('Technical')
		);
		expect(foundCodingAssessment).toBe(true);
	});

	test('should return recommendations for a leadership position', async () => {
		const query =
			'Team manager position requiring leadership and team building skills';
		const recommendations = await getRecommendations(query);

		expect(recommendations).toBeDefined();
		expect(Array.isArray(recommendations)).toBe(true);
		expect(recommendations.length).toBeGreaterThan(0);

		// The leadership assessment should be ranked highly
		const foundLeadershipAssessment = recommendations.some(
			(rec) =>
				rec.name.includes('Leadership') || rec.testType.includes('Leadership')
		);
		expect(foundLeadershipAssessment).toBe(true);
	});

	test('should handle empty query gracefully', async () => {
		const query = '';
		const recommendations = await getRecommendations(query);

		expect(recommendations).toBeDefined();
		expect(Array.isArray(recommendations)).toBe(true);
		expect(recommendations.length).toBeGreaterThan(0);
	});

	test('should calculate metrics correctly', () => {
		const recommendations = [
			{ name: 'SHL Coding Pro Assessment' },
			{ name: 'SHL Verify Numerical Reasoning Assessment' },
			{ name: 'SHL Leadership Assessment' },
		];

		const relevantAssessments = [
			{ name: 'SHL Coding Pro Assessment' },
			{ name: 'SHL Python Coding Assessment' },
		];

		const metrics = calculateMetrics(recommendations, relevantAssessments);

		expect(metrics).toBeDefined();
		expect(metrics.recall).toBeGreaterThan(0);
		expect(metrics.map).toBeGreaterThan(0);
	});
});
