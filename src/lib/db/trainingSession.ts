import { TrainingSession } from "@prisma/client";
import prisma from "./prisma";

type PartialTrainingSession = {
  [K in keyof TrainingSession]?: TrainingSession[K];
};

export async function getTrainingSessionsByUserId(
  userId: string,
): Promise<TrainingSession[]> {
  return await prisma.trainingSession.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
    },
  });
}

export async function getTrainingSessionById(
  id: string,
): Promise<TrainingSession | null> {
  return await prisma.trainingSession.findUnique({
    where: {
      id,
    },
  });
}

export async function createTrainingSession(data: {
  id: string;
  status: string;
  userId?: string;
  gymId: string;
}): Promise<TrainingSession> {
  return await prisma.trainingSession.create({
    data,
  });
}

export async function updateTrainingSession(
  id: string,
  data: PartialTrainingSession,
): Promise<TrainingSession> {
  return await prisma.trainingSession.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTrainingSession(
  id: string,
): Promise<TrainingSession> {
  return await prisma.trainingSession.delete({
    where: {
      id,
    },
  });
}
