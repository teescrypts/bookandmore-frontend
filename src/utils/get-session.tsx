"server only";

import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (session?.value) {
    return session.value;
  } else {
    return undefined;
  }
};
