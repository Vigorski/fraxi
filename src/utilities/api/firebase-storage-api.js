import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImage = async (fileName, file) => {
  if ( file === '' ) {
    throw new Error(`Not an image, the file is a /${typeof(file)}/`);
  }

  if ( file.type === 'image/jpeg' || file.type === 'image/png' ) {
    const storageRef = ref(storage, fileName);
    const imageRes = await uploadBytes(storageRef, file)
    console.log(imageRes);
    
    return imageRes;
  } else {
    throw new Error('Not a supported image type');
  }
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
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
        default:
          // Unknown error occurred, inspect the server response
          break;
      }
    });

  return imageRes
};

export const getFileUrl = async (fileName) => {
  const fileUrlRes = await getDownloadURL(ref(storage, fileName));
  return fileUrlRes;
}