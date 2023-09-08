import { ID, storage } from '../appwrite';

const uploadImage = async (file: File) => {
	if (!file) return;

	const fileUploaded = await storage.createFile(
		'64f82f017d4abb9404ea',
		ID.unique(),
		file
	);

	return fileUploaded;
};

export default uploadImage;
