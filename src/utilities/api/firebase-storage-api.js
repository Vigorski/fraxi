import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImage = async (fileName, file) => {
  if ( file === '' ) {
    throw new Error(`Not an image, the file is a /${typeof(file)}/`);
  }

  if ( file.type !== 'image/jpeg' && file.type !== 'image/png' ) {
    throw new Error('Not a supported image type');
  }

  const storageRef = ref(storage, fileName);
  const imageRes = await uploadBytes(storageRef, file)
  
  return imageRes;  
};

export const downloadImage = (fileName) => {
  const pathReference = ref(storage, fileName);
  const imageRes = getDownloadURL(pathReference)
    .then((url) => {
      return url;
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          throw new Error('File does not exist.');
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          throw new Error('Access denied. User has no permission.');
        // case 'storage/canceled':
        //   // User canceled the upload
        //   throw new Error('Upload canceled')
        case 'storage/unknown':
        default:
          // Unknown error occurred, inspect the server response
          throw new Error('Unknown error occurred, inspect the server response');
      }
    });

  return imageRes
};

// this returns a lightweight reference to the image
export const getFileUrl = async (fileName) => {
  const fileUrlRes = await getDownloadURL(ref(storage, fileName));
  return fileUrlRes;
}