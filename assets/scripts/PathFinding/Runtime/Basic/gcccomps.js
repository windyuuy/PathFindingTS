var gcc;
(function (gcc) {
    var uit;
    (function (uit) {
        window['gcc'] = gcc;
    })(uit = gcc.uit || (gcc.uit = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var box2d;
    (function (box2d) {
        var tools;
        (function (tools) {
            var b2data = fsync.box2d.b2data;
            function convCCVec2(vec2) {
                return fsync.Vector2.fromXYZLike(vec2);
            }
            function convCCVec3(vec3) {
                return fsync.Vector3.fromXYZLike(vec3);
            }
            function convCCSize2(size2) {
                return fsync.Size2.fromSize2Like(size2);
            }
            function convCCSize3(size3) {
                return fsync.Size3.fromSize3Like(size3);
            }
            /**
             * box2d预制体导出工具
             */
            var Box2DExport = /** @class */ (function () {
                function Box2DExport() {
                    this.handlers = {};
                }
                Box2DExport.prototype.writeFile = function (fileName, ss) {
                    if (window["Editor"]) {
                        // console.log("export file:", fileName)
                        var path = window['require']('path');
                        Editor.log("export file:", path.normalize(fileName).replace(/\\/mg, "/"));
                        var fs = window['require']('fs');
                        fs.writeFileSync(fileName, ss);
                    }
                };
                /**
                 *
                 * @param dir
                 * @param outDir
                 * @param call
                 * @param throwAnyError 抛出任何异常,并打断当前导出流程
                 */
                Box2DExport.prototype.exportPrefabs = function (dir, outDir, call, throwAnyError) {
                    var _this = this;
                    if (throwAnyError === void 0) { throwAnyError = true; }
                    Editor.warn("export file:", "\u5BFC\u51FA\u76EE\u5F55 " + dir + " \u5F00\u59CB\u3002");
                    cc.loader.loadResDir(dir, cc.Prefab, function (err, reses) {
                        if (!err) {
                            var _loop_1 = function (res) {
                                _this.tryRun("\u5BFC\u51FA\u9884\u5236\u4F53\u5931\u8D25: " + res.name, function () {
                                    _this.handleBox2dPrefab(res, outDir);
                                }, throwAnyError);
                            };
                            for (var _i = 0, reses_1 = reses; _i < reses_1.length; _i++) {
                                var res = reses_1[_i];
                                _loop_1(res);
                            }
                            if (window["Editor"]) {
                                Editor.warn("export file:", "\u5BFC\u51FA\u76EE\u5F55 " + dir + " \u7ED3\u675F\u3002");
                            }
                        }
                        call && call(err);
                    });
                };
                /**
                 * 转换预制体
                 * @param prefab
                 * @param outDir
                 */
                Box2DExport.prototype.handleBox2dPrefab = function (prefab, outDir) {
                    tools.nodeUIDTool.reset();
                    var b2Node = this.convBox2dPrefab(prefab);
                    var sentences = b2data.exportB2NodeToTypescript(b2Node);
                    var ss = sentences.join("\n");
                    this.writeFile(outDir + "/" + prefab.name + ".ts", ss);
                    this.writeFile(outDir + "/" + prefab.name + ".json", JSON.stringify(b2Node));
                };
                Box2DExport.prototype.tryRun = function (tip, call, reThrow) {
                    if (reThrow === void 0) { reThrow = true; }
                    try {
                        return call && call();
                    }
                    catch (e) {
                        if (window["Editor"]) {
                            Editor.error(tip);
                        }
                        else {
                            console.error(tip);
                        }
                        if (reThrow) {
                            throw e;
                        }
                    }
                };
                Box2DExport.prototype.convBox2dPrefab = function (prefab) {
                    // let node = cc.instantiate(prefab)
                    var node = prefab.data;
                    // this.detectDuplicatedChildName(node)
                    var model = this.convBox2dNode(prefab.name, node);
                    return model;
                };
                /**
                 * 检测重名子节点，保证简化版uid一致
                 */
                Box2DExport.prototype.detectDuplicatedChildName = function (node) {
                    var map = {};
                    node.children.forEach(function (child) {
                        if (!map[child.name]) {
                            map[child.name] = true;
                        }
                        else {
                            var tip = "detectDuplicatedChildName: " + child.parent.name + "/" + child.name;
                            if (window["Editor"]) {
                                Editor.error(tip);
                            }
                            else {
                                throw new Error(tip);
                            }
                        }
                    });
                };
                /**
                 * 转换节点
                 * @param name
                 * @param node
                 */
                Box2DExport.prototype.convBox2dNode = function (name, node) {
                    var b2Node = new b2data.Box2DNode();
                    b2Node.oid = this.getNodeUID(node);
                    b2Node.name = name;
                    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        if (!!child.getComponent(cc.RigidBody)) {
                            var b2Body = this.handleBox2dBody(child);
                            b2Node.children.push(b2Body);
                        }
                    }
                    for (var _b = 0, _c = node.getComponentsInChildren(tools.CCB2SkillComp); _b < _c.length; _b++) {
                        var comp = _c[_b];
                        var b2Comp = this.handleSkillComp(comp);
                        b2Node.skillExtras.push(b2Comp);
                    }
                    {
                        var transform_1 = new b2data.Transform();
                        transform_1.oid = "transform_" + this.getNodeUID(node);
                        transform_1.position = convCCVec3(node.position);
                        transform_1.rotation = -node.angle;
                        transform_1.ctype = "transform";
                        b2Node.transform = transform_1;
                    }
                    return b2Node;
                };
                Box2DExport.prototype.getBodyNodeUID = function (node) {
                    return tools.nodeUIDTool.getBodyNodeUID(node);
                    // return `uid^${node.parent.name}^${node.name}`
                    // return node.uuid
                };
                Box2DExport.prototype.getCompUID = function (comp) {
                    return tools.nodeUIDTool.getCompUID(comp);
                    // return `uid^${comp.node.parent.name}^${comp.node.name}^${comp.name}`
                    // return comp.uuid
                };
                Box2DExport.prototype.getNodeUID = function (node) {
                    return tools.nodeUIDTool.getNodeUID(node);
                    // return `uid^${node.name}`
                    // return node.uuid
                };
                /**
                 * 转换含有rigidbody的子节点
                 * @param node
                 */
                Box2DExport.prototype.handleBox2dBody = function (node) {
                    var _this = this;
                    var b2Body = new b2data.Box2DBody();
                    b2Body.name = node.name;
                    b2Body.oid = this.getBodyNodeUID(node);
                    var comps = node.getComponents(cc.Component)
                        // 过滤掉禁用的
                        .filter(function (comp) { return comp.enabled; });
                    for (var _i = 0, comps_1 = comps; _i < comps_1.length; _i++) {
                        var comp = comps_1[_i];
                        var b2Comp = this.handleBox2dComponent(comp);
                        if (b2Comp) {
                            b2Comp.ctype = comp.constructor.name;
                            b2Comp.oid = this.getCompUID(comp);
                            b2Body.components.push(b2Comp);
                        }
                    }
                    // {
                    //     let b2Comp = this.handleTransform(node)
                    //     b2Body.components.push(b2Comp as any)
                    // }
                    {
                        this.tryRun("\u8F6C\u6362\u78B0\u649E\u5206\u7EC4\u4FE1\u606F\u5931\u8D25: " + node.parent.name + "/" + node.name, function () {
                            var collisionGroup = _this.handleCollisionGroup(node);
                            b2Body.collisionGroup = collisionGroup;
                        });
                    }
                    {
                        var transform_2 = new b2data.Transform();
                        transform_2.oid = "transform_" + this.getBodyNodeUID(node);
                        transform_2.position = convCCVec3(node.position);
                        transform_2.rotation = -node.angle;
                        transform_2.ctype = "transform";
                        b2Body.transform = transform_2;
                    }
                    return b2Body;
                };
                /**
                 * 转换碰撞分组信息
                 * @param node
                 */
                Box2DExport.prototype.handleCollisionGroup = function (node) {
                    var collisionGroup = new b2data.CollisionGroup();
                    var collisionComp = node.getComponent(tools.CCB2CollisionComp);
                    if (collisionComp != null) {
                        var collisionInfo = collisionComp.toJson();
                        collisionGroup.enabled = true;
                        collisionGroup.categoryBits = (collisionInfo.categoryBits || "").replace(/；/mg, ";");
                        collisionGroup.groupIndex = (collisionInfo.groupIndex || "").replace(/；/mg, ";");
                        collisionGroup.maskBits = (collisionInfo.maskBits || "").replace(/；/mg, ";");
                    }
                    return collisionGroup;
                };
                // /**
                //  * 转换方位
                //  * @param node 
                //  */
                // handleTransform(node: cc.Node) {
                //     let transform = new b2data.Transform()
                //     transform.oid = "transform_" + this.getBodyNodeUID(node)
                //     transform.position = convCCVec3(node.position)
                //     transform.rotation = -node.angle
                //     transform.ctype = "transform"
                //     return transform
                // }
                /**
                 * 转换技能组件
                 * @param comp
                 */
                Box2DExport.prototype.handleSkillComp = function (comp) {
                    return this.tryRun("\u8F6C\u6362\u7EC4\u4EF6\u5931\u8D25: " + comp.node.parent.name + "/" + comp.node.name + "/" + comp.name, function () {
                        if (comp instanceof tools.CCB2SkillComp && comp.enabled) {
                            var data = comp.toJson();
                            var result = new b2data.SkillExtra();
                            for (var _i = 0, _a = Object.getOwnPropertyNames(data); _i < _a.length; _i++) {
                                var key = _a[_i];
                                result[key] = data[key];
                            }
                            return result;
                        }
                        return null;
                    });
                };
                /**
                 * 转换box2d组件
                 * @param comp
                 */
                Box2DExport.prototype.handleBox2dComponent = function (comp) {
                    var _this = this;
                    return this.tryRun("\u8F6C\u6362box2d\u7EC4\u4EF6\u5931\u8D25: " + comp.node.parent.name + "/" + comp.node.name + "/" + comp.name, function () {
                        var name = comp.constructor.name;
                        var handleKey = name.substr(3);
                        /**
                         * 反射转换组件处理函数
                         */
                        var call = _this["handle" + handleKey];
                        if (call) {
                            var b2Comp = call.call(_this, comp);
                            return b2Comp;
                        }
                        else {
                            if (["cc_Sprite"].indexOf(name) < 0) {
                                console.log("skip handle " + name);
                            }
                        }
                        return null;
                    });
                };
                /**
                 * 注册box2d组件转换函数
                 */
                Box2DExport.prototype.registerHandler = function () {
                    var _this = this;
                    this.handlers[cc.RigidBody.name] = function (comp) { return _this.handleRigidBody(comp); };
                    this.handlers[cc.PhysicsPolygonCollider.name] = function (comp) { return _this.handlePhysicsPolygonCollider(comp); };
                    this.handlers[cc.RevoluteJoint.name] = function (comp) { return _this.handleRevoluteJoint(comp); };
                    this.handlers[cc.PhysicsBoxCollider.name] = function (comp) { return _this.handlePhysicsBoxCollider(comp); };
                    this.handlers[cc.PhysicsCircleCollider.name] = function (comp) { return _this.handlePhysicsCircleCollider(comp); };
                    this.handlers[cc.WheelJoint.name] = function (comp) { return _this.handleWheelJoint(comp); };
                    this.handlers[cc.WeldJoint.name] = function (comp) { return _this.handleWeldJoint(comp); };
                    this.handlers[cc.PrismaticJoint.name] = function (comp) { return _this.handlePrismaticJoint(comp); };
                };
                Box2DExport.prototype.handlePrismaticJoint = function (comp) {
                    var dataComp = new b2data.PrismaticJoint();
                    this.copyJointAttrs(dataComp, comp);
                    dataComp.enableMotor = comp.enableMotor;
                    dataComp.localAxisA = convCCVec2(comp.localAxisA);
                    dataComp.motorSpeed = comp.motorSpeed;
                    dataComp.oid = this.getCompUID(comp);
                    dataComp.localAxisA = convCCVec2(comp.localAxisA);
                    dataComp.referenceAngle = comp.referenceAngle;
                    dataComp.enableLimit = comp.enableLimit;
                    dataComp.enableMotor = comp.enableMotor;
                    dataComp.lowerLimit = comp.lowerLimit;
                    dataComp.upperLimit = comp.upperLimit;
                    dataComp.maxMotorForce = comp.maxMotorForce;
                    dataComp.motorSpeed = comp.motorSpeed;
                    return dataComp;
                };
                Box2DExport.prototype.handleWheelJoint = function (comp) {
                    var dataComp = new b2data.WheelJoint();
                    this.copyJointAttrs(dataComp, comp);
                    dataComp.dampingRatio = comp.dampingRatio;
                    dataComp.enableMotor = comp.enableMotor;
                    dataComp.frequency = comp.frequency;
                    dataComp.localAxisA = convCCVec2(comp.localAxisA);
                    dataComp.maxMotorTorque = comp.maxMotorTorque;
                    dataComp.motorSpeed = comp.motorSpeed;
                    dataComp.oid = this.getCompUID(comp);
                    return dataComp;
                };
                Box2DExport.prototype.handleWeldJoint = function (comp) {
                    var dataComp = new b2data.WeldJoint();
                    this.copyJointAttrs(dataComp, comp);
                    dataComp.referenceAngle = comp.referenceAngle;
                    dataComp.dampingRatio = comp.dampingRatio;
                    dataComp.frequency = comp.frequency;
                    dataComp.oid = this.getCompUID(comp);
                    return dataComp;
                };
                Box2DExport.prototype.handleRigidBody = function (comp) {
                    if (comp) {
                        var dataComp = new b2data.RigidBody();
                        dataComp.ctype = cc.RigidBody.name;
                        dataComp.oid = this.getCompUID(comp);
                        dataComp.enabledContactListener = comp.enabledContactListener;
                        dataComp.bullet = comp.bullet;
                        dataComp.type = comp.type;
                        dataComp.allowSleep = comp.allowSleep;
                        dataComp.gravityScale = comp.gravityScale;
                        dataComp.linearDamping = comp.linearDamping;
                        dataComp.angularDamping = comp.angularDamping;
                        dataComp.linearVelocity = convCCVec2(comp.linearVelocity);
                        dataComp.angularVelocity = comp.angularVelocity;
                        dataComp.fixedRotation = comp.fixedRotation;
                        dataComp.awake = true;
                        dataComp.awakeOnLoad = comp.awakeOnLoad;
                        // dataComp.active = comp.active
                        dataComp.active = true;
                        return dataComp;
                    }
                };
                Box2DExport.prototype.copyPhysicsColliderAttrs = function (dataComp, comp) {
                    dataComp.body = this.handleRigidBody(comp.body);
                    dataComp.density = comp.density;
                    dataComp.friction = comp.friction;
                    dataComp.restitution = comp.restitution;
                    dataComp.sensor = comp.sensor;
                    dataComp.tag = comp.tag;
                    var sprite = comp.getComponent(cc.Sprite);
                    if (sprite) {
                        if (sprite.spriteFrame) {
                            var displayKey = sprite.spriteFrame.name;
                            dataComp.displayKey = displayKey;
                        }
                    }
                    return dataComp;
                };
                Box2DExport.prototype.copyJointAttrs = function (dataComp, comp) {
                    dataComp.anchor = convCCVec2(comp.anchor);
                    dataComp.collideConnected = comp.collideConnected;
                    dataComp.connectedAnchor = convCCVec2(comp.connectedAnchor);
                    dataComp.connectedBody = this.handleRigidBody(comp.connectedBody);
                    return dataComp;
                };
                Box2DExport.prototype.handlePhysicsCircleCollider = function (comp) {
                    var dataComp = new b2data.PhysicsCircleCollider();
                    this.copyPhysicsColliderAttrs(dataComp, comp);
                    dataComp.offset = convCCVec2(comp.offset);
                    dataComp.radius = comp.radius;
                    return dataComp;
                };
                Box2DExport.prototype.handlePhysicsBoxCollider = function (comp) {
                    var dataComp = new b2data.PhysicsBoxCollider();
                    this.copyPhysicsColliderAttrs(dataComp, comp);
                    dataComp.offset = convCCVec2(comp.offset);
                    dataComp.size = convCCSize2(comp.size);
                    return dataComp;
                };
                Box2DExport.prototype.handlePhysicsPolygonCollider = function (comp) {
                    var dataComp = new b2data.PhysicsPolygonCollider();
                    this.copyPhysicsColliderAttrs(dataComp, comp);
                    dataComp.body = this.handleRigidBody(comp.body);
                    dataComp.offset = convCCVec2(comp.offset);
                    dataComp.points = comp.points.map(function (pt) { return convCCVec2(pt); });
                    return dataComp;
                };
                Box2DExport.prototype.handleRevoluteJoint = function (comp) {
                    var dataComp = new b2data.RevoluteJoint();
                    this.copyJointAttrs(dataComp, comp);
                    dataComp.enableLimit = comp.enableLimit;
                    dataComp.enableMotor = comp.enableMotor;
                    dataComp.lowerAngle = comp.lowerAngle;
                    dataComp.maxMotorTorque = comp.maxMotorTorque;
                    dataComp.motorSpeed = comp.motorSpeed;
                    dataComp.referenceAngle = comp.referenceAngle;
                    dataComp.upperAngle = comp.upperAngle;
                    return dataComp;
                };
                Box2DExport.inst = new Box2DExport();
                return Box2DExport;
            }());
            tools.Box2DExport = Box2DExport;
        })(tools = box2d.tools || (box2d.tools = {}));
    })(box2d = gcc.box2d || (gcc.box2d = {}));
})(gcc || (gcc = {}));
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var gcc;
(function (gcc) {
    var box2d;
    (function (box2d) {
        var tools;
        (function (tools) {
            var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
            /**
             * 碰撞组件基类
             * - 包括设置分组信息
             */
            var CCB2CollisionComp = /** @class */ (function (_super) {
                __extends(CCB2CollisionComp, _super);
                function CCB2CollisionComp() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CCB2CollisionComp.prototype.toJson = function () {
                    return null;
                };
                return CCB2CollisionComp;
            }(cc.Component));
            tools.CCB2CollisionComp = CCB2CollisionComp;
        })(tools = box2d.tools || (box2d.tools = {}));
    })(box2d = gcc.box2d || (gcc.box2d = {}));
})(gcc || (gcc = {}));
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var gcc;
(function (gcc) {
    var box2d;
    (function (box2d) {
        var tools;
        (function (tools) {
            var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
            /**
             * 技能组件基类
             */
            var CCB2SkillComp = /** @class */ (function (_super) {
                __extends(CCB2SkillComp, _super);
                function CCB2SkillComp() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.mynote = "";
                    return _this;
                }
                CCB2SkillComp.prototype.toJson = function () {
                    return {
                        oid: this.uuid,
                        skillType: "",
                    };
                };
                CCB2SkillComp.prototype.getSelfRigidBody = function () {
                    return this.getComponent(cc.RigidBody);
                };
                CCB2SkillComp.prototype.getSelfUID = function () {
                    return this.getCompUID(this);
                };
                CCB2SkillComp.prototype.getSelfNodeUID = function () {
                    return this.getBodyNodeUID(this.node);
                };
                CCB2SkillComp.prototype.getBodyNodeUID = function (node) {
                    return tools.nodeUIDTool.getBodyNodeUID(node);
                    // return `uid^${node.parent.name}^${node.name}`
                    // return node.uuid
                };
                CCB2SkillComp.prototype.getCompUID = function (comp) {
                    return tools.nodeUIDTool.getCompUID(comp);
                    // return `uid^${comp.node.parent.name}^${comp.node.name}^${comp.name}`
                    // return comp.uuid
                };
                CCB2SkillComp.prototype.getNodeUID = function (node) {
                    return tools.nodeUIDTool.getNodeUID(node);
                    // return `uid^${node.name}`
                    // return node.uuid
                };
                __decorate([
                    property({ displayName: "备注", editorOnly: true, })
                ], CCB2SkillComp.prototype, "mynote", void 0);
                return CCB2SkillComp;
            }(cc.Component));
            tools.CCB2SkillComp = CCB2SkillComp;
        })(tools = box2d.tools || (box2d.tools = {}));
    })(box2d = gcc.box2d || (gcc.box2d = {}));
})(gcc || (gcc = {}));
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var gcc;
(function (gcc) {
    var box2d;
    (function (box2d) {
        var tools;
        (function (tools) {
            var CCNodeUIDTool = /** @class */ (function () {
                function CCNodeUIDTool() {
                    this.uuidConvMap = {};
                    this.uuidAcc = 1;
                }
                CCNodeUIDTool.prototype.reset = function () {
                    this.uuidConvMap = {};
                    this.uuidAcc = 1;
                };
                CCNodeUIDTool.prototype.getUIDNum = function (uid) {
                    var num = this.uuidConvMap[uid];
                    if (num == null) {
                        num = this.uuidConvMap[uid] = this.uuidAcc++;
                    }
                    return num;
                };
                CCNodeUIDTool.prototype.getBodyNodeUID = function (node) {
                    var num = this.getUIDNum(node.uuid);
                    return "uid%" + node.parent.name + "%" + node.name + "%" + num;
                    // return node.uuid
                };
                CCNodeUIDTool.prototype.getCompUID = function (comp) {
                    var num = this.getUIDNum(comp.uuid);
                    return "uid%" + comp.node.parent.name + "%" + comp.node.name + "%" + comp.name + "%" + num;
                    // return comp.uuid
                };
                CCNodeUIDTool.prototype.getNodeUID = function (node) {
                    var num = this.getUIDNum(node.uuid);
                    return "uid%" + node.name + "%" + num;
                    // return node.uuid
                };
                return CCNodeUIDTool;
            }());
            tools.CCNodeUIDTool = CCNodeUIDTool;
            tools.nodeUIDTool = new CCNodeUIDTool();
        })(tools = box2d.tools || (box2d.tools = {}));
    })(box2d = gcc.box2d || (gcc.box2d = {}));
})(gcc || (gcc = {}));
// @ts-nocheck
var ConeCollider = cc.ConeCollider, SimplexCollider = cc.SimplexCollider, AudioSource = cc.AudioSource, Camera = cc.Camera, Light = cc.Light, MeshRenderer = cc.MeshRenderer, SkinnedMeshRenderer = cc.SkinnedMeshRenderer, SkinnedMeshBatchRenderer = cc.SkinnedMeshBatchRenderer, SkinnedMeshUnit = cc.SkinnedMeshUnit, DirectionalLight = cc.DirectionalLight, SphereLight = cc.SphereLight, SpotLight = cc.SpotLight, Animation = cc.Animation, AnimationComponent = cc.AnimationComponent, SkeletalAnimation = cc.SkeletalAnimation, Billboard = cc.Billboard, Line = cc.Line, ParticleSystem = cc.ParticleSystem, Collider = cc.Collider, BoxCollider = cc.BoxCollider, SphereCollider = cc.SphereCollider, CapsuleCollider = cc.CapsuleCollider, MeshCollider = cc.MeshCollider, CylinderCollider = cc.CylinderCollider, RigidBody = cc.RigidBody, PhysicsMaterial = cc.PhysicsMaterial, Canvas = cc.Canvas, UIRenderable = cc.UIRenderable, UITransform = cc.UITransform, Button = cc.Button, EditBox = cc.EditBox, Layout = cc.Layout, Mask = cc.Mask, ProgressBar = cc.ProgressBar, RichText = cc.RichText, ScrollBar = cc.ScrollBar, ScrollView = cc.ScrollView, Slider = cc.Slider, Sprite = cc.Sprite, Toggle = cc.Toggle, ToggleContainer = cc.ToggleContainer, UIMeshRenderer = cc.UIMeshRenderer, Widget = cc.Widget, LabelOutline = cc.LabelOutline, Graphics = cc.Graphics, PageView = cc.PageView, PageViewIndicator = cc.PageViewIndicator, UIStaticBatch = cc.UIStaticBatch, UIOpacity = cc.UIOpacity, SafeArea = cc.SafeArea, UICoordinateTracker = cc.UICoordinateTracker, BlockInputEvents = cc.BlockInputEvents, Label = cc.Label;
//@ts-expect-error
cc.Collider = Collider;
//@ts-expect-error
cc.CapsuleCollider = CapsuleCollider;
//@ts-expect-error
cc.SphereCollider = SphereCollider;
//@ts-expect-error
cc.CylinderCollider = CylinderCollider;
//@ts-expect-error
cc.ConeCollider = ConeCollider;
//@ts-expect-error
cc.BoxCollider = BoxCollider;
//@ts-expect-error
cc.SimplexCollider = SimplexCollider;
//@ts-expect-error
cc.MeshCollider = MeshCollider;
//@ts-expect-error
cc.RigidBody = RigidBody;
//@ts-expect-error
cc.PhysicsMaterial = PhysicsMaterial;
//@ts-expect-error
cc.AudioSource = AudioSource;
//@ts-expect-error
cc.Camera = Camera;
//@ts-expect-error
cc.Light = Light;
//@ts-expect-error
cc.MeshRenderer = MeshRenderer;
//@ts-expect-error
cc.SkinnedMeshRenderer = SkinnedMeshRenderer;
//@ts-expect-error
cc.SkinnedMeshBatchRenderer = SkinnedMeshBatchRenderer;
//@ts-expect-error
cc.SkinnedMeshUnit = SkinnedMeshUnit;
//@ts-expect-error
cc.DirectionalLight = DirectionalLight;
//@ts-expect-error
cc.SphereLight = SphereLight;
//@ts-expect-error
cc.SpotLight = SpotLight;
//@ts-expect-error
cc.Animation = Animation !== null && Animation !== void 0 ? Animation : AnimationComponent;
//@ts-expect-error
cc.SkeletalAnimation = SkeletalAnimation;
//@ts-expect-error
cc.Billboard = Billboard;
//@ts-expect-error
cc.Line = Line;
//@ts-expect-error
cc.ParticleSystem = ParticleSystem;
//@ts-expect-error
cc.Canvas = Canvas;
//@ts-expect-error
cc.UIRenderable = UIRenderable;
//@ts-expect-error
cc.UITransform = UITransform;
//@ts-expect-error
cc.Button = Button;
//@ts-expect-error
cc.EditBox = EditBox;
//@ts-expect-error
cc.Layout = Layout;
//@ts-expect-error
cc.Mask = Mask;
//@ts-expect-error
cc.ProgressBar = ProgressBar;
//@ts-expect-error
cc.RichText = RichText;
//@ts-expect-error
cc.ScrollBar = ScrollBar;
//@ts-expect-error
cc.ScrollView = ScrollView;
//@ts-expect-error
cc.Slider = Slider;
//@ts-expect-error
cc.Sprite = Sprite;
//@ts-expect-error
cc.Toggle = Toggle;
//@ts-expect-error
cc.ToggleContainer = ToggleContainer;
//@ts-expect-error
cc.UIMeshRenderer = UIMeshRenderer;
//@ts-expect-error
cc.Widget = Widget;
//@ts-expect-error
cc.LabelOutline = LabelOutline;
//@ts-expect-error
cc.Graphics = Graphics;
//@ts-expect-error
cc.PageView = PageView;
//@ts-expect-error
cc.PageViewIndicator = PageViewIndicator;
//@ts-expect-error
cc.UIStaticBatch = UIStaticBatch;
//@ts-expect-error
cc.UIOpacity = UIOpacity;
//@ts-expect-error
cc.SafeArea = SafeArea;
//@ts-expect-error
cc.UICoordinateTracker = UICoordinateTracker;
//@ts-expect-error
cc.BlockInputEvents = BlockInputEvents;
//@ts-expect-error
cc.Label = Label;
var gcc;
(function (gcc) {
    var prefab;
    (function (prefab_1) {
        var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
        // @ccclass('ChildrenLoader')
        var ChildrenLoader = /** @class */ (function (_super) {
            __extends(ChildrenLoader, _super);
            function ChildrenLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.childrenPrefabs = [];
                _this._showChildren = false;
                return _this;
            }
            Object.defineProperty(ChildrenLoader.prototype, "showChildren", {
                get: function () {
                    return this._showChildren;
                },
                set: function (value) {
                    this._showChildren = value;
                    this.updateChildrenView();
                },
                enumerable: false,
                configurable: true
            });
            ChildrenLoader.prototype.updateChildrenView = function () {
                if (this._showChildren) {
                    this.showProtectedChildren();
                }
                else {
                    this.showPrivateChildren();
                }
            };
            ChildrenLoader.prototype.showPrivateChildren = function () {
                this.cleanChildren();
                for (var _i = 0, _a = this.childrenPrefabs; _i < _a.length; _i++) {
                    var prefab_2 = _a[_i];
                    var prefabName = prefab_2.data && prefab_2.data.name;
                    var uuid = prefab_2["_uuid"] || prefab_2["url"];
                    var pnode2 = new cc.Node("&" + prefabName + "_\u9884\u5236\u4F53\u8282\u70B9_" + uuid);
                    pnode2.addComponent(prefab_1.RuntimeNewNode);
                    var pnode = new cc.PrivateNode("pnode_" + prefabName + "_" + uuid);
                    var node = cc.instantiate(prefab_2);
                    node.parent = pnode;
                    pnode.parent = pnode2;
                    pnode2.parent = this.node;
                }
            };
            ChildrenLoader.prototype.showProtectedChildren = function () {
                this.cleanChildren();
                for (var _i = 0, _a = this.childrenPrefabs; _i < _a.length; _i++) {
                    var prefab_3 = _a[_i];
                    var prefabName = prefab_3.data && prefab_3.data.name;
                    var pnode = new cc.Node("&" + prefabName + "_\u6B64\u8282\u70B9\u4E0B\u6240\u6709\u5185\u5BB9\u4FEE\u6539\u540E\u65E0\u6CD5\u4FDD\u5B58");
                    pnode.addComponent(prefab_1.RuntimeNewNode);
                    var node = cc.instantiate(prefab_3);
                    node.parent = pnode;
                    pnode.parent = this.node;
                }
            };
            ChildrenLoader.prototype.cleanChildren = function () {
                var rmList = this.node.children.filter(function (node) { return node.getComponent(prefab_1.RuntimeNewNode) != null; });
                rmList.forEach(function (node) {
                    node.parent = null;
                    node.destroy();
                });
            };
            ChildrenLoader.prototype.onLoad = function () {
                if (CC_EDITOR) {
                    this.updateChildrenView();
                }
                else {
                    this.cleanChildren();
                    for (var _i = 0, _a = this.childrenPrefabs; _i < _a.length; _i++) {
                        var prefab_4 = _a[_i];
                        var node = cc.instantiate(prefab_4);
                        node.addComponent(prefab_1.RuntimeNewNode);
                        node.parent = this.node;
                    }
                }
            };
            __decorate([
                property({ type: [cc.Prefab] })
            ], ChildrenLoader.prototype, "childrenPrefabs", void 0);
            __decorate([
                property({ type: cc.Boolean, tooltip: "是否展开预制体节点", displayName: "是否展开预制体节点", })
            ], ChildrenLoader.prototype, "showChildren", null);
            ChildrenLoader = __decorate([
                executeInEditMode
            ], ChildrenLoader);
            return ChildrenLoader;
        }(cc.Component));
        prefab_1.ChildrenLoader = ChildrenLoader;
    })(prefab = gcc.prefab || (gcc.prefab = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var prefab;
    (function (prefab) {
        var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
        // @ccclass('RuntimeNewNode')
        var RuntimeNewNode = /** @class */ (function (_super) {
            __extends(RuntimeNewNode, _super);
            function RuntimeNewNode() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RuntimeNewNode;
        }(cc.Component));
        prefab.RuntimeNewNode = RuntimeNewNode;
    })(prefab = gcc.prefab || (gcc.prefab = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var prefab;
    (function (prefab_5) {
        var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
        // @ccclass('SimpleNodeLoader')
        var SimpleNodeLoader = /** @class */ (function (_super) {
            __extends(SimpleNodeLoader, _super);
            function SimpleNodeLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.childrenPrefabs = [];
                _this.siblingPrefabs = [];
                _this.siblingOrder = -1;
                return _this;
            }
            SimpleNodeLoader.prototype.onLoad = function () {
                var selfNode = this.node;
                var selfParent = this.node.parent;
                for (var _i = 0, _a = this.childrenPrefabs; _i < _a.length; _i++) {
                    var prefab_6 = _a[_i];
                    var node = cc.instantiate(prefab_6);
                    node.parent = selfNode;
                }
                for (var _b = 0, _c = this.siblingPrefabs; _b < _c.length; _b++) {
                    var prefab_7 = _c[_b];
                    var node = cc.instantiate(prefab_7);
                    node.parent = selfParent;
                    if (this.siblingOrder >= 0) {
                        node.setSiblingIndex(this.siblingOrder);
                    }
                }
            };
            __decorate([
                property({ type: [cc.Prefab] })
            ], SimpleNodeLoader.prototype, "childrenPrefabs", void 0);
            __decorate([
                property({ type: [cc.Prefab] })
            ], SimpleNodeLoader.prototype, "siblingPrefabs", void 0);
            __decorate([
                property
            ], SimpleNodeLoader.prototype, "siblingOrder", void 0);
            return SimpleNodeLoader;
        }(cc.Component));
        prefab_5.SimpleNodeLoader = SimpleNodeLoader;
    })(prefab = gcc.prefab || (gcc.prefab = {}));
})(gcc || (gcc = {}));
/**
 * 目标：
 * - 支持失败的资源重新加载生效
 * - 对于异步加载成功的节点，支持坐标更改应用
 */
var gcc;
(function (gcc) {
    var resloader;
    (function (resloader) {
        /**
         * 资源加载通知
         */
        var ResLoadNotifier = /** @class */ (function () {
            function ResLoadNotifier() {
                this.isFinished = false;
                this.isLoaded = false;
                this.onLoadList = [];
                this.onErrorList = [];
            }
            ResLoadNotifier.prototype.onLoad = function (call) {
                this.onLoadList.push(call);
                if (this.isFinished && this.isLoaded) {
                    call(this.res);
                }
            };
            ResLoadNotifier.prototype.notifyOnLoad = function (res) {
                this.isFinished = true;
                this.isLoaded = true;
                this.res = res;
                delete this.err;
                this.onLoadList.slice().forEach(function (call) {
                    call(res);
                });
            };
            ResLoadNotifier.prototype.onError = function (call) {
                this.onErrorList.push(call);
                if (this.isFinished && (!this.isLoaded)) {
                    call(this.err);
                }
            };
            ResLoadNotifier.prototype.notifyOnError = function (err) {
                this.isFinished = true;
                this.isLoaded = false;
                this.err = err;
                this.onErrorList.slice().forEach(function (call) {
                    call(err);
                });
            };
            return ResLoadNotifier;
        }());
        resloader.ResLoadNotifier = ResLoadNotifier;
        /**
         * 预制体动态加载工具
         */
        var ResLoader = /** @class */ (function () {
            function ResLoader() {
                this.loadMap = {};
            }
            ResLoader.prototype.getNotifier = function (uri) {
                var notifier = this.loadMap[uri];
                if (notifier == null) {
                    notifier = new ResLoadNotifier();
                    this.loadMap[uri] = notifier;
                }
                return notifier;
            };
            ResLoader.prototype.existNotifier = function (uri) {
                var notifier = this.loadMap[uri];
                return !!notifier;
            };
            ResLoader.prototype.addNotifier = function (uri, notifier) {
                this.loadMap[uri] = notifier;
            };
            ResLoader.prototype.loadPrefab = function (url) {
                var existNotifier = this.existNotifier(url);
                var notifier = this.getNotifier(url);
                if (!existNotifier) {
                    cc && cc["loader"] && cc["loader"].loadRes(url, cc["Prefab"], function (err, asset) {
                        var isLoaded = (err == null && asset != null);
                        if (isLoaded) {
                            notifier.notifyOnLoad(asset);
                        }
                        else {
                            // 加载失败
                            console.error("load res failed, url:" + url + ", err:", err);
                            notifier.notifyOnError(err);
                        }
                    });
                }
                return notifier;
            };
            return ResLoader;
        }());
        resloader.ResLoader = ResLoader;
        resloader.resLoader = new ResLoader();
    })(resloader = gcc.resloader || (gcc.resloader = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        var AssetsManager = /** @class */ (function () {
            function AssetsManager() {
                this.pool = {};
            }
            AssetsManager.prototype.getSubPool = function (key) {
                var subPool = this.pool[key];
                if (subPool == null) {
                    subPool = this.pool[key] = {};
                }
                return subPool;
            };
            AssetsManager.prototype.put = function (key, asset) {
                var subPool = this.getSubPool(key);
                subPool[asset.oid] = asset;
            };
            AssetsManager.prototype.putWithId = function (key, asset, oid) {
                if (oid === void 0) { oid = "null"; }
                var subPool = this.getSubPool(key);
                subPool[oid] = asset;
            };
            AssetsManager.prototype.getGroupKeys = function (key) {
                var subPool = this.getSubPool(key);
                var keys = Object.keys(subPool);
                return keys;
            };
            AssetsManager.prototype.getWithDefault = function (key, oid, call) {
                var subPool = this.getSubPool(key);
                var asset = subPool[oid];
                if (asset == undefined) {
                    asset = call();
                    subPool[oid] = asset;
                }
                return asset;
            };
            AssetsManager.prototype.get = function (key, id) {
                if (id === void 0) { id = "null"; }
                var subPool = this.getSubPool(key);
                return subPool[id];
            };
            AssetsManager.prototype.delete = function (key, id) {
                var subPool = this.getSubPool(key);
                delete subPool[id];
            };
            AssetsManager.prototype.clearGroup = function (key) {
                delete this.pool[key];
            };
            return AssetsManager;
        }());
        respool.AssetsManager = AssetsManager;
        respool.sharedAssetsManager = new AssetsManager();
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        var ResMap = /** @class */ (function () {
            function ResMap() {
                this.resMap = fsync.EmptyTable();
            }
            ResMap.prototype.getItem = function (key) {
                return this.resMap[key];
            };
            ResMap.prototype.setItem = function (key, item) {
                this.resMap[key] = item;
            };
            ResMap.prototype.clear = function () {
                this.resMap = fsync.EmptyTable();
            };
            return ResMap;
        }());
        respool.ResMap = ResMap;
        /**
         * 资源池
         */
        var ResPoolMap = /** @class */ (function () {
            function ResPoolMap() {
                this.resPoolMap = fsync.EmptyTable();
            }
            ResPoolMap.prototype.getResPool = function (key) {
                var pool = this.resPoolMap[key];
                if (pool == null) {
                    pool = [];
                    this.resPoolMap[key] = pool;
                }
                return pool;
            };
            ResPoolMap.prototype.clear = function () {
                this.resPoolMap = fsync.EmptyTable();
            };
            ResPoolMap.prototype.forEachAllRes = function (call) {
                for (var key in this.resPoolMap) {
                    for (var _i = 0, _a = this.resPoolMap[key]; _i < _a.length; _i++) {
                        var node = _a[_i];
                        call(node, key);
                    }
                }
            };
            return ResPoolMap;
        }());
        respool.ResPoolMap = ResPoolMap;
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
/// <reference path="./ResPoolMap.ts" />
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        /**
         * cocos节点池
         */
        var CCNodePoolMap = /** @class */ (function (_super) {
            __extends(CCNodePoolMap, _super);
            function CCNodePoolMap() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CCNodePoolMap.prototype.getOrCreateNodeWithPrefabUrl = function (prefabId, prefabUrl, call) {
                var _this = this;
                cc.resources.load(prefabUrl, function (err, prefab) {
                    if (err) {
                        call(null, err);
                    }
                    var node = _this.getOrCreateNodeWithPrefab(prefabId, prefab);
                    call(node, null);
                });
            };
            CCNodePoolMap.prototype.getOrCreateNodeWithPrefab = function (prefabId, prefab) {
                var pool = this.getResPool(prefabId);
                if (pool.length > 0) {
                    var node = pool.pop();
                    node.emit("ecs:reuse");
                    return node;
                }
                else {
                    if (prefab != null) {
                        var node = respool.ccNodePreloader.instantiate(prefab);
                        node.emit("ecs:reuse");
                        return node;
                    }
                }
                return null;
            };
            CCNodePoolMap.prototype.getOrCreateNodeDynamicly = function (prefabId, prefabLoadListener, call) {
                var pool = this.getResPool(prefabId);
                if (pool.length > 0) {
                    var node = pool.pop();
                    node.emit("ecs:reuse");
                    call(node);
                }
                else {
                    prefabLoadListener.onLoad(function (prefab) {
                        var node = respool.ccNodePreloader.instantiate(prefab);
                        node.emit("ecs:reuse");
                        call(node);
                    });
                }
            };
            CCNodePoolMap.prototype.putNodeToCull = function (prefabId, node) {
                var pool = this.getResPool(prefabId);
                if (pool.indexOf(node) < 0) {
                    node.position = new cc.Vec3(100000, 0, 0);
                    var animComps = node.getComponentsInChildren(cc.Animation);
                    animComps.forEach(function (comp) {
                        comp.stop();
                    });
                    pool.push(node);
                }
            };
            CCNodePoolMap.prototype.putNodeToRemove = function (prefabId, node) {
                var pool = this.getResPool(prefabId);
                if (pool.indexOf(node) < 0) {
                    // node.position = new cc.Vec3(100000, 0, 0)
                    node.parent = null;
                    var animComps = node.getComponentsInChildren(cc.Animation);
                    animComps.forEach(function (comp) {
                        comp.stop();
                    });
                    pool.push(node);
                }
            };
            CCNodePoolMap.prototype.clear = function () {
                for (var key in this.resPoolMap) {
                    var pool = this.resPoolMap[key];
                    for (var _i = 0, pool_1 = pool; _i < pool_1.length; _i++) {
                        var node = pool_1[_i];
                        respool.ccNodePreloader.put(node);
                    }
                }
                _super.prototype.clear.call(this);
            };
            return CCNodePoolMap;
        }(respool.ResPoolMap));
        respool.CCNodePoolMap = CCNodePoolMap;
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
/// <reference path="./CCNodePoolMap.ts" />
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        /**
         * cocos节点池
         */
        var CCEasyNodePoolMap = /** @class */ (function (_super) {
            __extends(CCEasyNodePoolMap, _super);
            function CCEasyNodePoolMap() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.prefabUrlMap = {};
                _this.prefabMap = {};
                _this.prefabLoaderMap = {};
                return _this;
            }
            CCEasyNodePoolMap.prototype.registerPrefabUrl = function (prefabId, prefabUrl) {
                var _this = this;
                this.prefabUrlMap[prefabId] = prefabUrl;
                if (this.prefabMap[prefabId] == null) {
                    cc.resources.load(prefabId, function (err, prefab) {
                        if (err != null) {
                            return;
                        }
                        if (_this.prefabMap[prefabId] == null) {
                            _this.prefabMap[prefabId] = prefab;
                        }
                    });
                }
            };
            CCEasyNodePoolMap.prototype.registerPrefab = function (prefabId, prefab) {
                this.prefabMap[prefabId] = prefab;
            };
            CCEasyNodePoolMap.prototype.registerPrefabLoader = function (prefabId, prefabLoadListener) {
                this.prefabLoaderMap[prefabId] = prefabLoadListener;
            };
            CCEasyNodePoolMap.prototype.loadPrefabRaw = function (prefabUrl, call) {
                cc.resources.load(prefabUrl, function (err, prefab) {
                    call(prefab, err);
                });
            };
            CCEasyNodePoolMap.prototype.loadPrefab = function (prefabId, call) {
                var prefab = this.prefabMap[prefabId];
                if (prefab != null) {
                    call(prefab, null);
                    return;
                }
                var prefabLoader = this.prefabLoaderMap[prefabId];
                if (prefabLoader != null) {
                    prefabLoader.onLoad(function (prefab) {
                        call(prefab, null);
                    });
                    return;
                }
                var prefabUrl = this.prefabUrlMap[prefabId];
                if (prefabUrl != null) {
                    this.loadPrefabRaw(prefabUrl, call);
                    return;
                }
                call(null, new Error("invalid prefabId"));
            };
            CCEasyNodePoolMap.prototype.getNode = function (prefabId) {
                var prefab = this.prefabMap[prefabId];
                var node = this.getOrCreateNodeWithPrefab(prefabId, prefab);
                return node;
            };
            CCEasyNodePoolMap.prototype.loadNode = function (prefabId, call) {
                var prefab = this.prefabMap[prefabId];
                if (prefab != null) {
                    var node = this.getOrCreateNodeWithPrefab(prefabId, prefab);
                    call(node);
                    return;
                }
                var prefabLoader = this.prefabLoaderMap[prefabId];
                if (prefabLoader != null) {
                    this.getOrCreateNodeDynamicly(prefabId, prefabLoader, call);
                    return;
                }
                var prefabUrl = this.prefabUrlMap[prefabId];
                if (prefabUrl != null) {
                    this.getOrCreateNodeWithPrefabUrl(prefabId, prefabUrl, call);
                    return;
                }
                call(null, new Error("no res found"));
            };
            CCEasyNodePoolMap.prototype.putNode = function (node, remove) {
                if (remove === void 0) { remove = false; }
                var prefabId = node[respool.CCNodeSaveKey];
                if (remove) {
                    this.putNodeToRemove(prefabId, node);
                }
                else {
                    this.putNodeToCull(prefabId, node);
                }
            };
            return CCEasyNodePoolMap;
        }(respool.CCNodePoolMap));
        respool.CCEasyNodePoolMap = CCEasyNodePoolMap;
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
/// <reference path="./ResPoolMap.ts" />
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        var CCMYURL = "myurl";
        respool.CCNodeSaveKey = "mynodename";
        /**
         * cocos节点预加载工具
         */
        var CCNodePreloader = /** @class */ (function (_super) {
            __extends(CCNodePreloader, _super);
            function CCNodePreloader() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CCNodePreloader.prototype.init = function () {
                this._preloadTaskMap = fsync.EmptyTable();
                return this;
            };
            CCNodePreloader.getNodeKey = function (node) {
                return node[respool.CCNodeSaveKey];
            };
            CCNodePreloader.isRecyclableNode = function (node) {
                return !!node[respool.CCNodeSaveKey];
            };
            CCNodePreloader.prototype.addPrefabLoadTask = function (url, count) {
                if (count === void 0) { count = 0; }
                this._preloadTaskMap[url] = this._preloadTaskMap[url] || 0;
                this._preloadTaskMap[url] += count;
                return this;
            };
            CCNodePreloader.prototype.addPreShowTask = function (parent, duration) {
                if (duration === void 0) { duration = 0; }
                this._preShowTask = {
                    parent: parent,
                    duration: duration || (this._preShowTask && this._preShowTask.duration) || 0,
                };
                return this;
            };
            CCNodePreloader.prototype.execute = function (call, onError) {
                var _this = this;
                var onAllDone = function () {
                    call && call();
                };
                var preloadTaskMap = this._preloadTaskMap;
                var urls = Object.keys(preloadTaskMap);
                cc.resources.load(urls.concat(), cc["Prefab"], function (err, reses) {
                    if (err) {
                        onError && onError(err);
                        return;
                    }
                    var taskLength = urls.length;
                    var doneCount = 0;
                    var onOneTaskDone = function () {
                        doneCount++;
                        if (doneCount == taskLength) {
                            onAllDone();
                        }
                    };
                    urls.forEach(function (url, index) {
                        var prefab = reses[index];
                        if (prefab) {
                            if (!prefab.name) {
                                prefab.name = prefab.data.name;
                            }
                            var saveKey = prefab.name;
                            // prefab[CCMYURL] = saveKey = url
                            var ls = _this.resPoolMap[saveKey] = _this.resPoolMap[saveKey] || [];
                            var count = preloadTaskMap[url];
                            for (var i = 0; i < count; i++) {
                                ls.push(cc.instantiate(prefab));
                            }
                        }
                        if (_this._preShowTask) {
                            var parent_1 = _this._preShowTask.parent;
                            var duration = _this._preShowTask.duration;
                            _this.forEachAllRes(function (node) {
                                node.parent = parent_1;
                                node.active = false;
                            });
                            var comp = parent_1.getComponents(cc.Component)[0];
                            if (comp) {
                                comp.scheduleOnce(function () {
                                    _this.forEachAllRes(function (node) {
                                        node.active = true;
                                        node.parent = null;
                                    });
                                    onOneTaskDone();
                                }, duration);
                            }
                            else {
                                _this.forEachAllRes(function (node) {
                                    node.active = true;
                                    node.parent = null;
                                });
                                onOneTaskDone();
                            }
                        }
                        else {
                            onOneTaskDone();
                        }
                    });
                });
                return this;
            };
            CCNodePreloader.prototype.clearTasks = function () {
                this._preloadTaskMap = fsync.EmptyTable();
                return this;
            };
            CCNodePreloader.prototype.instantiate = function (prefab) {
                // let url = prefab[CCMYURL]
                if (!prefab.name) {
                    prefab.name = prefab.data.name;
                }
                var saveKey = prefab.name;
                var pool = this.resPoolMap[saveKey];
                var node;
                if (saveKey && pool && pool.length > 0) {
                    node = pool.pop();
                }
                else {
                    node = cc.instantiate(prefab);
                }
                if (!node[respool.CCNodeSaveKey]) {
                    node[respool.CCNodeSaveKey] = prefab.name;
                }
                return node;
            };
            CCNodePreloader.prototype.put = function (node) {
                if (cc.isValid(node)) {
                    node.parent = null;
                    var saveKey = node[respool.CCNodeSaveKey];
                    if (!!saveKey) {
                        var pool = this.getResPool(saveKey);
                        if (pool.indexOf(node) < 0) {
                            pool.push(node);
                        }
                    }
                    else {
                        if (cc.isValid(node)) {
                            node.destroy();
                        }
                        console.error("invalid saveKey");
                    }
                }
                else {
                    try {
                        node.parent = null;
                    }
                    catch (e) {
                        console.error("invalid node to recycle:", node);
                    }
                }
            };
            return CCNodePreloader;
        }(respool.ResPoolMap));
        respool.CCNodePreloader = CCNodePreloader;
        respool.ccNodePreloader = new CCNodePreloader().init();
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var respool;
    (function (respool) {
        var MyNodePool = /** @class */ (function () {
            function MyNodePool() {
            }
            MyNodePool.registerPrefabUrl = function (prefabId, prefabUrl) {
                this.nodePoolMap.registerPrefabUrl(prefabId, prefabUrl);
            };
            MyNodePool.put = function (node) {
                this.nodePoolMap.putNode(node);
            };
            MyNodePool.get = function (prefabId) {
                return this.nodePoolMap.getNode(prefabId);
            };
            MyNodePool.load = function (prefabId, call) {
                var _this = this;
                this.nodePoolMap.loadNode(prefabId, function (node, err) {
                    if (node != null) {
                        call(node, err);
                        return;
                    }
                    _this.nodePoolMap.getOrCreateNodeWithPrefabUrl(prefabId, prefabId, function (node, err) {
                        if (node != null) {
                            _this.nodePoolMap.registerPrefabUrl(prefabId, prefabId);
                        }
                        call(node, err);
                    });
                });
            };
            MyNodePool.loadPrefab = function (prefabId, call) {
                var _this = this;
                this.nodePoolMap.loadPrefab(prefabId, function (prefab, err) {
                    if (prefab != null) {
                        call(prefab, err);
                        return;
                    }
                    _this.nodePoolMap.loadPrefab(prefabId, call);
                });
            };
            MyNodePool.nodePoolMap = new gcc.respool.CCEasyNodePoolMap();
            return MyNodePool;
        }());
        respool.MyNodePool = MyNodePool;
    })(respool = gcc.respool || (gcc.respool = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var transform;
    (function (transform) {
        var math = fsync.math;
        var Vec3 = cc.Vec3;
        var Vec4 = cc.Vec4;
        var Quat = cc.Quat;
        /**
         * 需要改进，所有对cocos的依赖提前计算分离
         */
        var TransformTool = /** @class */ (function () {
            function TransformTool() {
            }
            TransformTool.prototype.init = function () {
                return this;
            };
            TransformTool.prototype.convVectorToPos3 = function (pt) {
                var pos = new Vec3();
                pos.x = pt.x;
                pos.y = pt.y;
                pos.z = pt.z;
                return pos;
            };
            TransformTool.prototype.convPos3ToVector = function (pt, pout) {
                if (pout == null) {
                    pout = new fsync.Vector3();
                }
                pout.x = pt.x;
                pout.y = pt.y;
                pout.z = pt.z;
                return pout;
            };
            TransformTool.prototype.convPos4ToVector = function (pt) {
                var pos = new fsync.Vector4();
                pos.x = pt.x;
                pos.y = pt.y;
                pos.z = pt.z;
                pos.w = pt.w;
                return pos;
            };
            TransformTool.prototype.convQuatToVector = function (pt) {
                var pos = new fsync.Vector4();
                pos.x = pt.x;
                pos.y = pt.y;
                pos.z = pt.z;
                pos.w = pt.w;
                return pos;
            };
            // 缓动跟随旋转
            TransformTool.prototype.swiftlyFollowRotateStep = function (entityManager, entity, targetRotation, swiftParams, dt) {
                var rotate = entityManager.getComponent(entity, fsync.Rotation);
                if (false) {
                    // fsync.Vector.merge(rotate.value, heroRotate)
                }
                else {
                    var cameraRotate = rotate.value.clone();
                    var heroRotateEuler = new fsync.Vector3();
                    fsync.Vector.transQuaternionToEuler(heroRotateEuler, targetRotation);
                    var cameraRotateEuler = new fsync.Vector3();
                    fsync.Vector.transQuaternionToEuler(cameraRotateEuler, cameraRotate);
                    var dthEuler = heroRotateEuler.clone();
                    fsync.Vector.subDown(dthEuler, cameraRotateEuler);
                    // let dthEulerStep = new fsync.Vector3()
                    var newCameraRotate = cameraRotateEuler.clone();
                    for (var i = 0; i < dthEuler.getBinData().length; i++) {
                        var dthEulerN = dthEuler.getBinData()[i];
                        dthEulerN = math.calcMinAngle(dthEulerN);
                        var dthEulerStepN = math.bezier2(swiftParams.C1, swiftParams.C2, swiftParams.C3, Math.abs(dthEulerN) / 180);
                        dthEulerStepN = dthEulerStepN * swiftParams.speed * dt / 1000;
                        dthEulerStepN = Math.abs(math.minByAbs(dthEulerStepN, dthEulerN)) * math.getSign(dthEulerN);
                        var newCameraRotateN = newCameraRotate.getBinData()[i];
                        newCameraRotateN += dthEulerStepN;
                        newCameraRotateN = math.calcMinAngle(newCameraRotateN);
                        newCameraRotate.getBinData()[i] = newCameraRotateN;
                    }
                    fsync.Vector.transEulerToQuaternion(rotate.value, newCameraRotate);
                }
            };
            TransformTool.prototype.convertToWorldSpaceAR = function (node, pos) {
                var worldPos;
                if (node["convertToWorldSpaceAR"]) {
                    worldPos = node["convertToWorldSpaceAR"](pos);
                }
                else {
                    var p = pos;
                    if (pos instanceof cc.Vec2) {
                        p = new cc.Vec3(pos.x, pos.y, 0);
                    }
                    worldPos = node.getComponent(cc.UITransform).convertToWorldSpaceAR(p);
                }
                return worldPos;
            };
            TransformTool.prototype.getUITransform = function (node) {
                if (node["convertToWorldSpaceAR"]) {
                    return node;
                }
                else {
                    return node.getComponent(cc.UITransformComponent);
                }
            };
            TransformTool.prototype.setScale = function (node, scale) {
                if (typeof (node.scale) == "number") {
                    node.scale = scale;
                    //@ts-expect-error
                }
                else if (node.scale instanceof cc.Vec3) {
                    //@ts-expect-error
                    node.scale = new cc.Vec3(scale, scale, scale);
                }
            };
            TransformTool.prototype.getWinSize = function () {
                return cc["winSize"];
            };
            return TransformTool;
        }());
        transform.TransformTool = TransformTool;
        transform.transformTool = new TransformTool().init();
    })(transform = gcc.transform || (gcc.transform = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var uit;
    (function (uit) {
        var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
        var transformTool = gcc.transform.transformTool;
        // @ccclass("CCGamepad")
        var CCGameStick = /** @class */ (function () {
            function CCGameStick() {
                this.stick = null;
            }
            Object.defineProperty(CCGameStick.prototype, "viewNode", {
                /**
                 * 整体节点
                 */
                get: function () {
                    return this.data.viewNode;
                },
                set: function (value) {
                    this.data.viewNode = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGameStick.prototype, "stickRange", {
                /**
                 * 触摸区域
                 */
                get: function () {
                    return this.data.stickRange;
                },
                set: function (value) {
                    this.data.stickRange = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGameStick.prototype, "stickCenter", {
                /**
                 * 摇杆中心视图
                 */
                get: function () {
                    return this.data.stickCenter;
                },
                set: function (value) {
                    this.data.stickCenter = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGameStick.prototype, "stickTouchPoint", {
                /**
                 * 摇杆触摸点视图
                 */
                get: function () {
                    return this.data.stickTouchPoint;
                },
                set: function (value) {
                    this.data.stickTouchPoint = value;
                },
                enumerable: false,
                configurable: true
            });
            CCGameStick.prototype.loadFromJson = function (data) {
                this.data = data;
            };
            CCGameStick.prototype.syncViewData = function (stick) {
                this.stick = stick;
                var stickView = this;
                // 设置触摸范围
                {
                    var stickRangeTransform = transformTool.getUITransform(stickView.stickRange);
                    var worldPos = stickRangeTransform.convertToWorldSpaceAR(new cc.Vec3());
                    var vec = transformTool.convPos3ToVector(worldPos);
                    var rect = new fsync.BLRect();
                    rect.width = stickRangeTransform.width;
                    rect.height = stickRangeTransform.height;
                    rect.x = vec.x - rect.width / 2;
                    rect.y = vec.y - rect.height / 2;
                    stick.setTouchRange(rect);
                }
                // 设置触摸中心点
                {
                    var stickCenterTransform = transformTool.getUITransform(stickView.stickCenter);
                    var vec = transformTool.convPos3ToVector(stickCenterTransform.convertToWorldSpaceAR(new cc.Vec3()));
                    stick.setStartPosOrigin(vec);
                    var r = (stickCenterTransform.width + stickCenterTransform.height) / 2;
                    stick.setCircleRadius(r / 2);
                    stick.resetTouchPoint();
                }
            };
            CCGameStick.prototype.updateMainView = function () {
                var stick = this.stick;
                var stickView = this;
                if (stickView.stickCenter) {
                    // 更新摇杆中心点视图位置
                    var ctrlCenter = stick.getCtrlCenterPos();
                    var pos = transformTool.getUITransform(stickView.stickCenter.parent).convertToNodeSpaceAR(gcc.transform.transformTool.convVectorToPos3(ctrlCenter));
                    stickView.stickCenter.position = pos;
                }
                if (stickView.stickTouchPoint) {
                    // 更新摇杆触摸点视图位置
                    var ctrlCenter = stick.getCtrlCenterPos();
                    var touchPoint = stick.ctrlStatus.touchPoint;
                    var offset = fsync.Vector.subDown(touchPoint.clone(), ctrlCenter);
                    if (fsync.Vector.len(offset) > stick.getCircleRadius()) {
                        fsync.Vector.multUpVar(fsync.Vector.normalizeSelf(offset), stick.getCircleRadius());
                        var pos = fsync.Vector.addUp(offset, ctrlCenter);
                        var ccpos = transformTool.getUITransform(stickView.stickTouchPoint.parent).convertToNodeSpaceAR(gcc.transform.transformTool.convVectorToPos3(pos));
                        stickView.stickTouchPoint.position = ccpos;
                    }
                    else {
                        var ccpos = transformTool.getUITransform(stickView.stickTouchPoint.parent).convertToNodeSpaceAR(gcc.transform.transformTool.convVectorToPos3(touchPoint));
                        stickView.stickTouchPoint.position = ccpos;
                    }
                }
            };
            CCGameStick.prototype.updateDetailView = function () {
                var stick = this.stick;
                var stickView = this;
                // 其他更新
                if (stickView.stickTouchPoint) {
                    if (stick.ctrlStatus.pressed) {
                        transformTool.setScale(stickView.stickTouchPoint, 1.22);
                    }
                    else {
                        transformTool.setScale(stickView.stickTouchPoint, 1);
                    }
                }
            };
            CCGameStick.prototype.updateView = function () {
                var stick = this.stick;
                if (stick == null) {
                    return;
                }
                this.updateMainView();
                this.updateDetailView();
            };
            __decorate([
                property({ type: cc.Node, displayName: "整体节点" })
            ], CCGameStick.prototype, "viewNode", null);
            __decorate([
                property({ type: cc.Node, displayName: "触控范围", })
            ], CCGameStick.prototype, "stickRange", null);
            __decorate([
                property({ type: cc.Node, displayName: "滑动区域", tooltip: "控制摇杆触点的滑动区域", })
            ], CCGameStick.prototype, "stickCenter", null);
            __decorate([
                property({ type: cc.Node, displayName: "触点" })
            ], CCGameStick.prototype, "stickTouchPoint", null);
            return CCGameStick;
        }());
        uit.CCGameStick = CCGameStick;
    })(uit = gcc.uit || (gcc.uit = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var uit;
    (function (uit) {
        var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
        var Vector = fsync.Vector;
        // @ccclass("CCGamepad")
        var CCGamepad = /** @class */ (function () {
            function CCGamepad() {
            }
            Object.defineProperty(CCGamepad.prototype, "leftStick", {
                get: function () {
                    return this.data.leftStick;
                },
                set: function (value) {
                    this.data.leftStick = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGamepad.prototype, "rightStick", {
                get: function () {
                    return this.data.rightStick;
                },
                set: function (value) {
                    this.data.rightStick = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGamepad.prototype, "skillSticks", {
                get: function () {
                    return this.data.skillSticks;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CCGamepad.prototype, "toDrawDebugView", {
                get: function () {
                    return this.data.toDrawDebugView;
                },
                set: function (value) {
                    this.data.toDrawDebugView = value;
                },
                enumerable: false,
                configurable: true
            });
            CCGamepad.prototype.loadFromJson = function (data) {
                this.data = data;
            };
            CCGamepad.prototype.onLoad = function () {
                this.gamepad = new kitten.gamepad.NormalGamepad().init();
                if (this.leftStick) {
                    this.leftStick.syncViewData(this.gamepad.leftStick);
                }
                if (this.rightStick) {
                    this.rightStick.syncViewData(this.gamepad.rightStick);
                }
                for (var _i = 0, _a = this.skillSticks; _i < _a.length; _i++) {
                    var stickView = _a[_i];
                    var stick = new kitten.gamepad.GameStick().init("skill_" + stickView.stickRange.parent.getSiblingIndex(), this.gamepad.sharedState);
                    this.gamepad.virutalCtrls.push(stick);
                    stickView.syncViewData(stick);
                }
                if (this.toDrawDebugView) {
                    this.gamepad.setupSimpleView();
                }
                this.updateView();
            };
            CCGamepad.prototype.start = function () {
            };
            CCGamepad.prototype.getSkillStickViews = function () {
                var skillStickViews = [];
                if (this.leftStick) {
                    skillStickViews.push(this.leftStick);
                }
                if (this.rightStick) {
                    skillStickViews.push(this.rightStick);
                }
                skillStickViews.push.apply(skillStickViews, this.skillSticks);
                return skillStickViews;
            };
            CCGamepad.prototype.updateViewVisible = function () {
                var skillStickViews = this.getSkillStickViews();
                var sticks = this.gamepad.virutalCtrls;
                skillStickViews.forEach(function (view, index) {
                    var stick = sticks[index];
                    view.viewNode.active = stick.enable;
                });
            };
            CCGamepad.prototype.updateView = function () {
                this.updateViewVisible();
                var skillStickViews = this.getSkillStickViews();
                var sticks = this.gamepad.virutalCtrls;
                skillStickViews.forEach(function (stickView, index) {
                    var stick = sticks[index];
                    stickView.stick = stick;
                    stickView.updateView();
                });
            };
            CCGamepad.prototype.update = function () {
                this.updateView();
            };
            CCGamepad.prototype.setSkillEnabled = function (index, b) {
                this.gamepad.virutalCtrls[index].enable = b;
            };
            __decorate([
                property({ type: uit.CCGameStick, displayName: "左侧摇杆", })
            ], CCGamepad.prototype, "leftStick", null);
            __decorate([
                property({ type: uit.CCGameStick, displayName: "右侧摇杆", })
            ], CCGamepad.prototype, "rightStick", null);
            __decorate([
                property({ type: [uit.CCGameStick], displayName: "其他摇杆列表", })
            ], CCGamepad.prototype, "skillSticks", null);
            __decorate([
                property({ type: Boolean, displayName: "是否显示调试视图", })
            ], CCGamepad.prototype, "toDrawDebugView", null);
            return CCGamepad;
        }());
        uit.CCGamepad = CCGamepad;
    })(uit = gcc.uit || (gcc.uit = {}));
})(gcc || (gcc = {}));
var gcc;
(function (gcc) {
    var uit;
    (function (uit) {
        var transformTool = gcc.transform.transformTool;
        /**
         * 鼠标滚轮数据
         */
        var ScrollData = /** @class */ (function () {
            function ScrollData() {
                this.curScroll = new fsync.Vector3();
                this.deltaScroll = new fsync.Vector3();
            }
            ScrollData.prototype.update = function () {
                fsync.Vector.addUp(this.curScroll, this.deltaScroll);
                fsync.Vector.resetValues(this.deltaScroll);
            };
            return ScrollData;
        }());
        uit.ScrollData = ScrollData;
        /**
         * cocos触摸事件板
         */
        var CocosTouchPad = /** @class */ (function () {
            function CocosTouchPad() {
                this.listenInfo = [];
            }
            CocosTouchPad.prototype.init = function () {
                this.guesture = new kitten.guesture.GuestureAnalyzer().init();
                this.scrollData = new ScrollData();
                this.listenEvents = fsync.EmptyTable();
                this.initEvents();
                return this;
            };
            CocosTouchPad.prototype.initEvents = function () {
                var _this = this;
                var touchedPointMap = {};
                this.listenEvents[cc.Node.EventType.TOUCH_START] = function (event) {
                    // console.log("touchstart", event)
                    var touches = event.getTouches();
                    var vecs = [];
                    touches.forEach(function (touch) {
                        var vec = _this.getTouchEventPos(touch);
                        vecs[touch.getID()] = vec;
                        touchedPointMap[touch.getID()] = true;
                    });
                    _this.testGuesture2(vecs);
                    _this.guesture.inputTouchPoints(true, vecs);
                };
                var onTouchOver = function (event, key) {
                    // console.log("touchend", event)
                    var touches = event.getTouches();
                    var vecs = [];
                    touches.forEach(function (touch) {
                        var vec = _this.getTouchEventPos(touch);
                        vecs[touch.getID()] = vec;
                        touchedPointMap[touch.getID()] = false;
                    });
                    _this.testGuesture2(vecs);
                    _this.guesture.inputTouchPoints(false, vecs);
                };
                var onTouchEnd = function (event) {
                    onTouchOver(event, "TOUCH_END");
                };
                var onTouchCancel = function (event) {
                    onTouchOver(event, "TOUCH_CANCEL");
                };
                this.listenEvents[cc.Node.EventType.TOUCH_CANCEL] = onTouchCancel;
                this.listenEvents[cc.Node.EventType.TOUCH_END] = onTouchEnd;
                this.listenEvents[cc.Node.EventType.TOUCH_MOVE] = function (event) {
                    // console.log("touchmove", event)
                    var touches = event.getTouches();
                    var vecs = [];
                    touches.forEach(function (touch) {
                        // 屏蔽掉没有经由touchstart发起的触摸点，避免缩放bug
                        if (touchedPointMap[touch.getID()]) {
                            var vec = _this.getTouchEventPos(touch);
                            vecs[touch.getID()] = vec;
                        }
                    });
                    _this.testGuesture2(vecs);
                    _this.guesture.inputTouchPoints(true, vecs);
                };
                this.listenEvents[cc.Node.EventType.MOUSE_WHEEL] = function (event) {
                    console.log("mouse wheel", event);
                    _this.scrollData.deltaScroll.x += event.getScrollX();
                    _this.scrollData.deltaScroll.y += event.getScrollY();
                };
            };
            /**
             * 获取触摸事件坐标
             * @param touch
             */
            CocosTouchPad.prototype.getTouchEventPos = function (touch) {
                var designSize = transformTool.getWinSize();
                var pt = touch.getLocation();
                var vec = new fsync.Vector3();
                // 转化屏幕中心点为坐标原点
                vec.x = pt.x - designSize.width / 2;
                vec.y = pt.y - designSize.height / 2;
                return vec;
            };
            // 仅测试
            CocosTouchPad.prototype.testGuesture2 = function (vecs) {
                // vecs.push(new fsync.Vector3())
            };
            /**
             * 接触侦听触摸事件
             */
            CocosTouchPad.prototype.unregisterTouchPad = function () {
                var _this = this;
                this.listenInfo.forEach(function (info) {
                    var node = info.node, useCapture = info.useCapture;
                    for (var key in _this.listenEvents) {
                        node.off(key, _this.listenEvents[key], useCapture);
                    }
                });
                this.listenInfo.length = 0;
            };
            /**
             * 注册触摸板事件
             * @param touchPad
             * @param useCapture 将触摸或鼠标事件注册在捕获阶段
             */
            CocosTouchPad.prototype.registerTouchPad = function (touchPad, useCapture) {
                // const touchedPointMap: { [key: string]: boolean } = {}
                if (useCapture === void 0) { useCapture = false; }
                // touchPad.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                // 	// console.log("touchstart", event)
                // 	let touches = event.getTouches()
                // 	let vecs: fsync.Vector3[] = []
                // 	touches.forEach((touch) => {
                // 		let vec = this.getTouchEventPos(touch)
                // 		vecs[touch.getID()] = vec
                // 		touchedPointMap[touch.getID()] = true
                // 	})
                // 	this.testGuesture2(vecs)
                // 	this.guesture.inputTouchPoints(true, vecs)
                // }, this, useCapture)
                // const onTouchOver = (event: cc.Event.EventTouch, key: string) => {
                // 	// console.log("touchend", event)
                // 	let touches = event.getTouches()
                // 	let vecs: fsync.Vector3[] = []
                // 	touches.forEach((touch) => {
                // 		let vec = this.getTouchEventPos(touch)
                // 		vecs[touch.getID()] = vec
                // 		touchedPointMap[touch.getID()] = false
                // 	})
                // 	this.testGuesture2(vecs)
                // 	this.guesture.inputTouchPoints(false, vecs)
                // }
                // const onTouchEnd = (event: cc.Event.EventTouch) => {
                // 	onTouchOver(event, "TOUCH_END")
                // }
                // const onTouchCancel = (event: cc.Event.EventTouch) => {
                // 	onTouchOver(event, "TOUCH_CANCEL")
                // }
                // touchPad.on(cc.Node.EventType.TOUCH_CANCEL, onTouchCancel, this, useCapture)
                // touchPad.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this, useCapture)
                // touchPad.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
                // 	// console.log("touchmove", event)
                // 	let touches = event.getTouches()
                // 	let vecs: fsync.Vector3[] = []
                // 	touches.forEach((touch) => {
                // 		// 屏蔽掉没有经由touchstart发起的触摸点，避免缩放bug
                // 		if (touchedPointMap[touch.getID()]) {
                // 			let vec = this.getTouchEventPos(touch)
                // 			vecs[touch.getID()] = vec
                // 		}
                // 	})
                // 	this.testGuesture2(vecs)
                // 	this.guesture.inputTouchPoints(true, vecs)
                // }, this, useCapture)
                // touchPad.on(cc.Node.EventType.MOUSE_WHEEL, (event: cc.Event.EventMouse) => {
                // 	console.log("mouse wheel", event)
                // 	this.scrollData.deltaScroll.x += event.getScrollX()
                // 	this.scrollData.deltaScroll.y += event.getScrollY()
                // })
                for (var key in this.listenEvents) {
                    touchPad.on(key, this.listenEvents[key], useCapture);
                }
                this.listenInfo.push({ node: touchPad, useCapture: useCapture });
            };
            return CocosTouchPad;
        }());
        uit.CocosTouchPad = CocosTouchPad;
    })(uit = gcc.uit || (gcc.uit = {}));
})(gcc || (gcc = {}));
//# sourceMappingURL=gcccomps.js.map