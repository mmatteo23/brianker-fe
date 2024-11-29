import { Challenge } from "@prisma/client";
import prisma from "./prisma";

export async function getChallenges(): Promise<Challenge[]> {
  return await prisma.challenge.findMany();
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  return await prisma.challenge.findUnique({
    where: {
      id,
    },
  });
}

export async function createChallenge(data: Challenge): Promise<Challenge> {
  return await prisma.challenge.create({
    data,
  });
}

export async function updateChallenge(
  id: string,
  data: Challenge
): Promise<Challenge> {
  return await prisma.challenge.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteChallenge(id: string): Promise<Challenge> {
  return await prisma.challenge.delete({
    where: {
      id,
    },
  });
}
