import home from '../ui/index.html?raw';
export const dynamic = 'force-dynamic';
export function GET() {
  return new Response(home, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'}});
}
