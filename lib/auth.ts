
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("auth_token")?.value;

  if (!userIdStr) {
    return null;
  }

  const userId = parseInt(userIdStr);
  
  if (isNaN(userId)) {
      return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}
