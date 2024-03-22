import * as ethers from "ethers";
import tval from "@app/utils/tval";

const _module = 'crypto';

// 3+1 femtoether    : 1000
// 6+1 picoether     : 1000000
// 9+1 nanoether     : 1000000000
// 12+1 microether   : 1000000000000
// 15+1 milliether   : 1000000000000000
// 18+1 ether        : 1000000000000000000
// 21+1 kether       : 1000000000000000000000
// 24+1 mether       : 1000000000000000000000000
// 27+1 gether       : 1000000000000000000000000000
// 30+1 tether       : 1000000000000000000000000000000

const isAddress = (address: string | `0x${string}`): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (e: any) {
    console.error(`${_module}:isAddress: ${e.message}`);
    return false;
  }
}

const fromWei = (bn_t: bigint | string, decimals: number = 18): string => {
  return ethers.formatUnits(bn_t.toString(), decimals);
}

const toWei = (input: number | string, decimals = 18): bigint => {
  return ethers.parseUnits(input.toString(), decimals);
}

const toWeiString = (input: number | string, decimals = 18): string => {
  return ethers.parseUnits(input.toString(), decimals).toString();
}

const utf8ToBytes32 = (value: string): Buffer => {
  const bytes32 = Buffer.alloc(32);
  bytes32.write(value, 'utf8');
  return bytes32; // .buffer;
}

const uintToBytes32Hex = (value: number): `0x${string}` => {
  // const hex = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)
  value = Math.abs(+(+value).toFixed(0))
  const hex = (value).toString(16).padStart(64, '0');
  return `0x${hex}`;
}

const utf8ToUintArray = (value: string): number[] => {
  const buffer = Buffer.from(value, 'utf8');
  return Array.from(buffer);
}

const utf8ToBytesHex = (value: string): `0x${string}` => {
  if (!tval.isString(value) || !value.length) {
    console.error(`#utf8ToBytesHex( value: ${value} ): is not valid utf-8 string`);
  }

  const hex = value
    .replace(/[^a-z0-9-_.]/gi, '')
    .trim()
    .split('')
    .map((c) => (c.charCodeAt(0).toString(16)))
    .join('');
  return `0x${hex}`;
}

const test = (input: string) => {
  return ethers.formatEther(input);
}

const toShortAddress = (addr: `0x${string}` | undefined, cut: number = 4): string => {
  return !addr
    ? "<address>"
    : `${addr.substring(0, cut + 2)}...${addr.substring(42 - cut)}`
}


export default {
  isAddress,
  test,
  fromWei,
  toWei,
  toWeiString,
  utf8ToBytes32,
  utf8ToBytesHex,
  uintToBytes32Hex,
  utf8ToUintArray,
  toShortAddress,
}
