import { Env } from './env';

export const SERVER_API_URL = Env.API_INTERNAL_URL ?? Env.NEXT_PUBLIC_API_BASE_URL;
