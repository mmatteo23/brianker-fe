import { Owner } from "@prisma/client";
import prisma from "./prisma";

export async function getOwners(): Promise<Owner[]> {
  return await prisma.owner.findMany();
}

export async function getOwnerById(id: string): Promise<Owner | null> {
  return await prisma.owner.findUnique({
    where: {
      id,
    },
  });
}

export async function createOwner(data: Owner): Promise<Owner> {
  return await prisma.owner.create({
    data,
  });
}

export async function updateOwner(id: string, data: Owner): Promise<Owner> {
  return await prisma.owner.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteOwner(id: string): Promise<Owner> {
  return await prisma.owner.delete({
    where: {
      id,
    },
  });
}
