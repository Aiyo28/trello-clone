import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getTodosGroupedByColumns } from '../lib/getTodosGroupedByColumns';
import { ID, databases, storage } from '../appwrite';
import uploadImage from '../lib/uploadImage';

interface BoardState {
	board: Board;
	getBoard: () => void;
	setBoardState: (board: Board) => void;
	updateToDoInDB: (todo: Todo, columnId: TypedColumn) => void;

	searchString: string;
	setSearchString: (searchString: string) => void;

	deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

	newTaskInput: string;
	setNewTaskInput: (input: string) => void;

	newTaskType: TypedColumn;
	setNewTaskType: (id: TypedColumn) => void;

	image: File | null;
	setImage: (image: File | null) => void;

	addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const userBoardStore = create<BoardState>((set, get) => ({
	board: {
		columns: new Map<TypedColumn, Column>(),
	},

	searchString: '',
	newTaskInput: '',
	setSearchString: (searchString) => set({ searchString }),

	getBoard: async () => {
		const board = await getTodosGroupedByColumns();
		set({ board });
	},
	setBoardState: (board) => set({ board }),

	updateToDoInDB: async (todo, columnId) => {
		await databases.updateDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			todo.$id,
			{
				title: todo.title,
				status: columnId,
			}
		);
	},

	deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
		const newColumns = new Map(get().board.columns);

		//delete todoId from newColumns
		newColumns.get(id)?.todos.splice(taskIndex, 1);
		set({ board: { columns: newColumns } });

		if (todo.image) {
			await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
		}

		await databases.deleteDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			todo.$id
		);
	},

	setNewTaskInput: (newTaskInput: string) => set({ newTaskInput }),

	newTaskType: 'todo',
	setNewTaskType: (id: TypedColumn) => set({ newTaskType: id }),

	image: null,
	setImage: (image: File | null) => set({ image }),

	addTask: async (
		todo: string,
		columnId: TypedColumn,
		image?: File | null
	) => {
		let file: Image | undefined;

		if (image) {
			const fileUploaded = await uploadImage(image);
			if (fileUploaded) {
				file = {
					bucketId: fileUploaded.bucketId,
					fileId: fileUploaded.$id,
				};
			}
		}

		const { $id } = await databases.createDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			ID.unique(),
			{
				title: todo,
				status: columnId,
				...(file && { image: JSON.stringify(file) }),
			}
		);

		set({ newTaskInput: '' });

		set((state) => {
			const newColumns = new Map(state.board.columns);

			const newTodo = {
				$id,
				$createdAt: new Date().toISOString(),
				title: todo,
				status: columnId,
				...(file && { image: file }),
			};

			const column = newColumns.get(columnId);

			if (!column) {
				newColumns.set(columnId, {
					id: columnId,
					todos: [newTodo],
				});
			} else {
				newColumns.get(columnId)?.todos.push(newTodo);
			}

			return {
				board: {
					columns: newColumns,
				},
			};
		});
	},
}));
