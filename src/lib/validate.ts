import { publicKey } from "@metaplex-foundation/umi/serializers";

export function isValidPublicKey(s: string) {
  try {
    publicKey().deserialize(Buffer.from(s)); // or just try publicKey(s)
    return true;
  } catch {
    return false;
  }
}
