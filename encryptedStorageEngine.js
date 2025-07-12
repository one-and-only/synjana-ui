import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";

/**
 * implements PersistStorage (with encryption) from Zustand
 */
export default class EncryptedStorage {
    _encryptionKey;
    _zustandStorageKey;
    _iv;
    _nonce;

    /**
     * 
     * @param {string} encryptionKey encryption key used for Zustand in-browser store encryption
     * @param {string} zustandStorageKey key name that is used for storing Zustand encrypted state in browser's `localStorage`
     */
    constructor(encryptionKey, zustandStorageKey) {
        this._encryptionKey = Buffer.from(encryptionKey, "base64");
        this._zustandStorageKey = zustandStorageKey;
        this._iv = randomBytes(16);
    }

    setItem(key, value) {
        const cipher = createCipheriv(ALGORITHM, this._encryptionKey, this._iv);
        let wholeObject = this.getItem("", true);
        if (!wholeObject) wholeObject = {};
        wholeObject[key] = value;
        cipher.update(JSON.stringify(wholeObject), "utf8", "base64");
        localStorage.setItem(this._zustandStorageKey, cipher.final("base64"));
    }

    getItem(key, wholeObject = false) {
        const zustandObject = localStorage.getItem(this._zustandStorageKey);
        if (zustandObject === null) return undefined;

        const decipher = createDecipheriv(ALGORITHM, this._encryptionKey, this._iv);

        decipher.update(zustandObject, "base64", "utf8");
        const deciphered = JSON.parse(decipher.final("utf8"));

        if (wholeObject) return deciphered;

        return zustandObject[key] ?? undefined;
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }
}