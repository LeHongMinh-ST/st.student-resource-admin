import CryptoJS from 'crypto-js';

export const encryptedString = (str: string) => {
  const encryptedString = CryptoJS.AES.encrypt(str, 'student-vnua');
  return encodeURIComponent(encryptedString.toString());
};

export const decryptedString = (str: string) => {
  const strNew = decodeURIComponent(str);
  return CryptoJS.AES.decrypt(strNew, 'student-vnua').toString(CryptoJS.enc.Utf8);
};
