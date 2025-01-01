"server only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (session?.value) {
    return session.value;
  } else {
    return undefined;
  }
};
