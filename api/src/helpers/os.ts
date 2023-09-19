import childProcess from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import stream from 'stream';
import which from 'which';
import { CommandNotFoundException } from '@/exceptions/command-not-found';

export const exec = util.promisify(childProcess.exec);

export const unlink = fs.unlink;

export const readFile = fs.readFile;

export const writeFile = fs.writeFile;

export const pump = util.promisify(stream.pipeline);

export async function commandExists(command: string) {
  try {
    await exec(`command -v ${command}`);
    return true;
  } catch (error) {
    return false;
  }
}

export async function sleep(milliseconds: number) {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function findBinary(binary: string) {
  if (!(await commandExists(binary))) {
    throw new CommandNotFoundException(`Command ${binary} not found.`);
  }

  return await which(binary);
}
