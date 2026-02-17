import { expect, it } from "vitest";

import { decrypt, encrypt, generateKey, hash, sign, verifyHash, verifySign } from ".";

it("will generate random key", () => {
  expect(generateKey(32).length).toBe(44);
});

it("will hash data one way and verify it(without secret key)", () => {
  const secretData = "password324";
  const hashedValue = hash(secretData);

  expect(verifyHash(secretData, hashedValue)).toBe(true);
});

it("will hash data one way and verify it(with secret key)", () => {
  const secretData = "password123";
  const secretKey = generateKey();
  const signedData = sign(secretData, secretKey);

  expect(verifySign(secretData, signedData, secretKey)).toBe(true);
});

it("will hash data but reversible (2 way -> encrypt | decrypt", () => {
  const secretData = "password432423";
  const secretKey = generateKey();
  const encryptedData = encrypt(secretData, secretKey);

  expect(decrypt(encryptedData, secretKey)).toBe(secretData);
});
