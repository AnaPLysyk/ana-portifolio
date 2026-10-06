const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  host: process.env.API_HOST ?? '127.0.0.1',
  port: numberFromEnv(process.env.API_PORT, 3333),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
}

export const authConfigured = () =>
  Boolean(config.adminUsername && config.adminPassword && config.jwtSecret)
