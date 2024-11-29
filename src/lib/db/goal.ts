import { Goal } from "@prisma/client";
import prisma from "./prisma";

export async function getGoals(): Promise<Goal[]> {
  return await prisma.goal.findMany();
}

export async function getGoalById(id: string): Promise<Goal | null> {
  return await prisma.goal.findUnique({
    where: { id },
  });
}

export async function getGoalsByUserId(userId: string): Promise<Goal[]> {
  return await prisma.goal.findMany({
    where: {
      userId,
    },
  });
}

export async function createGoal(data: Goal): Promise<Goal> {
  return await prisma.goal.create({
    data,
  });
}

export async function updateGoal(id: string, data: Goal): Promise<Goal> {
  return await prisma.goal.update({
    where: { id },
    data,
  });
}

export async function deleteGoal(id: string): Promise<Goal> {
  return await prisma.goal.delete({
    where: {
      id,
    },
  });
}
