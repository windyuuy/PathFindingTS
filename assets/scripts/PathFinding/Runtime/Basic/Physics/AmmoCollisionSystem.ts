import { Collider } from "cc";
import { cname } from "../convenient";
import { CollisionSystemBase } from "./CollisionSystem";
// import * as AmmoJs from '@cocos/ammo';

@cname("AmmoCollisionSystem")
export class AmmoCollisionSystem extends CollisionSystemBase {

	protected static getBulletBody(collider: Collider): Ammo.btRigidBody {
		return (collider.shape as any)._sharedBody._bodyStruct.body as Ammo.btRigidBody
	}

}
