
// import * as CANNON from '@cocos/cannon'

// var tmpVec1 = new CANNON.Vec3();
// var tmpVec2 = new CANNON.Vec3();
// var tmpQuat1 = new CANNON.Quaternion();
// var tmpQuat2 = new CANNON.Quaternion();

// let Body = CANNON.Body

// CANNON.Narrowphase.prototype.getContacts = function (p1, p2, world, result, oldcontacts, frictionResult, frictionPool) {
// 	// Save old contact objects
// 	this.contactPointPool = oldcontacts;
// 	this.frictionEquationPool = frictionPool;
// 	this.result = result;
// 	this.frictionResult = frictionResult;

// 	var qi = tmpQuat1;
// 	var qj = tmpQuat2;
// 	var xi = tmpVec1;
// 	var xj = tmpVec2;

// 	for (var k = 0, N = p1.length; k !== N; k++) {

// 		// Get current collision bodies
// 		var bi = p1[k],
// 			bj = p2[k];

// 		// Get contact material
// 		var bodyContactMaterial = null;
// 		if (bi.material && bj.material) {
// 			bodyContactMaterial = world.getContactMaterial(bi.material, bj.material) || null;
// 		}

// 		var justTest = (
// 			(
// 				(bi.type & Body.KINEMATIC) && (bj.type & Body.STATIC)
// 			) || (
// 				(bi.type & Body.STATIC) && (bj.type & Body.KINEMATIC)
// 			) || (
// 				(bi.type & Body.KINEMATIC) && (bj.type & Body.KINEMATIC)
// 			)
// 		);

// 		for (var i = 0; i < bi.shapes.length; i++) {
// 			bi.quaternion.mult(bi.shapeOrientations[i], qi);
// 			bi.quaternion.vmult(bi.shapeOffsets[i], xi);
// 			xi.vadd(bi.position, xi);
// 			var si = bi.shapes[i];

// 			for (var j = 0; j < bj.shapes.length; j++) {

// 				// Compute world transform of shapes
// 				bj.quaternion.mult(bj.shapeOrientations[j], qj);
// 				bj.quaternion.vmult(bj.shapeOffsets[j], xj);
// 				xj.vadd(bj.position, xj);
// 				var sj = bj.shapes[j];

// 				if (!((si.collisionFilterMask & sj.collisionFilterGroup) && (sj.collisionFilterMask & si.collisionFilterGroup))) {
// 					continue;
// 				}

// 				if (xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius) {
// 					continue;
// 				}

// 				// Get collision material
// 				var shapeContactMaterial = null;
// 				if (si.material && sj.material) {
// 					shapeContactMaterial = world.getContactMaterial(si.material, sj.material) || null;
// 				}

// 				this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || world.defaultContactMaterial;

// 				// Get contacts
// 				var resolver = this[si.type | sj.type];
// 				if (resolver) {
// 					var retval = false;
// 					if (si.type < sj.type) {
// 						retval = resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
// 					} else {
// 						retval = resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj, justTest);
// 					}

// 					if (retval && justTest) {
// 						// Register overlap
// 						return true
// 					}
// 				}
// 			}
// 		}
// 	}
// 	return false
// };
