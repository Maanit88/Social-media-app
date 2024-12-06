import crypto from "crypto";

export const hasher = async (string) => {
  const hashedString = await crypto
    .createHash("sha256")
    .update(string)
    .digest("hex");
  return hashedString;
};
