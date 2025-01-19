import CryptoJS from "crypto-js"

export const encryptToken = (token:string,secret:string) => {
    const encryptedToken = CryptoJS.AES.encrypt(token,secret).toString();
    return encryptedToken;
}

// decrypted token 
export const decryptToken = (token:string,secret:string) => {
    const decryptedToken = CryptoJS.AES.decrypt(token,secret).toString(CryptoJS.enc.Utf8);
    return decryptedToken;
}