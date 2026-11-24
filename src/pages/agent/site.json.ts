import { readerIndex } from '../../lib/agent-reader';
export const GET = () => new Response(JSON.stringify(readerIndex, null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
