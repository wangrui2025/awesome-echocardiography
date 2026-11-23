import { skill } from '../../lib/agent-reader';
export const GET = () => new Response(skill, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
