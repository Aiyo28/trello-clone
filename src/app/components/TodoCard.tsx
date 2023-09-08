'use client';

import { XCircleIcon } from '@heroicons/react/24/solid';
import {
	DraggableProvidedDragHandleProps,
	DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';
import Image from 'next/image';
import { userBoardStore } from '../../../store/BoardStore';
import { useEffect, useState } from 'react';
import getURL from '../../../lib/getURL';

type Props = {
	id: TypedColumn;
	todo: Todo;
	index: number;
	innerRef: (element: HTMLElement | null) => void;
	draggableProps: DraggableProvidedDraggableProps;
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
	id,
	todo,
	index,
	innerRef,
	draggableProps,
	dragHandleProps,
}: Props) {
	const deleteTask = userBoardStore((state) => state.deleteTask);

	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		if (todo.image) {
			const fetchImage = async () => {
				const url = await getURL(todo.image!);
				if (url) {
					setImageUrl(url.toString());
				}
			};
			fetchImage();
		}
	}, [todo]);

	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			<div className="flex justify-between items-center p-5">
				<p>{todo.title}</p>
				<button
					onClick={() => deleteTask(index, todo, id)}
					className="text-red-500 hover:text-red-600"
				>
					<XCircleIcon className="ml-5 h-8 w-8" />
				</button>
			</div>

			{imageUrl && (
				<div className="h-full w-full rounded-b-md">
					<Image
						src={imageUrl}
						alt="Todo Image"
						width={400}
						height={200}
						className="w-full object-contain rounded-b-md"
					/>
				</div>
			)}
		</div>
	);
}

export default TodoCard;
