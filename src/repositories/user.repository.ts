import prisma from '../db/prisma';
import { UserStatus } from '../generated/prisma/enums';

export const UserRepository = {
  async create(data: { cognitoId: string; email: string; firstName: string; lastName: string }) {
    return prisma.user.create({ data });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async updateStatus(userId: string, status: UserStatus) {
    return prisma.user.update({ where: { userId }, data: { status } });
  },
};
