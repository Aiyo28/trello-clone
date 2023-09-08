export default function formatTodosForAI(board: any) {
	const todos = Array.from(board.columns.entries());

	const flatArray: any = todos.reduce((map: any, [key, value]: any) => {
		map[key] = value.todos;
		return map;
	}, {});

	const flatArrayCounted = Object.entries(flatArray).reduce(
		(map: any, [key, value]: any) => {
			map[key] = value.length;
			return map;
		},
		{}
	);
	return flatArrayCounted;
}
