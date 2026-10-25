import source from './page-tree.json';

export interface PageNode {
  id: string;
  title: string;
  children: PageNode[];
}

export const roots: PageNode[] = source;

export const tabs = roots[0].children;

const nodes = new Map<string, PageNode>();

function collect(node: PageNode) {
  nodes.set(node.id, node);
  node.children.forEach(collect);
}

roots.forEach(collect);

export const findPage = (id: string) => nodes.get(id);
