import { Address } from "viem";
import { privateKeyToAccount, Account } from "viem/accounts";

export const getWalletAccount = (privateKey?: string): Account | null => {
  if (!privateKey) return null;

  try {
    const formattedKey: Address = `0x${privateKey}`;
    return privateKeyToAccount(formattedKey);
  } catch (error) {
    console.error("Error creating wallet account:", error);
    return null;
  }
};
