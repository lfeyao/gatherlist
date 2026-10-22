import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { accountResponse } from '../../../lib/accounts.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {return accountResponse(request,env.DB,await getChatGPTUser());}
export async function POST(request: Request) {return accountResponse(request,env.DB,await getChatGPTUser());}
