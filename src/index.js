#!/usr/bin/env node
// nhs-reinjection-mcp · MCP stdio server wrapping nhs-reinjection-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'nhs-reinjection-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'nhs-reinjection_load_scope',
    description: 'loadScope · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadScope } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof loadScope === 'function' ? await loadScope(args) : { error: 'loadScope not callable' };
    }
  },
  {
    name: 'nhs-reinjection_recompute',
    description: 'recompute · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { recompute } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof recompute === 'function' ? await recompute(args) : { error: 'recompute not callable' };
    }
  },
  {
    name: 'nhs-reinjection_fmt',
    description: 'fmt · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { fmt } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof fmt === 'function' ? await fmt(args) : { error: 'fmt not callable' };
    }
  },
  {
    name: 'nhs-reinjection_draw_chart',
    description: 'drawChart · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { drawChart } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof drawChart === 'function' ? await drawChart(args) : { error: 'drawChart not callable' };
    }
  },
  {
    name: 'nhs-reinjection_render_letter',
    description: 'renderLetter · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderLetter } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof renderLetter === 'function' ? await renderLetter(args) : { error: 'renderLetter not callable' };
    }
  },
  {
    name: 'nhs-reinjection_copy_letter',
    description: 'copyLetter · from nhs-reinjection-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { copyLetter } = await import('@ai-native-solutions/nhs-reinjection-sdk');
      return typeof copyLetter === 'function' ? await copyLetter(args) : { error: 'copyLetter not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('nhs-reinjection-mcp v1.0.0 · stdio ready');
