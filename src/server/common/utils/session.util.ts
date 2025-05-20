import { getServerSession } from "next-auth";
import { HttpException } from "../exceptions/http-exception";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "../prisma/client";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isHR: boolean;
  isManager: boolean;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new HttpException(401, "Unauthorized - User not authenticated");
  }

  // Get user with roles from database
  const user = await prisma.users.findUnique({
    where: { id: Number(session.user.id) },
    select: {
      id: true,
      email: true,
      full_name: true,
      is_admin: true,
      is_hr: true,
      is_manager: true,
    },
  });

  if (!user) {
    throw new HttpException(401, "User not found");
  }

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.full_name,
    isAdmin: user.is_admin,
    isHR: user.is_hr,
    isManager: user.is_manager,
  };
}
