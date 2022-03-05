import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export const hash = (string) => Base64.stringify(sha256(string));

export const hashCompare = (firstItem, secondItem) => Object.is(firstItem, secondItem);
