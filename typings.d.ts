interface Board {
	columns: Map<TypedColumn, Column>;
}

type TypedColumn = 'todo' | 'inprogress' | 'done';

interface Column {
	id: TypedColumn;
	todos: Todo[];
}

interface Todo {
	$id: string;
	$createdAt: string;
	title: string;
	status: BoardState;
	image?: Image;
}

interface Image {
	bucketId: string;
	fileId: string;
}
