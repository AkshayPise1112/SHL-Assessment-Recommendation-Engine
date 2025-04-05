import express from 'express';
import { getRecommendations } from '../services/recommendationService.js';

const router = express.Router();

/**
 * POST endpoint for recommendations
 * Accepts either a text query or a URL to a job description
 */
router.post('/recommend', async (req, res) => {
	try {
		const { query, url } = req.body;

		if (!query && !url) {
			return res.status(400).json({
				error: 'Either a query text or URL must be provided',
			});
		}

		const input = query || url;
		const isUrl = Boolean(url);

		const recommendations = await getRecommendations(input, isUrl);

		return res.json({ recommendations });
	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({
			error: 'Failed to generate recommendations',
			message: error.message,
		});
	}
});

/**
 * GET endpoint for recommendations (for direct browser access)
 */
router.get('/recommend', async (req, res) => {
	try {
		const { query, url } = req.query;

		if (!query && !url) {
			return res.status(400).json({
				error: 'Either a query text or URL must be provided',
			});
		}

		const input = query || url;
		const isUrl = Boolean(url);

		const recommendations = await getRecommendations(input, isUrl);

		return res.json({ recommendations });
	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({
			error: 'Failed to generate recommendations',
			message: error.message,
		});
	}
});

export default router;
