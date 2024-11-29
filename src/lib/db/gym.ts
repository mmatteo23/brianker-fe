import { Gym } from "@prisma/client";
import prisma from "./prisma";

export async function getGyms(): Promise<Gym[]> {
  return await prisma.gym.findMany();
}

export async function getGymById(id: string): Promise<Gym | null> {
  return await prisma.gym.findUnique({
    where: { id },
  });
}

export async function getGymsByOwnerId(ownerId: string): Promise<Gym[]> {
  return await prisma.gym.findMany({
    where: {
      ownerId,
    },
  });
}

export async function createGym(data: Gym): Promise<Gym> {
  return await prisma.gym.create({
    data,
  });
}

export async function updateGym(id: string, data: Gym): Promise<Gym> {
  return await prisma.gym.update({
    where: { id },
    data,
  });
}

export async function deleteGym(id: string): Promise<Gym> {
  return await prisma.gym.delete({
    where: { id },
  });
}
