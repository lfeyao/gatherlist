import workspace from '../../ui/workspace.html?raw';
import { requireChatGPTUser } from '../chatgpt-auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  await requireChatGPTUser('/workspace.html');
  return new Response(workspace, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'}});
}
