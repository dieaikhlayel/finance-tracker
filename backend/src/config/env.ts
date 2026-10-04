import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    throw new Error(
      `Environment variable ${name} must be an integer, got "${raw}"`,
    );
  }
  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: optionalInt("PORT", 4000),

  db: {
    host: required("DB_HOST"),
    port: optionalInt("DB_PORT", 3306),
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD ?? "", // empty password is valid for local MySQL
    database: required("DB_NAME"),
  },

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: required("JWT_EXPIRES_IN"),
  },

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
} as const;

if (env.jwt.secret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

if (env.nodeEnv === "production" && env.jwt.secret.includes("replace_with")) {
  throw new Error(
    "Refusing to start in production with the placeholder JWT secret",
  );
}
