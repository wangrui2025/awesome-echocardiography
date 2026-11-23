import { llms } from '../lib/agent-reader';
export const GET = () => new Response(llms, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
