document.addEventListener('DOMContentLoaded', () => {
	const searchForm = document.getElementById('search-form');
	const queryInput = document.getElementById('query');
	const urlInput = document.getElementById('url');
	const resultsDiv = document.getElementById('results');
	const spinner = document.getElementById('spinner');
	const table = document
		.getElementById('recommendations-table')
		.querySelector('tbody');

	searchForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const query = queryInput.value.trim();
		const url = urlInput.value.trim();

		// Validate input
		if (!query && !url) {
			alert('Please enter either a job description or a URL');
			return;
		}

		// Show spinner, hide results
		spinner.classList.remove('hidden');
		resultsDiv.classList.add('hidden');
		table.innerHTML = '';

		try {
			// Prepare request data
			const requestData = {};
			if (query) requestData.query = query;
			if (url) requestData.url = url;

			// Send request to API
			const response = await fetch('/api/recommend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			});

			if (!response.ok) {
				throw new Error('Failed to get recommendations');
			}

			const data = await response.json();

			// Display recommendations
			if (data.recommendations && data.recommendations.length > 0) {
				data.recommendations.forEach((assessment) => {
					const row = document.createElement('tr');

					// Assessment name with link
					const nameCell = document.createElement('td');
					const link = document.createElement('a');
					link.href = assessment.url;
					link.textContent = assessment.name;
					link.target = '_blank';
					nameCell.appendChild(link);

					// Other cells
					const remoteCell = document.createElement('td');
					remoteCell.textContent = assessment.remoteTestingSupport;

					const adaptiveCell = document.createElement('td');
					adaptiveCell.textContent = assessment.adaptiveSupport;

					const durationCell = document.createElement('td');
					durationCell.textContent = assessment.duration;

					const typeCell = document.createElement('td');
					typeCell.textContent = assessment.testType;

					// Add cells to row
					row.appendChild(nameCell);
					row.appendChild(remoteCell);
					row.appendChild(adaptiveCell);
					row.appendChild(durationCell);
					row.appendChild(typeCell);

					// Add row to table
					table.appendChild(row);
				});

				// Show results
				resultsDiv.classList.remove('hidden');
			} else {
				table.innerHTML =
					'<tr><td colspan="5" style="text-align: center;">No recommendations found</td></tr>';
				resultsDiv.classList.remove('hidden');
			}
		} catch (error) {
			console.error('Error:', error);
			table.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error: ${error.message}</td></tr>`;
			resultsDiv.classList.remove('hidden');
		} finally {
			// Hide spinner
			spinner.classList.add('hidden');
		}
	});
});
