import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import QuestionForm from "../components/QuestionForm";

import { db } from "@/db";
import { receipes, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

export default async function Dashboard() {
  const session: { user: { name: string } } | null = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const result = await db.select().from(receipes).innerJoin(users, eq(receipes.userId, users.id));

  const res = await db.query.users.findFirst({
    with: {
      receipes: true,
    },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      {!session.user.name ? <p>What is your name?</p> : null}
      <QuestionForm user={session.user.name} />
      <div className="p-8">
        {result.map((item) => (
          <div className="flex flex-col" key={item.recipe.createdAt.toString()}>
            <p>
              {item.recipe.description} by {item.user.name} -
            </p>
            <p title={`${item.recipe.createdAt}`}>{formatTimeAgo(item.recipe.createdAt)}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
