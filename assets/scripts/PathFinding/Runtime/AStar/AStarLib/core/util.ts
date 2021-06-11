import { FindPathResult } from "../finders/astar-finder";
import { ANode } from './node';

/**
 * Backtrace from end node through parents and return the path.
 * @param node
 * @param includeStartingNode
 */
export function backtrace(
  out: FindPathResult,
  node: ANode,
  includeStartNode: boolean,
  includeEndNode: boolean
): void {
  // Init empty path
  // const path: number[][] = [];
  const nodes = out.nodes

  let currentNode: ANode | undefined;
  if (includeEndNode) {
    // Attach the end node to be the current node
    currentNode = node;
  } else {
    currentNode = node.getParent();
  }

  // Loop as long the current node has a parent
  while (currentNode != undefined && currentNode.getParent()) {
    // path.push([currentNode.ipos.x, currentNode.ipos.y]);
    nodes.push(currentNode)
    currentNode = currentNode.getParent();
  }

  // If true we will also include the starting node
  if (currentNode != undefined && includeStartNode) {
    nodes.push(currentNode)
    // path.push([currentNode.ipos.x, currentNode.ipos.y]);
  }

  // return path.reverse();
  nodes.reverse()
}
