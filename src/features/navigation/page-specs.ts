import { roots, type PageNode } from './tree';
// Explicit per-ID configuration is reviewed alongside the PDF; labels never determine page behavior.
import configuration from './page-config.json';

export type PageKind = 'menu' | 'list' | 'form' | 'choice' | 'toggle' | 'media' | 'action' | 'detail';

export interface PageSpec {
  node: PageNode;
  path: string[];
  kind: PageKind;
}

const specs = new Map<string, PageSpec>();

export interface PageConfig {
  kind: PageKind;
  parentId: string | null;
  control: string;
  selectionMode: 'single' | 'multiple';
}

export const pageConfiguration = configuration as Record<string, PageConfig>;

export const isAction = (node: PageNode) => pageConfiguration[node.id].kind === 'action';

export const isField = (node: PageNode) => pageConfiguration[node.id].control === 'field';

export const isToggle = (node: PageNode) => pageConfiguration[node.id].kind === 'toggle';

export const isMedia = (node: PageNode) => pageConfiguration[node.id].kind === 'media';

function collect(node: PageNode, parents: string[]) {
  const path = [...parents, node.title];
  specs.set(node.id, { node, path, kind: pageConfiguration[node.id].kind });
  node.children.forEach((child) => collect(child, path));
}

roots.forEach((node) => collect(node, []));

export const pageSpecs = specs;

export const getPageSpec = (id: string) => specs.get(id);
