# SHL Assessment Recommendation Engine

A web application that recommends relevant SHL assessments based on job descriptions using a hybrid approach of rule-based filtering and machine learning techniques.

## Features

- Accepts natural language job descriptions or URLs to job descriptions
- Extracts key information such as required skills and duration constraints
- Recommends appropriate SHL assessments using a hybrid recommendation system
- Provides both API endpoints and a user-friendly web interface
- Ranks recommendations using NLP techniques

## Architecture

The application is built using the following components:

1. **Data Layer**

   - `crawler.js`: Crawls the SHL product catalog and extracts assessment information
   - `dataService.js`: Provides access to assessment data with caching

2. **Recommendation Engine**

   - `recommendationService.js`: Combines rule-based filtering and ML-based ranking
   - Rule-based component: Filters assessments based on extracted features
   - ML component: Uses TF-IDF for similarity-based ranking

3. **API & Web Interface**

   - Express.js server providing RESTful API endpoints
   - Simple and responsive web interface built with Pug templates

4. **Testing**
   - Unit tests for core recommendation functionality
   - Integration tests for API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, Pug templating
- **NLP**: Natural.js library for text processing and TF-IDF
- **Testing**: Jest
- **Data Processing**: Cheerio for HTML parsing
- **Caching**: Node-cache for improved performance

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/shl-assessment-recommendation-engine.git
cd shl-assessment-recommendation-engine
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Crawl the SHL product catalog to populate the assessment data

```bash
npm run crawl
```

5. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:8000

## API Usage

### Endpoint: `/api/recommend`

**Method**: POST

**Payload**:

```json
{
	"query": "Software engineer with experience in JavaScript and React",
	// OR
	"url": "https://example.com/job-description"
}
```

**Response**:

```json
{
	"recommendations": [
		{
			"name": "SHL Coding Pro Assessment",
			"url": "https://www.shl.com/products/coding-pro/",
			"remoteTestingSupport": "Yes",
			"adaptiveSupport": "No",
			"duration": "60 minutes",
			"testType": "Technical Skills"
		}
		// ...
	]
}
```

## Deployment

### Deploying to Render

1. Install Render CLI:

```bash
npm install -g @render/cli
```

2. Login to Render:

```bash
render login
```

3. Deploy the application:

```bash
render deploy
```

## Evaluating Recommendation Quality

The recommendation engine is evaluated using the following metrics:

1. **Mean Recall@3**: Measures the proportion of relevant assessments that appear in the top-3 recommendations.
2. **MAP@3 (Mean Average Precision)**: Measures the precision at different ranking positions within the top-3 recommendations.

A utility function `calculateMetrics()` is provided in the `recommendationService.js` file to measure these metrics during development and testing.

## Development

### Running Tests

```bash
npm test
```

### Crawling Fresh Data

```bash
npm run crawl
```

## License

MIT
