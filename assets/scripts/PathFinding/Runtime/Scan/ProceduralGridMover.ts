import { Vec2, Vec3 } from "cc";
import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { Transform } from "../Basic/Transform";
import { AstarPath } from "./AstarPath";
import { AstarWorkItem } from "./AstarWorkItem";
import { GridGraph } from "./GridGenerator";
import { GridNode } from "./GridNode";
import { IntRect } from "./IntRect";

export class ProceduralGridMover {

	public Init(options: PathFinderOptions) {
		this.graph = new GridGraph();
		this.graph.Init(options)
	}

	public scan() {
		this.UpdateGraph();
	}

	protected updatingGraph: boolean = false

	public UpdateGraph(): void {
		if (this.updatingGraph) {
			// We are already updating the graph
			// so ignore this call
			return;
		}

		this.updatingGraph = true;

		// Start a work item for updating the graph
		// This will pause the pathfinding threads
		// so that it is safe to update the graph
		// and then do it over several frames
		// (hence the IEnumerator coroutine)
		// to avoid too large FPS drops
		var ie = this.UpdateGraphCoroutine();
		// await ie
	}

	graph!: GridGraph;

	PointToGraphSpace(p: Vec3): Vec3 {
		// Multiply with the inverse matrix of the graph
		// to get the point in graph space
		return this.graph.transform.InverseTransform(p);
	}

	public target!: Transform;
	public get targetPosition(): Vec3 {
		return this.graph.center
	}
	buffer: GridNode[] = [];

	public UpdateGraphCoroutine() {
		// Find the direction that we want to move the graph in.
		// Calcuculate this in graph space (where a distance of one is the size of one node)
		var dir = this.PointToGraphSpace(this.targetPosition).subtract(this.PointToGraphSpace(this.graph.center));

		// Snap to a whole number of nodes
		dir.x = Math.round(dir.x);
		dir.z = Math.round(dir.z);
		dir.y = 0;

		// Nothing do to
		if (dir.equals(Vec3.ZERO)) {
			// yield break;
			return;
		}

		// Number of nodes to offset in each direction
		var offset = new Vec2(-Math.round(dir.x), -Math.round(dir.z));

		// Move the center (this is in world units, so we need to convert it back from graph space)
		this.graph.center.add(this.graph.transform.TransformVector(dir));
		this.graph.UpdateTransform();

		// Cache some variables for easier access
		var width = this.graph.width;
		var depth = this.graph.depth;
		var nodes: GridNode[] = [];
		// Layers are required when handling LayeredGridGraphs
		var layers = this.graph.LayerCount;
		nodes = this.graph.nodes;

		// Create a temporary buffer required for the calculations
		if (this.buffer == null || this.buffer.length != width * depth) {
			// this.buffer = new GridNode[width * depth];
			for (var i = 0; i < width * depth; i++) {
				this.buffer[i] = new GridNode();
			}
		}

		// Check if we have moved less than a whole graph width all directions
		// If we have moved more than this we can just as well recalculate the whole graph
		if (Math.abs(offset.x) <= width && Math.abs(offset.y) <= depth) {
			var recalculateRect: IntRect = new IntRect(0, 0, offset.x, offset.y);

			// If offset.x < 0, adjust the rect
			if (recalculateRect.xmin > recalculateRect.xmax) {
				var tmp2 = recalculateRect.xmax;
				recalculateRect.xmax = width + recalculateRect.xmin;
				recalculateRect.xmin = width + tmp2;
			}

			// If offset.y < 0, adjust the rect
			if (recalculateRect.ymin > recalculateRect.ymax) {
				var tmp2 = recalculateRect.ymax;
				recalculateRect.ymax = depth + recalculateRect.ymin;
				recalculateRect.ymin = depth + tmp2;
			}

			// Connections need to be recalculated for the neighbours as well, so we need to expand the rect by 1
			var connectionRect = recalculateRect.Expand(1);

			// Makes sure the rect stays inside the grid
			connectionRect = IntRect.Intersection(connectionRect, new IntRect(0, 0, width, depth));

			// Offset each node by the #offset variable
			// nodes which would end up outside the graph
			// will wrap around to the other side of it
			for (var l = 0; l < layers; l++) {
				var layerOffset = l * width * depth;
				for (var z = 0; z < depth; z++) {
					var pz = z * width;
					var tz = ((z + offset.y + depth) % depth) * width;
					for (var x = 0; x < width; x++) {
						this.buffer[tz + ((x + offset.x + width) % width)] = nodes[layerOffset + pz + x];
					}
				}

				// yield return null;

				// Copy the nodes back to the graph
				// and set the correct indices
				for (var z = 0; z < depth; z++) {
					var pz = z * width;
					for (var x = 0; x < width; x++) {
						var newIndex = pz + x;
						var node = this.buffer[newIndex];
						if (node != null) node.NodeInGridIndex = newIndex;
						nodes[layerOffset + newIndex] = node;
					}

					// Calculate the limits for the region that has been wrapped
					// to the other side of the graph
					var xmin, xmax;
					if (z >= recalculateRect.ymin && z < recalculateRect.ymax) {
						xmin = 0;
						xmax = depth;
					} else {
						xmin = recalculateRect.xmin;
						xmax = recalculateRect.xmax;
					}

					for (var x = xmin; x < xmax; x++) {
						var node = this.buffer[pz + x];
						if (node != null) {
							// Clear connections on all nodes that are wrapped and placed on the other side of the graph.
							// This is both to clear any custom connections (which do not really make sense after moving the node)
							// and to prevent possible exceptions when the node will later (possibly) be destroyed because it was
							// not needed anymore (only for layered grid graphs).
							node.ClearConnections(false);
						}
					}
				}

				// yield return null;
			}

			// The calculation will only update approximately this number of
			// nodes per frame. This is used to keep CPU load per frame low
			var yieldEvery = 1000;
			// To avoid the update taking too long, make yieldEvery somewhat proportional to the number of nodes that we are going to update
			var approxNumNodesToUpdate = Math.max(Math.abs(offset.x), Math.abs(offset.y)) * Math.max(width, depth);
			yieldEvery = Math.max(yieldEvery, approxNumNodesToUpdate / 10);
			var counter = 0;

			// Recalculate the nodes
			// Take a look at the image in the docs for the UpdateGraph method
			// to see which nodes are being recalculated.
			for (var z = 0; z < depth; z++) {
				var xmin, xmax;
				if (z >= recalculateRect.ymin && z < recalculateRect.ymax) {
					xmin = 0;
					xmax = width;
				} else {
					xmin = recalculateRect.xmin;
					xmax = recalculateRect.xmax;
				}

				for (var x = xmin; x < xmax; x++) {
					this.graph.RecalculateCell(x, z, false, false);
				}

				counter += (xmax - xmin);

				if (counter > yieldEvery) {
					counter = 0;
					// yield return null;
				}
			}

			for (var z = 0; z < depth; z++) {
				var xmin, xmax;
				if (z >= connectionRect.ymin && z < connectionRect.ymax) {
					xmin = 0;
					xmax = width;
				} else {
					xmin = connectionRect.xmin;
					xmax = connectionRect.xmax;
				}

				for (var x = xmin; x < xmax; x++) {
					this.graph.CalculateConnections(x, z);
				}

				counter += (xmax - xmin);

				if (counter > yieldEvery) {
					counter = 0;
					// yield return null;
				}
			}

			// yield return null;

			// Calculate all connections for the nodes along the boundary
			// of the graph, these always need to be updated
			/// <summary>TODO: Optimize to not traverse all nodes in the graph, only those at the edges</summary>
			for (var z = 0; z < depth; z++) {
				for (var x = 0; x < width; x++) {
					if (x == 0 || z == 0 || x == width - 1 || z == depth - 1) {
						this.graph.CalculateConnections(x, z);
					}
				}
			}
		} else {
			// The calculation will only update approximately this number of
			// nodes per frame. This is used to keep CPU load per frame low
			var yieldEvery = Math.max(depth * width / 20, 1000);
			var counter = 0;
			// Just update all nodes
			for (var z = 0; z < depth; z++) {
				for (var x = 0; x < width; x++) {
					this.graph.RecalculateCell(x, z);
				}
				counter += width;
				if (counter > yieldEvery) {
					counter = 0;
					// yield return null;
				}
			}

			// Recalculate the connections of all nodes
			for (var z = 0; z < depth; z++) {
				for (var x = 0; x < width; x++) {
					this.graph.CalculateConnections(x, z);
				}
				counter += width;
				if (counter > yieldEvery) {
					counter = 0;
					// yield return null;
				}
			}
		}
	}
}
