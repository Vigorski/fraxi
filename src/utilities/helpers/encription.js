import CryptoJS from 'crypto-js';

// Generate a secure key (default is 256-bit (32-byte))
export const generateRandomSecureKey = (length = 32) => {
  const randomBytes = CryptoJS.lib.WordArray.random(length);
  return CryptoJS.enc.Base64.stringify(randomBytes);
};

export const encryptData = (data, secretKey) => {
  try {
    if (
      !data ||
      typeof data !== 'string' ||
      !secretKey ||
      typeof secretKey !== 'string'
    ) {
      throw new Error('Invalid data or secret key');
    }

    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encodeURIComponent(encryptedData);
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw error;
  }
};

export const decryptData = (encodedEncryptedData, secretKey) => {
  try {
    if (
      !encodedEncryptedData ||
      typeof encodedEncryptedData !== 'string' ||
      !secretKey ||
      typeof secretKey !== 'string'
    ) {
      throw new Error('Invalid encrypted data or secret key');
    }

    const encryptedData = decodeURIComponent(encodedEncryptedData);
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedData) throw new Error('URI malformed');

    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw error;
  }
};
