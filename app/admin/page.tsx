import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminPanel from "../../components/AdminPanel";

import { db } from "@/db";
import { receipes, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function Admin() {
  const session = await getServerSession(authOptions);
  const result = await db.select().from(receipes).innerJoin(users, eq(receipes.userId, users.id)).orderBy(desc(receipes.createdAt));

  if (session?.user?.role === "admin") {
    return (
      <div className="flex-grow">
        You have access.
        <AdminPanel result={result} />
      </div>
    );
  }

  return <div>You don't have access.</div>;
}
