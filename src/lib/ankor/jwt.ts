import { createSign } from "node:crypto";
import { ankorConfig } from "./config";

const base64url = (input: Buffer | string): string => {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64").replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

export function signAssertion(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: ankorConfig.keyId(),
  };
  const companyUri = ankorConfig.companyUri();
  const payload = {
    scopes: ["website:read:*"],
    iss: companyUri,
    sub: companyUri,
    aud: "ankor.io",
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(ankorConfig.privateKey());
  return `${signingInput}.${base64url(signature)}`;
}
