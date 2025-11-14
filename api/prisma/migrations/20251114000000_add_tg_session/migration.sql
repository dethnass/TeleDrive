-- Add tg_session field to users table for persistent Telegram sessions
-- This allows sessions to survive serverless function restarts on Vercel
ALTER TABLE "users" ADD COLUMN "tg_session" TEXT;

-- Add comment for documentation
COMMENT ON COLUMN "users"."tg_session" IS 'Telegram StringSession for persistent authentication across serverless deployments';
