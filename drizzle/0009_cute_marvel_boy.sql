CREATE TABLE IF NOT EXISTS "testni" (
	"userId" text NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"active" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testni" ADD CONSTRAINT "testni_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
