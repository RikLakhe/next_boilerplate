import { getServerSession } from "next-auth";
import { HttpException } from "../exceptions/http-exception";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new HttpException(401, "Unauthorized - User not authenticated");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
