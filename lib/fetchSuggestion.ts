import formatTodosForAI from './formatTodosForAI';

export default async function fetchSuggestion(board: any) {
	const todos = formatTodosForAI(board);
	console.log('GPT', todos);

	const res = await fetch('/api/generateSummary', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ todos }),
	});

	const { content } = await res.json();
	return content;
}
