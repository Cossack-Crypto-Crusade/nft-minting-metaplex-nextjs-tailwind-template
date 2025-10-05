// src/config.ts
import configData from '../config.json';

export type Network = 'devnet' | 'mainnet';

export const getNetwork = (): Network => configData.network as Network;

export const getRpcUrl = (): string => {
  const network = getNetwork();
  return configData.rpc[network];
};

export const getCandyMachineAddress = (): string => {
  const network = getNetwork();
  return configData.candyMachine[network];
};
