var fsync;
(function (fsync) {
    /**
     * BLRect = 左下角 + size
     */
    var BLRect = /** @class */ (function () {
        function BLRect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        BLRect.top = function (self) {
            return new fsync.Vector2(self.x + self.width / 2, self.y + self.height);
        };
        BLRect.bottom = function (self) {
            return new fsync.Vector2(self.x + self.width / 2, self.y);
        };
        BLRect.center = function (self) {
            return new fsync.Vector2(self.x + self.width / 2, self.y + self.height / 2);
        };
        BLRect.fromRectLike = function (_a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            return new BLRect(x, y, width, height);
        };
        BLRect.copyRectLike = function (self, _a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            self.x = x;
            self.y = y;
            self.width = width;
            self.height = height;
            return self;
        };
        BLRect.reset = function (self) {
            self.x = 0;
            self.y = 0;
            self.width = 0;
            self.height = 0;
            return self;
        };
        BLRect.mergeFrom = function (self, rect) {
            self.width = rect.width;
            self.height = rect.height;
            self.x = rect.x;
            self.y = rect.y;
            return self;
        };
        BLRect.clone = function (self) {
            var rect = new BLRect();
            this.mergeFrom(rect, self);
            return rect;
        };
        BLRect.containPoint = function (rect, pt) {
            var ns = pt.getBinData();
            var x = ns[0];
            var y = ns[1];
            if ((rect.x - x) * (rect.x + rect.width - x) <= 0
                && (rect.y - y) * (rect.y + rect.height - y) <= 0) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 将点就近限制在矩形框内
         * @param rect
         * @param pt
         */
        BLRect.limitPointSelf = function (rect, pt) {
            var ns = pt.getBinData();
            var x = ns[0];
            var y = ns[1];
            if (x < rect.x) {
                x = rect.x;
            }
            var rx = rect.x + rect.width;
            if (x > rx) {
                x = rx;
            }
            if (y < rect.y) {
                y = rect.y;
            }
            var ry = rect.y + rect.height;
            if (y > ry) {
                y = ry;
            }
            ns[0] = x;
            ns[1] = y;
        };
        return BLRect;
    }());
    fsync.BLRect = BLRect;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var FloatMath = /** @class */ (function () {
        function FloatMath() {
        }
        return FloatMath;
    }());
    fsync.FloatMath = FloatMath;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var FloatMatrix = /** @class */ (function () {
        function FloatMatrix() {
        }
        return FloatMatrix;
    }());
    fsync.FloatMatrix = FloatMatrix;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var math;
    (function (math) {
        function randomRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        math.randomRange = randomRange;
        function bezier3(C1, C2, C3, C4, t) {
            var t1 = 1 - t;
            return C1 * t1 * t1 * t1 +
                C2 * 3 * t1 * t1 * t +
                C3 * 3 * t1 * t * t +
                C4 * t * t * t;
        }
        math.bezier3 = bezier3;
        function bezier2(C1, C2, C3, t) {
            var t1 = 1 - t;
            return C1 * t1 * t1 +
                C2 * 2 * t1 * t +
                C3 * t * t;
        }
        math.bezier2 = bezier2;
        function bezier2Vec3(out, vin, C1, C2, C3) {
            out.x = bezier2(C1, C2, C3, vin.x);
            out.y = bezier2(C1, C2, C3, vin.y);
            out.z = bezier2(C1, C2, C3, vin.z);
        }
        math.bezier2Vec3 = bezier2Vec3;
        function minByAbs(v1, v2) {
            var v1abs = Math.abs(v1);
            var v2abs = Math.abs(v2);
            if (v1abs > v2abs) {
                return v2;
            }
            else {
                return v1;
            }
        }
        math.minByAbs = minByAbs;
        /**
         * 转换为脉冲信号
         * @param th
         */
        math.getSign = function (th) {
            if (th == 0) {
                return 1;
            }
            else {
                return th / Math.abs(th);
            }
        };
        /**
         * 计算最小等价角度
         * @param angle
         */
        math.calcMinAngle = function (angle) {
            angle = angle % 360;
            if (angle > 180) {
                return angle - 360;
            }
            else if (angle < -180) {
                return angle + 360;
            }
            else {
                return angle;
            }
        };
    })(math = fsync.math || (fsync.math = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    /**
     * Rect = center + size
     */
    var Rect = /** @class */ (function () {
        function Rect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rect.top = function (self) {
            return new fsync.Vector2(self.x, self.y + self.height / 2);
        };
        Rect.bottom = function (self) {
            return new fsync.Vector2(self.x, self.y - self.height / 2);
        };
        Rect.center = function (self) {
            return new fsync.Vector2(self.x, self.y);
        };
        Rect.fromRectLike = function (_a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            return new Rect(x, y, width, height);
        };
        Rect.copyRectLike = function (self, _a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            self.x = x;
            self.y = y;
            self.width = width;
            self.height = height;
            return self;
        };
        Rect.reset = function (self) {
            self.x = 0;
            self.y = 0;
            self.width = 0;
            self.height = 0;
            return self;
        };
        Rect.mergeFrom = function (self, rect) {
            self.width = rect.width;
            self.height = rect.height;
            self.x = rect.x;
            self.y = rect.y;
            return self;
        };
        Rect.clone = function (self) {
            var rect = new Rect();
            this.mergeFrom(rect, self);
            return rect;
        };
        Rect.containPoint = function (rect, pt) {
            var ns = pt.getBinData();
            var x = ns[0];
            var y = ns[1];
            if ((rect.x - rect.width / 2 - x) * (rect.x + rect.width / 2 - x) <= 0
                && (rect.y - rect.height / 2 - y) * (rect.y + rect.height / 2 - y) <= 0) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 将点就近限制在矩形框内
         * @param rect
         * @param pt
         */
        Rect.limitPointSelf = function (rect, pt) {
            var ns = pt.getBinData();
            var x = ns[0];
            var y = ns[1];
            var lx = rect.x - rect.width / 2;
            if (x < lx) {
                x = lx;
            }
            var rx = rect.x + rect.width / 2;
            if (x > rx) {
                x = rx;
            }
            var ly = rect.y - rect.height / 2;
            if (y < ly) {
                y = ly;
            }
            var ry = rect.y + rect.height / 2;
            if (y > ry) {
                y = ry;
            }
            ns[0] = x;
            ns[1] = y;
        };
        return Rect;
    }());
    fsync.Rect = Rect;
})(fsync || (fsync = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fsync;
(function (fsync) {
    var halfToRad = 0.5 * Math.PI / 180.0;
    var _d2r = Math.PI / 180.0;
    var _r2d = 180.0 / Math.PI;
    function toDegree(a) {
        return a * _r2d;
    }
    fsync.toDegree = toDegree;
    var NumberArray = /** @class */ (function () {
        function NumberArray() {
        }
        NumberArray.lenSQ = function (ns) {
            var lsq = 0;
            for (var i = 0; i < ns.length; i++) {
                lsq += ns[i] * ns[i];
            }
            return lsq;
        };
        NumberArray.len = function (ns) {
            var lsq = 0;
            for (var i = 0; i < ns.length; i++) {
                lsq += ns[i] * ns[i];
            }
            return Math.sqrt(lsq);
        };
        /**
         * 覆盖
         * @param out
         * @param ns2
         */
        NumberArray.merge = function (out, ns2) {
            for (var i = 0; i < ns2.length; i++) {
                out[i] = ns2[i];
            }
            return out;
        };
        /**
         * 最小合并
         * @param ns1
         * @param ns2
         */
        NumberArray.collect = function (ns1, ns2) {
            var count = Math.min(ns1.length, ns2.length);
            for (var i = 0; i < count; i++) {
                ns1[i] = ns2[i];
            }
            return ns1;
        };
        NumberArray.normalizeSelf = function (n1) {
            var lsq = 0;
            for (var i = 0; i < n1.length; i++) {
                lsq += n1[i] * n1[i];
            }
            if (lsq == 0) {
                for (var i = 0; i < n1.length; i++) {
                    n1[i] = 0;
                }
            }
            else {
                var l = Math.sqrt(lsq);
                for (var i = 0; i < n1.length; i++) {
                    n1[i] /= l;
                }
            }
            return n1;
        };
        NumberArray.transEulerToQuaternion = function (ns4, ns3) {
            var x = ns3[0];
            var y = ns3[1];
            var z = ns3[2];
            x *= halfToRad;
            y *= halfToRad;
            z *= halfToRad;
            var sx = Math.sin(x);
            var cx = Math.cos(x);
            var sy = Math.sin(y);
            var cy = Math.cos(y);
            var sz = Math.sin(z);
            var cz = Math.cos(z);
            ns4[0] = sx * cy * cz + cx * sy * sz;
            ns4[1] = cx * sy * cz + sx * cy * sz;
            ns4[2] = cx * cy * sz - sx * sy * cz;
            ns4[3] = cx * cy * cz - sx * sy * sz;
            return ns4;
        };
        NumberArray.transQuaternionToEuler = function (ns3, ns4, outerZ) {
            var x = ns4[0];
            var y = ns4[1];
            var z = ns4[2];
            var w = ns4[3];
            var bank = 0;
            var heading = 0;
            var attitude = 0;
            var test = x * y + z * w;
            if (test > 0.499999) {
                bank = 0; // default to zero
                heading = toDegree(2 * Math.atan2(x, w));
                attitude = 90;
            }
            else if (test < -0.499999) {
                bank = 0; // default to zero
                heading = -toDegree(2 * Math.atan2(x, w));
                attitude = -90;
            }
            else {
                var sqx = x * x;
                var sqy = y * y;
                var sqz = z * z;
                bank = toDegree(Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz));
                heading = toDegree(Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz));
                attitude = toDegree(Math.asin(2 * test));
                if (outerZ) {
                    bank = -180 * Math.sign(bank + 1e-6) + bank;
                    heading = -180 * Math.sign(heading + 1e-6) + heading;
                    attitude = 180 * Math.sign(attitude + 1e-6) - attitude;
                }
            }
            // x
            ns3[0] = bank;
            // y
            ns3[1] = heading;
            // z
            ns3[2] = attitude;
            return ns3;
        };
        /**
         * @zh 四元数乘法
         */
        NumberArray.multiplyQuaternion = function (out, a, b) {
            var x = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1];
            var y = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2];
            var z = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0];
            var w = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;
            return out;
        };
        return NumberArray;
    }());
    fsync.NumberArray = NumberArray;
    var CommonVector = /** @class */ (function () {
        function CommonVector() {
        }
        CommonVector.prototype.distanceSQ = function (vec2) {
            return Vector.distanceSQ(this, vec2);
        };
        CommonVector.prototype.distance = function (vec2) {
            return Vector.distance(this, vec2);
        };
        CommonVector.prototype.equal = function (vec2) {
            return Vector.equal(this, vec2);
        };
        CommonVector.prototype.subDown = function (vec2) {
            return Vector.subDown(this, vec2);
        };
        CommonVector.prototype.addUp = function (vec2) {
            return Vector.addUp(this, vec2);
        };
        CommonVector.prototype.multUp = function (vec2) {
            return Vector.multUp(this, vec2);
        };
        CommonVector.prototype.multUpVar = function (v) {
            return Vector.multUpVar(this, v);
        };
        CommonVector.prototype.multVar = function (v) {
            return Vector.multVar(this, v);
        };
        CommonVector.prototype.normalizeSelf = function () {
            return Vector.normalizeSelf(this);
        };
        CommonVector.prototype.len = function () {
            return Vector.len(this);
        };
        /**
         * 覆盖
         * @param out
         * @param vec2
         */
        CommonVector.prototype.merge = function (vec2) {
            return Vector.merge(this, vec2);
        };
        /**
         * 最小合并
         * @param vec1
         * @param vec2
         */
        CommonVector.prototype.collect = function (vec2) {
            return Vector.collect(this, vec2);
        };
        /**
         * @default value = 0
         */
        CommonVector.prototype.resetValues = function (value) {
            if (value === void 0) { value = 0; }
            return Vector.resetValues(this, value);
        };
        /**
         * 根据x，y决定的方向转换为角度 [-PI~PI]
         * @param b
         */
        CommonVector.prototype.getRotationZ2 = function () {
            var data = this.getBinData();
            var th = Math.atan2(data[1], data[0]);
            return th;
        };
        /**
         * 根据x，y决定的方向转换为角度 [-PI~PI]
         * @param b
         */
        CommonVector.prototype.getRotation2 = function () {
            var data = this.getBinData();
            var th = Math.atan2(data[1], data[0]);
            return fsync.Vector3.fromNumArray([0, 0, th]);
        };
        /**
         * 绕原点按笛卡尔坐标系弧度旋转
         * @param out
         */
        CommonVector.prototype.rotateSelfByZero2 = function (angle) {
            var od = this.getBinData();
            var cosInc = Math.cos(angle);
            var sinInc = Math.sin(angle);
            var x = cosInc * od[0] - sinInc * od[1];
            var y = sinInc * od[0] + cosInc * od[1];
            od[0] = x;
            od[1] = y;
            return this;
        };
        CommonVector.prototype.asVectorN = function () {
            return this;
        };
        CommonVector.prototype.asVector2 = function () {
            return this;
        };
        CommonVector.prototype.asVector3 = function () {
            return this;
        };
        CommonVector.prototype.asVector4 = function () {
            return this;
        };
        return CommonVector;
    }());
    fsync.CommonVector = CommonVector;
    var Vector2 = /** @class */ (function (_super) {
        __extends(Vector2, _super);
        /**
         * Vector2.constructor
         * @param x 默认等于 0
         * @param y 默认等于 0
         */
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this.data = [0, 0];
            _this.x = x;
            _this.y = y;
            return _this;
        }
        Vector2.fromNumArray = function (ns) {
            var vec = new Vector2();
            vec.data[0] = ns[0] || 0;
            vec.data[1] = ns[1] || 0;
            return vec;
        };
        Vector2.prototype.clone = function () {
            return Vector2.fromNumArray(this.getBinData());
        };
        Object.defineProperty(Vector2.prototype, "size", {
            /**
             * vector的尺寸, vector2 为 2
             */
            get: function () {
                return 2;
            },
            enumerable: false,
            configurable: true
        });
        Vector2.prototype.getBinData = function () {
            return this.data;
        };
        Vector2.prototype.setBinData = function (data) {
            this.data = data;
        };
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: false,
            configurable: true
        });
        Vector2.prototype.copy = function (vec) {
            return Vector.merge(this, vec);
        };
        Vector2.prototype.copyXYLike = function (_a) {
            var x = _a.x, y = _a.y;
            if (typeof (x) == "number") {
                this.x = x;
            }
            if (typeof (y) == "number") {
                this.y = y;
            }
        };
        Vector2.fromXYZLike = function (_a) {
            var x = _a.x, y = _a.y;
            var vec = this.fromNumArray([x, y]);
            return vec;
        };
        Vector2.prototype.mergeToXYZLike = function (v) {
            var data = this.data;
            v.x = data[0];
            v.y = data[1];
            return v;
        };
        Vector2.zero = new Vector2();
        return Vector2;
    }(CommonVector));
    fsync.Vector2 = Vector2;
    var Vector3 = /** @class */ (function (_super) {
        __extends(Vector3, _super);
        /**
         * Vector3.constructor
         * @param x 默认等于 0
         * @param y 默认等于 0
         * @param z 默认等于 0
         */
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            var _this = _super.call(this) || this;
            _this.data = [0, 0, 0];
            _this.x = x;
            _this.y = y;
            _this.z = z;
            return _this;
        }
        Vector3.fromNumArray = function (ns) {
            var vec = new Vector3();
            var data = vec.data;
            data[0] = ns[0] || 0;
            data[1] = ns[1] || 0;
            data[2] = ns[2] || 0;
            return vec;
        };
        Vector3.prototype.copyNumArray = function (ns) {
            var data = this.data;
            data[0] = ns[0] || 0;
            data[1] = ns[1] || 0;
            data[2] = ns[2] || 0;
            return this;
        };
        Vector3.prototype.clone = function () {
            return Vector3.fromNumArray(this.getBinData());
        };
        Object.defineProperty(Vector3.prototype, "size", {
            /**
             * vector的尺寸, vector3 为 3
             */
            get: function () {
                return 3;
            },
            enumerable: false,
            configurable: true
        });
        Vector3.prototype.getBinData = function () {
            return this.data;
        };
        Vector3.prototype.setBinData = function (data) {
            this.data = data;
        };
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: false,
            configurable: true
        });
        Vector3.prototype.copy = function (vec) {
            return Vector.merge(this, vec);
        };
        Vector3.prototype.copyXYZLike = function (_a) {
            var x = _a.x, y = _a.y, z = _a.z;
            if (typeof (x) == "number") {
                this.x = x;
            }
            if (typeof (y) == "number") {
                this.y = y;
            }
            if (typeof (z) == "number") {
                this.z = z;
            }
            return this;
        };
        Vector3.fromXYZLike = function (_a) {
            var x = _a.x, y = _a.y, z = _a.z;
            var vec = this.fromNumArray([x, y, z]);
            return vec;
        };
        Vector3.prototype.toXYZLike = function (cls) {
            var v = new cls();
            var data = this.data;
            v.x = data[0];
            v.y = data[1];
            v.z = data[2];
            return v;
        };
        Vector3.prototype.mergeToXYZLike = function (v) {
            var data = this.data;
            v.x = data[0];
            v.y = data[1];
            v.z = data[2];
            return v;
        };
        Vector3.zero = new Vector3();
        return Vector3;
    }(CommonVector));
    fsync.Vector3 = Vector3;
    var Vector4 = /** @class */ (function (_super) {
        __extends(Vector4, _super);
        /**
         * Vector4.constructor
         * @param x 默认等于 0
         * @param y 默认等于 0
         * @param z 默认等于 0
         * @param w 默认等于 0
         */
        function Vector4(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            var _this = _super.call(this) || this;
            _this.data = [0, 0, 0, 0];
            _this.x = x;
            _this.y = y;
            _this.z = z;
            _this.w = w;
            return _this;
        }
        Vector4.fromNumArray = function (ns) {
            var vec = new Vector4();
            vec.data[0] = ns[0] || 0;
            vec.data[1] = ns[1] || 0;
            vec.data[2] = ns[2] || 0;
            vec.data[3] = ns[3] || 0;
            return vec;
        };
        Vector4.prototype.clone = function () {
            return Vector4.fromNumArray(this.getBinData());
        };
        Object.defineProperty(Vector4.prototype, "size", {
            /**
             * vector的尺寸, vector4 为 4
             */
            get: function () {
                return 4;
            },
            enumerable: false,
            configurable: true
        });
        Vector4.prototype.getBinData = function () {
            return this.data;
        };
        Vector4.prototype.setBinData = function (data) {
            this.data = data;
        };
        Object.defineProperty(Vector4.prototype, "x", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "z", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "w", {
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.data[3] = value;
            },
            enumerable: false,
            configurable: true
        });
        Vector4.prototype.copy = function (vec) {
            return Vector.merge(this, vec);
        };
        return Vector4;
    }(CommonVector));
    fsync.Vector4 = Vector4;
    fsync.Quat = Vector4;
    var Vector = /** @class */ (function () {
        function Vector() {
        }
        Vector._fromNumArray3 = function (ns) {
            var vec = new Vector3();
            vec.setBinData(ns);
            return vec;
        };
        Vector._fromNumArray4 = function (ns) {
            var vec = new Vector4();
            vec.setBinData(ns);
            return vec;
        };
        Vector.distanceSQ = function (vec1, vec2) {
            var n1 = vec1.getBinData();
            var n2 = vec2.getBinData();
            var total = 0;
            for (var i = 0; i < Math.min(n1.length, n2.length); i++) {
                total += (n1[i] - n2[i]) * (n1[i] - n2[i]);
            }
            return total;
        };
        Vector.distance = function (vec1, vec2) {
            var total = this.distanceSQ(vec1, vec2);
            return Math.sqrt(total);
        };
        Vector.equal = function (vec1, vec2) {
            var n1 = vec1.getBinData();
            var n2 = vec2.getBinData();
            if (n1.length != n2.length) {
                return false;
            }
            for (var i = 0; i < n1.length; i++) {
                if (n1[i] != n2[i]) {
                    return false;
                }
            }
            return true;
        };
        Vector.subDown = function (vec1, vec2) {
            var n1 = vec1.getBinData();
            var n2 = vec2.getBinData();
            for (var i = 0; i < Math.min(n1.length, n2.length); i++) {
                n1[i] -= n2[i];
            }
            return vec1;
        };
        Vector.addUp = function (vec1, vec2) {
            var n1 = vec1.getBinData();
            var n2 = vec2.getBinData();
            for (var i = 0; i < Math.min(n1.length, n2.length); i++) {
                n1[i] += n2[i];
            }
            return vec1;
        };
        Vector.multUp = function (vec1, vec2) {
            var n1 = vec1.getBinData();
            var n2 = vec2.getBinData();
            for (var i = 0; i < Math.min(n1.length, n2.length); i++) {
                n1[i] *= n2[i];
            }
            return vec1;
        };
        Vector.multUpVar = function (vec1, v) {
            var n1 = vec1.getBinData();
            for (var i = 0; i < n1.length; i++) {
                n1[i] *= v;
            }
            return vec1;
        };
        Vector.multVar = function (vec1, v) {
            var newVec = new Vector3();
            var n1 = newVec.getBinData();
            var n2 = vec1.getBinData();
            for (var i = 0; i < n1.length; i++) {
                n1[i] = n2[i] * v;
            }
            return newVec;
        };
        Vector.normalizeSelf = function (vec) {
            var n1 = vec.getBinData();
            var lsq = 0;
            for (var i = 0; i < n1.length; i++) {
                lsq += n1[i] * n1[i];
            }
            if (lsq == 0) {
                for (var i = 0; i < n1.length; i++) {
                    n1[i] = 0;
                }
            }
            else {
                var l = Math.sqrt(lsq);
                for (var i = 0; i < n1.length; i++) {
                    n1[i] /= l;
                }
            }
            return vec;
        };
        Vector.len = function (vec) {
            var n1 = vec.getBinData();
            return NumberArray.len(n1);
        };
        /**
         * 覆盖
         * @param out
         * @param vec2
         */
        Vector.merge = function (out, vec2) {
            NumberArray.merge(out.getBinData(), vec2.getBinData());
            return out;
        };
        /**
         * 最小合并
         * @param vec1
         * @param vec2
         */
        Vector.collect = function (vec1, vec2) {
            NumberArray.collect(vec1.getBinData(), vec2.getBinData());
            return vec1;
        };
        Vector.transEulerToQuaternion = function (quat, vec3) {
            NumberArray.transEulerToQuaternion(quat.getBinData(), vec3.getBinData());
            return quat;
        };
        Vector.transQuaternionToEuler = function (vec3, quat, outerZ) {
            NumberArray.transQuaternionToEuler(vec3.getBinData(), quat.getBinData(), outerZ);
            return vec3;
        };
        Vector.multiplyQuaternion = function (out, a, b) {
            NumberArray.multiplyQuaternion(out.getBinData(), a.getBinData(), b.getBinData());
            return out;
        };
        Vector.resetValues = function (vec, value) {
            if (value === void 0) { value = 0; }
            var ns = vec.getBinData();
            for (var i = 0; i < ns.length; i++) {
                ns[i] = value;
            }
            return vec;
        };
        /**
         * 3维叉乘
         * @param out
         * @param a
         */
        Vector.crossBy3 = function (out, a) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = out.x, by = out.y, bz = out.z;
            out.x = ay * bz - az * by;
            out.y = az * bx - ax * bz;
            out.z = ax * by - ay * bx;
            return out;
        };
        Vector.dot = function (out, a) {
            var n = 0;
            var ns1 = out.getBinData();
            var ns2 = a.getBinData();
            var l = Math.min(ns1.length, ns2.length);
            for (var i = 0; i < l; i++) {
                n += (ns1[i] * ns2[i]);
            }
            return n;
        };
        /**
         * 根据x，y决定的方向转换为角度 [-PI~PI]
         * @param b
         */
        Vector.getRotationZ2 = function (b) {
            var data = b.getBinData();
            var th = Math.atan2(data[1], data[0]);
            return th;
        };
        /**
         * 根据x，y决定的方向转换为角度 [-PI~PI]
         * @param b
         */
        Vector.getRotation2 = function (b) {
            var data = b.getBinData();
            var th = Math.atan2(data[1], data[0]);
            return fsync.Vector3.fromNumArray([0, 0, th]);
        };
        /**
         * 绕原点按笛卡尔坐标系弧度旋转
         * @param out
         */
        Vector.rotateSelfByZero2 = function (out, angle) {
            var od = out.getBinData();
            var cosInc = Math.cos(angle);
            var sinInc = Math.sin(angle);
            var x = cosInc * od[0] - sinInc * od[1];
            var y = sinInc * od[0] + cosInc * od[1];
            od[0] = x;
            od[1] = y;
            return out;
        };
        Vector.asVectorN = function (b) {
            return b;
        };
        Vector.asVector2 = function (b) {
            return b;
        };
        Vector.asVector3 = function (b) {
            return b;
        };
        Vector.asVector4 = function (b) {
            return b;
        };
        return Vector;
    }());
    fsync.Vector = Vector;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Size2 = /** @class */ (function (_super) {
        __extends(Size2, _super);
        function Size2(width, height) {
            return _super.call(this, width, height) || this;
        }
        Object.defineProperty(Size2.prototype, "width", {
            get: function () {
                return this.x;
            },
            set: function (n) {
                this.x = n;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Size2.prototype, "height", {
            get: function () {
                return this.y;
            },
            set: function (n) {
                this.y = n;
            },
            enumerable: false,
            configurable: true
        });
        Size2.fromSize2Like = function (size2) {
            var vec = new Size2().copySize2ike(size2);
            return vec;
        };
        Size2.prototype.copySize2ike = function (_a) {
            var width = _a.width, height = _a.height;
            if (typeof (width) == "number") {
                this.x = width;
            }
            if (typeof (height) == "number") {
                this.y = height;
            }
            return this;
        };
        Size2.fromNumArray = function (ns) {
            var vec = new Size2();
            vec.data[0] = ns[0] || 0;
            vec.data[1] = ns[1] || 0;
            return vec;
        };
        return Size2;
    }(fsync.Vector2));
    fsync.Size2 = Size2;
    var Size3 = /** @class */ (function (_super) {
        __extends(Size3, _super);
        function Size3(width, height, depth) {
            return _super.call(this, width, height, depth) || this;
        }
        Object.defineProperty(Size3.prototype, "width", {
            get: function () {
                return this.x;
            },
            set: function (n) {
                this.x = n;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Size3.prototype, "height", {
            get: function () {
                return this.y;
            },
            set: function (n) {
                this.y = n;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Size3.prototype, "depth", {
            get: function () {
                return this.z;
            },
            set: function (n) {
                this.z = n;
            },
            enumerable: false,
            configurable: true
        });
        Size3.fromSize3Like = function (size3) {
            var vec = new Size3().copySize3ike(size3);
            return vec;
        };
        Size3.prototype.copySize3ike = function (_a) {
            var width = _a.width, height = _a.height, depth = _a.depth;
            if (typeof (width) == "number") {
                this.x = width;
            }
            if (typeof (height) == "number") {
                this.y = height;
            }
            if (typeof (depth) == "number") {
                this.z = depth;
            }
            return this;
        };
        Size3.fromNumArray = function (ns) {
            var vec = new Size3();
            vec.data[0] = ns[0] || 0;
            vec.data[1] = ns[1] || 0;
            vec.data[2] = ns[2] || 0;
            return vec;
        };
        return Size3;
    }(fsync.Vector3));
    fsync.Size3 = Size3;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            b2data.Vec2 = fsync.Vector2;
            b2data.Vec3 = fsync.Vector3;
            b2data.Vec4 = fsync.Vector4;
            b2data.Size = fsync.Size2;
            var ComponentBase = /** @class */ (function () {
                function ComponentBase() {
                    /**
                     * 缩放倍率
                     */
                    this.PTM_RATIO = 1;
                }
                ComponentBase.prototype.loadFromJson = function (child) {
                    this.oid = child.oid;
                    this.ctype = child.ctype;
                };
                ComponentBase.prototype.getPTMRatio = function () {
                    if (this.parent && this.parent['getPTMRatio']) {
                        return this.PTM_RATIO * this.parent['getPTMRatio']();
                    }
                    return this.PTM_RATIO;
                };
                ComponentBase.prototype.updatePTMRatio = function () {
                };
                ComponentBase.prototype.getInUnionRotationZ = function () {
                    var body = this.parent;
                    var node = body.parent;
                    var rotationZ = body.transform.rotation + node.transform.rotation;
                    return rotationZ;
                };
                ComponentBase.prototype.getWorldFlipY = function () {
                    var p1 = this.parent;
                    var p2 = p1.parent;
                    var p3 = p2.parent;
                    var flipY = p1.transform.flip * p2.transform.flip * p3.transform.flip;
                    return flipY;
                };
                return ComponentBase;
            }());
            b2data.ComponentBase = ComponentBase;
            var Component = /** @class */ (function (_super) {
                __extends(Component, _super);
                function Component() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Component.prototype.isDead = function () {
                    return this.isSelfDead || this.parent.isDead();
                };
                Component.prototype.loadFromJson = function (child) {
                    _super.prototype.loadFromJson.call(this, child);
                    this.isSelfDead = false;
                };
                return Component;
            }(ComponentBase));
            b2data.Component = Component;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /**
             * 对应带有rigidbody组件的节点
             */
            var Box2DBody = /** @class */ (function () {
                function Box2DBody() {
                    this.components = [];
                    /**
                     * 缩放倍率
                     */
                    this.PTM_RATIO = 1;
                }
                Box2DBody.prototype.updateParent = function () {
                    this.transform.parent = this;
                    for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                        var child = _a[_i];
                        child.parent = this;
                    }
                    var unionData = this.getUnionData();
                    this.collisionGroup.setTeamInfo(unionData.team, unionData.totalTeams);
                    this.collisionGroup.updateCollisionGroup();
                };
                Box2DBody.prototype.isDead = function () {
                    return this.isSelfDead || this.parent.isDead();
                };
                Box2DBody.prototype.getNodeAngle = function () {
                    return this.parent.transform.rotation;
                };
                Box2DBody.prototype.getBodyAngle = function () {
                    return this.transform.rotation;
                };
                Box2DBody.prototype.getInUnionPosition2 = function () {
                    var bodyPos = b2data.Vec2.fromXYZLike(this.transform.position);
                    bodyPos.x = bodyPos.x * this.getNodeFlip();
                    var nodeAngle = this.parent.transform.rotation;
                    // node的旋转会对body的位置产生影响
                    fsync.Vector.rotateSelfByZero2(bodyPos, nodeAngle);
                    var nodePos = b2data.Vec2.fromXYZLike(this.parent.transform.position);
                    fsync.Vector.addUp(bodyPos, nodePos);
                    bodyPos.x = bodyPos.x * this.getUnionFlip();
                    return bodyPos;
                };
                Box2DBody.prototype.getBodyFlip = function () {
                    return this.transform.flip;
                };
                Box2DBody.prototype.getNodeFlip = function () {
                    return this.parent.transform.flip;
                };
                Box2DBody.prototype.getUnionFlip = function () {
                    return this.parent.parent.transform.flip;
                };
                Box2DBody.prototype.getMainBodyPosInUnion = function () {
                    return this.getInUnionPosition2();
                };
                Box2DBody.prototype.getMainBodyPosInWorld = function () {
                    var bodyPos = this.getMainBodyPosInUnion();
                    var worldPos = this.getUnionData().calcPtInParent(bodyPos);
                    return worldPos;
                };
                /**
                 * 计算body上的点在union上的坐标
                 * @param shapePt
                 */
                Box2DBody.prototype.calcShapePtInUnion = function (shapePt) {
                    var selfBodyPosInNode = fsync.Vector2.fromXYZLike(this.transform.position);
                    var selfNodePosInUnion = fsync.Vector2.fromXYZLike(this.parent.transform.position);
                    var selfBodyAngleInNode = this.transform.rotation;
                    var selfNodeAngleInUnion = this.parent.transform.rotation;
                    var selfBodyAngleInUnion = selfBodyAngleInNode + selfNodeAngleInUnion;
                    // 算出node旋转产生的整体位移效应
                    var rotatedOffset = selfBodyPosInNode.clone();
                    // 应对node自身翻转
                    rotatedOffset.x = rotatedOffset.x * this.getNodeFlip();
                    fsync.Vector.rotateSelfByZero2(rotatedOffset, selfNodeAngleInUnion);
                    // 叠加整体位移
                    var bodyOffsetInUnion = fsync.Vector.addUp(selfNodePosInUnion.clone(), rotatedOffset);
                    // 应对union自身翻转
                    bodyOffsetInUnion.x = bodyOffsetInUnion.x * this.getUnionFlip();
                    // 算出shape自身每个点的总旋转效应
                    var shapePtInUnion = shapePt.clone();
                    fsync.Vector.rotateSelfByZero2(shapePtInUnion, selfBodyAngleInUnion);
                    // 应对node自身旋转
                    shapePtInUnion.x = shapePtInUnion.x * this.getNodeFlip() * this.getUnionFlip();
                    fsync.Vector.addUp(shapePtInUnion, bodyOffsetInUnion);
                    return shapePtInUnion;
                };
                Box2DBody.prototype.calcShapePtInWorld = function (shapePt) {
                    var bodyPos = this.calcShapePtInUnion(shapePt);
                    var worldPos = this.getUnionData().calcPtInParent(bodyPos);
                    return worldPos;
                };
                Box2DBody.prototype.calcAngleInFixture = function (mainBody) {
                    return this.transform.rotation;
                };
                Box2DBody.prototype.calcFlipInMainBody = function (mainBody) {
                    return this.transform.flip * this.parent.transform.flip * this.parent.parent.transform.flip;
                };
                Box2DBody.prototype.calcShapePtInMainBody = function (mainBody, shapePt) {
                    var bodyPosInWorld = mainBody.getMainBodyPosInUnion();
                    var shapePtInWorld = this.calcShapePtInUnion(shapePt);
                    var shapePtInMainBody = fsync.Vector.subDown(shapePtInWorld.clone(), bodyPosInWorld);
                    return shapePtInMainBody;
                };
                Box2DBody.prototype.calcJointAnchor = function (mainBody, anchor) {
                    return this.calcShapePtInMainBody(mainBody, anchor);
                };
                Box2DBody.prototype.getPTMRatio = function () {
                    if (this.parent) {
                        return this.PTM_RATIO * this.parent.getPTMRatio();
                    }
                    return this.PTM_RATIO;
                };
                Box2DBody.prototype.findRigidBody = function () {
                    return this.components.find(function (comp) { return comp instanceof b2data.RigidBody; });
                };
                Box2DBody.prototype.updatePTMRatio = function () {
                    this.transform.updatePTMRatio();
                    this.components.forEach(function (comp) { return comp.updatePTMRatio(); });
                };
                Box2DBody.prototype.getUnionData = function () {
                    return this.parent.parent;
                };
                Box2DBody.prototype.loadFromJson = function (json) {
                    this.oid = json.oid;
                    this.name = json.name;
                    this.isSelfDead = false;
                    this.transform = new b2data.Transform();
                    this.transform.loadFromJson(json.transform);
                    this.collisionGroup = new b2data.CollisionGroup();
                    this.collisionGroup.loadFromJson(json.collisionGroup);
                    this.components = [];
                    for (var _i = 0, _a = json.components; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var childCopy = void 0;
                        switch (child.ctype) {
                            case "cc_RigidBody":
                                {
                                    childCopy = new b2data.RigidBody();
                                    break;
                                }
                            case "cc_PhysicsBoxCollider":
                                {
                                    childCopy = new b2data.PhysicsBoxCollider();
                                    break;
                                }
                            case "cc_PhysicsCircleCollider":
                                {
                                    childCopy = new b2data.PhysicsCircleCollider();
                                    break;
                                }
                            case "cc_PhysicsPolygonCollider":
                                {
                                    childCopy = new b2data.PhysicsPolygonCollider();
                                    break;
                                }
                            case "cc_PhysicsBoxCollider":
                                {
                                    childCopy = new b2data.PhysicsBoxCollider();
                                    break;
                                }
                            case "cc_RevoluteJoint":
                                {
                                    childCopy = new b2data.RevoluteJoint();
                                    break;
                                }
                            case "cc_WheelJoint":
                                {
                                    childCopy = new b2data.WheelJoint();
                                    break;
                                }
                            case "cc_WeldJoint":
                                {
                                    childCopy = new b2data.WeldJoint();
                                    break;
                                }
                            default:
                                console.warn("unsupport type", child.ctype);
                        }
                        if (childCopy) {
                            childCopy.loadFromJson(child);
                            this.components.push(childCopy);
                        }
                    }
                };
                return Box2DBody;
            }());
            b2data.Box2DBody = Box2DBody;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var Box2DHelper = /** @class */ (function () {
            function Box2DHelper() {
            }
            Box2DHelper.prototype.getBodyAABB = function (b, vs) {
                for (var fx = b.GetFixtureList(); fx; fx = fx.GetNext()) {
                    for (var pi = 0; pi < fx.m_proxies.length; pi++) {
                        var proxy = fx.m_proxies[pi];
                        var ab = proxy.aabb;
                        if (proxy.treeNode) {
                            ab = proxy.treeNode.aabb;
                        }
                        vs.lowerBound.x = Math.min(vs.lowerBound.x, ab.lowerBound.x);
                        vs.lowerBound.y = Math.min(vs.lowerBound.y, ab.lowerBound.y);
                        vs.upperBound.x = Math.max(vs.upperBound.x, ab.upperBound.x);
                        vs.upperBound.y = Math.max(vs.upperBound.y, ab.upperBound.y);
                    }
                }
                return vs;
            };
            return Box2DHelper;
        }());
        box2d.Box2DHelper = Box2DHelper;
        box2d.box2DHelper = new Box2DHelper();
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /**
             * 节点皮肤信息
             */
            var NodeSkinInfo = /** @class */ (function () {
                function NodeSkinInfo() {
                    this.skinId = -1;
                }
                NodeSkinInfo.prototype.loadFromJson = function (json) {
                    this.skinId = json.skinId;
                };
                NodeSkinInfo.prototype.getSkinId = function () {
                    if (this.skinId >= 0) {
                        return this.skinId;
                    }
                    if (this.parent != null) {
                        return this.parent.parent.skinInfo.getSkinId();
                    }
                    return -1;
                };
                NodeSkinInfo.prototype.setSkinId = function (skinId) {
                    this.skinId = skinId;
                };
                return NodeSkinInfo;
            }());
            b2data.NodeSkinInfo = NodeSkinInfo;
            /**
             * 对应box预制体根节点
             */
            var Box2DNode = /** @class */ (function () {
                function Box2DNode() {
                    this.children = [];
                    /**
                     * 缩放倍率
                     */
                    this.PTM_RATIO = 1;
                    /**
                     * 图层顺序
                     */
                    this.layerOrder = 0;
                    /**
                     * 皮肤信息
                     */
                    this.skinInfo = new NodeSkinInfo();
                    /**
                     * 所挂技能附件的信息
                     */
                    this.skillExtras = [];
                }
                Box2DNode.prototype.isDead = function () {
                    return this.isSelfDead || this.parent.isDead();
                };
                Box2DNode.prototype.getPTMRatio = function () {
                    if (this.parent) {
                        return this.PTM_RATIO * this.parent.getPTMRatio();
                    }
                    return this.PTM_RATIO;
                };
                Box2DNode.prototype.updatePTMRatio = function () {
                    this.transform.updatePTMRatio();
                    this.children.forEach(function (comp) { return comp.updatePTMRatio(); });
                };
                Box2DNode.prototype.updateParent = function () {
                    this.transform.parent = this;
                    this.skinInfo.parent = this;
                    for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        child.parent = this;
                        child.updateParent();
                    }
                };
                Box2DNode.prototype.loadFromJson = function (json) {
                    this.oid = json.oid;
                    this.name = json.name;
                    this.isSelfDead = false;
                    this.layerOrder = json.layerOrder;
                    this.skinInfo.loadFromJson(json.skinInfo);
                    this.transform = new b2data.Transform();
                    this.transform.loadFromJson(json.transform);
                    this.children = [];
                    for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var childCopy = new b2data.Box2DBody();
                        childCopy.loadFromJson(child);
                        this.children.push(childCopy);
                    }
                    this.skillExtras = json.skillExtras;
                };
                return Box2DNode;
            }());
            b2data.Box2DNode = Box2DNode;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var Transform = /** @class */ (function (_super) {
                __extends(Transform, _super);
                function Transform() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    /**
                     * 相对坐标
                     */
                    _this.position = new b2data.Vec3();
                    /**
                     * 旋转弧度/角度
                     * - 加载阶段会从cocos角度值转换为box2d内部使用的弧度值
                     */
                    _this.rotation = 0;
                    /**
                     * 按x轴翻转
                     */
                    _this.flip = 1;
                    return _this;
                }
                /**
                 * 从json加载box2d纯数据模型对象
                 * @param json
                 */
                Transform.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.position = b2data.Vec3.fromNumArray(json.position['data']);
                    this.flip = json.flip;
                    this.rotation = json.rotation * b2data.ANGLE_TO_PHYSICS_ANGLE;
                };
                /**
                 * 更新缩放倍率
                 */
                Transform.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.position, rptm);
                };
                return Transform;
            }(b2data.ComponentBase));
            b2data.Transform = Transform;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var Box2DUnion = /** @class */ (function () {
                function Box2DUnion() {
                    /**
                     * 标签列表，可调试用
                     */
                    this.tags = [];
                    this.bodies = [];
                    this.joints = [];
                    this.fixtures = [];
                    this.outsideFixture = [];
                    this.isOutsideHeadBody = false;
                    this.skillExtras = [];
                }
                Box2DUnion.prototype.updateUserData = function (uidTool) {
                    this.oid = uidTool.genTypedId("Box2DUnion");
                    for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
                        var body = _a[_i];
                        var userData = body.GetUserData();
                        userData.oid = uidTool.genTypedId("b2body");
                        userData.unionId = this.oid;
                    }
                    for (var _b = 0, _c = this.fixtures; _b < _c.length; _b++) {
                        var fixture = _c[_b];
                        var userData = fixture.GetUserData();
                        userData.oid = uidTool.genTypedId("b2fixture");
                        userData.unionId = this.oid;
                    }
                    for (var _d = 0, _e = this.joints; _d < _e.length; _d++) {
                        var joint = _e[_d];
                        var userData = joint.GetUserData();
                        userData.oid = uidTool.genTypedId("b2joint");
                        userData.unionId = this.oid;
                    }
                    var compsMap = {};
                    var comps = [].concat(this.bodies).concat(this.joints).concat(this.fixtures);
                    comps.forEach(function (comp) {
                        var mid = comp.GetUserData().mid;
                        compsMap[mid] = comp.GetUserData().oid;
                    });
                    this.modelToTargetMap = compsMap;
                    // let skillExtras = this.skillExtras
                    // let skillExtrasConvert: ISkillExtra[] = []
                    // for (let skillExtra of skillExtras) {
                    // 	let newExtra = EmptyTable()
                    // 	for (let key in skillExtra) {
                    // 		let value = skillExtra[key]
                    // 		let mapValue = compsMap[value]
                    // 		if (mapValue != null) {
                    // 			newExtra[key] = mapValue
                    // 		} else {
                    // 			newExtra[key] = value
                    // 		}
                    // 	}
                    // 	skillExtrasConvert.push(newExtra)
                    // }
                    // this.skillExtras = skillExtrasConvert
                };
                Box2DUnion.prototype.getFixturesByModelId = function (id) {
                    var fs = this.fixtures.filter(function (fixture) { return fixture.GetUserData().mid == id; });
                    return fs;
                };
                Box2DUnion.prototype.getFixturesByBodyModel = function (bodyModel) {
                    var _this = this;
                    var comps = bodyModel.components.filter(function (comp) { return comp instanceof b2data.PhysicsCollider; });
                    var fixtures = [];
                    comps.forEach(function (comp) {
                        var fs = _this.getFixturesByModelId(comp.oid);
                        fs.forEach(function (fixture) {
                            fixtures.push(fixture);
                        });
                    });
                    return fixtures;
                };
                Box2DUnion.prototype.getFixturesByNodeModel = function (nodeModel) {
                    var _this = this;
                    var fixtuers = [];
                    nodeModel.children.forEach(function (bodyModel) {
                        _this.getFixturesByBodyModel(bodyModel).forEach(function (fixture) {
                            fixtuers.push(fixture);
                        });
                    });
                    return fixtuers;
                };
                Box2DUnion.prototype.calcAABB = function () {
                    var minX = Number.MAX_VALUE;
                    var maxX = -Number.MAX_VALUE;
                    var minY = Number.MAX_VALUE;
                    var maxY = -Number.MAX_VALUE;
                    var vs = new b2.AABB();
                    vs.lowerBound.x = Number.MAX_VALUE;
                    vs.lowerBound.y = Number.MAX_VALUE;
                    vs.upperBound.x = -Number.MAX_VALUE;
                    vs.upperBound.y = -Number.MAX_VALUE;
                    var bodyExist = false;
                    for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
                        var body = _a[_i];
                        box2d.box2DHelper.getBodyAABB(body, vs);
                        bodyExist = true;
                    }
                    if (!bodyExist) {
                        throw new Error("invalid body for calc AABB");
                    }
                    minX = vs.lowerBound.x;
                    minY = vs.lowerBound.y;
                    maxX = vs.upperBound.x;
                    maxY = vs.upperBound.y;
                    return {
                        x: (minX + (maxX - minX) / 2),
                        y: (minY + (maxY - minY) / 2),
                        width: Math.abs(maxX - minX),
                        height: Math.abs(maxY - minY),
                    };
                };
                Box2DUnion.prototype.setPosition = function (pos) {
                    var b2Pos = new b2.Vec2(pos.x, pos.y);
                    var headPos = this.headBody.GetPosition();
                    var offset = b2Pos.Clone().SelfSub(headPos);
                    this.bodies.forEach(function (body) {
                        body.SetPosition(body.GetPosition().SelfAdd(offset));
                    });
                };
                return Box2DUnion;
            }());
            b2data.Box2DUnion = Box2DUnion;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var UnionSkinInfo = /** @class */ (function () {
                function UnionSkinInfo() {
                    this.skinId = -1;
                }
                UnionSkinInfo.prototype.loadFromJson = function (json) {
                    this.skinId = json.skinId;
                };
                UnionSkinInfo.prototype.getSkinId = function () {
                    return this.skinId;
                };
                UnionSkinInfo.prototype.setSkinId = function (skinId) {
                    this.skinId = skinId;
                };
                return UnionSkinInfo;
            }());
            b2data.UnionSkinInfo = UnionSkinInfo;
            var Box2DUnionData = /** @class */ (function () {
                function Box2DUnionData() {
                    /**
                     * 标签列表，可调试用
                     */
                    this.tags = [];
                    this.transform = new b2data.Transform();
                    this.children = [];
                    /**
                     * 关联信息
                     */
                    this.fixedContacts = [];
                    /**
                     * 缩放倍率
                     */
                    this.PTM_RATIO = 1;
                    /**
                     * 队伍归属，用于碰撞分组
                     */
                    this.team = 0;
                    /**
                     * 所有队伍
                     */
                    this.totalTeams = [];
                    /**
                     * 皮肤信息
                     */
                    this.skinInfo = new UnionSkinInfo();
                    /**
                     * 外部关联信息
                     */
                    this.outsideFixedContact = new b2data.OutsideFixedContact();
                }
                Box2DUnionData.prototype.isDead = function () {
                    return this.isSelfDead;
                };
                Box2DUnionData.prototype.calcPtInParent = function (pt) {
                    var unionAngle = this.transform.rotation;
                    var bodyOffset = fsync.Vector.rotateSelfByZero2(pt, unionAngle);
                    var unionPos = this.transform.position;
                    var worldPos = fsync.Vector.addUp(fsync.Vector2.fromXYZLike(unionPos), bodyOffset);
                    return worldPos;
                };
                Box2DUnionData.prototype.getPTMRatio = function () {
                    return this.PTM_RATIO;
                };
                Box2DUnionData.prototype.updatePTMRatio = function () {
                    if (this.transform) {
                        this.transform.updatePTMRatio();
                    }
                    this.children.forEach(function (comp) { return comp.updatePTMRatio(); });
                };
                Box2DUnionData.prototype.loadFromJson = function (json) {
                    var _this = this;
                    this.oid = json.oid;
                    this.name = json.name;
                    json.tags.forEach(function (tag) { return _this.tags.push(tag); });
                    this.bodyName = json.bodyName;
                    this.isSelfDead = false;
                    this.transform.loadFromJson(json.transform);
                    this.skinInfo.loadFromJson(json.skinInfo);
                    this.fixedContacts = json.fixedContacts;
                    this.children = json.children.map(function (child) {
                        var node = new b2data.Box2DNode();
                        node.loadFromJson(child);
                        return node;
                    });
                    this.team = json.team;
                    this.totalTeams = json.totalTeams.concat();
                };
                Box2DUnionData.prototype.updateParent = function () {
                    if (this.transform) {
                        this.transform.parent = this;
                    }
                    if (this.skinInfo) {
                        this.skinInfo.parent = this;
                    }
                    for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        child.parent = this;
                        child.updateParent();
                    }
                };
                Box2DUnionData.prototype.getBelongedZoneId = function (body) {
                    var bodyId = body.findRigidBody().oid;
                    var connect = this.fixedContacts.find(function (c) { return c.groupId == bodyId; });
                    if (connect) {
                        return connect.connectZoneId;
                    }
                    else {
                        return bodyId;
                    }
                };
                Box2DUnionData.prototype.getBelongedZone = function (body) {
                    var bodyId = body.findRigidBody().oid;
                    var connect = this.fixedContacts.find(function (c) { return c.groupId == bodyId; });
                    var zoneId = bodyId;
                    if (connect) {
                        zoneId = connect.connectZoneId;
                    }
                    // 整合为一个body群
                    var molecules = [];
                    this.children.forEach(function (childNode) {
                        childNode.children.forEach(function (childBody) {
                            molecules.push(childBody);
                        });
                    });
                    var zone = molecules.find(function (body) { return body.findRigidBody().oid == zoneId; });
                    return zone;
                };
                Box2DUnionData.prototype.createUnion = function (world) {
                    var _this = this;
                    var outsideFixedContact = this.outsideFixedContact;
                    var b2Union = new b2data.Box2DUnion();
                    b2Union.name = this.name;
                    b2Union.mid = this.oid;
                    this.tags.forEach(function (tag) { return b2Union.tags.push(tag); });
                    b2Union.box2dUnionData = this;
                    // 合并 skillextra 信息
                    b2Union.skillExtras.length = 0;
                    this.children.forEach(function (childNode) {
                        childNode.skillExtras.forEach(function (extra) {
                            b2Union.skillExtras.push(extra);
                        });
                    });
                    // 整合为一个body群
                    var molecules = [];
                    this.children.forEach(function (childNode) {
                        childNode.children.forEach(function (childBody) {
                            molecules.push(childBody);
                        });
                    });
                    // 找到 main body
                    var mainNode = this.children.find(function (child) { return child.name == _this.bodyName; });
                    if (mainNode == null) {
                        mainNode = this.children[0];
                    }
                    var mainBody = mainNode.children.find(function (body) { return body.name == "Main"; });
                    if (mainBody == null) {
                        mainBody = mainNode.children[0];
                    }
                    var mainRigidBody = mainBody.findRigidBody();
                    var zoneMap = {};
                    for (var _i = 0, _a = this.fixedContacts; _i < _a.length; _i++) {
                        var contact = _a[_i];
                        zoneMap[contact.groupId] = contact.connectZoneId;
                    }
                    for (var _b = 0, _c = outsideFixedContact.fixedContacts; _b < _c.length; _b++) {
                        var contact = _c[_b];
                        zoneMap[contact.groupId] = contact.connectZoneId;
                    }
                    var bodyMaps = {};
                    molecules.forEach(function (molecule) {
                        bodyMaps[molecule.findRigidBody().oid] = molecule;
                    });
                    outsideFixedContact.bodyModels.forEach(function (molecule) {
                        bodyMaps[molecule.findRigidBody().oid] = molecule;
                    });
                    var zoneMoleculesMap = fsync.EmptyTable();
                    molecules.forEach(function (molecule) {
                        var targetRigidBody = molecule.findRigidBody();
                        var zoneId = zoneMap[targetRigidBody.oid];
                        // 如果没有焊死，那么独立成为一个body，(除了主体，通常不会出现)
                        if (zoneId == null) {
                            zoneId = targetRigidBody.oid;
                        }
                        var ls = zoneMoleculesMap[zoneId] = zoneMoleculesMap[zoneId] || [];
                        ls.push(molecule);
                    });
                    var zoneB2BodyMap = {};
                    outsideFixedContact.bodies.forEach(function (body, index) {
                        var molecule = outsideFixedContact.bodyModels[index];
                        zoneB2BodyMap[molecule.findRigidBody().oid] = body;
                    });
                    var _loop_1 = function (zoneId) {
                        // 区域中需要合并的body
                        var zoneMolecules = zoneMoleculesMap[zoneId];
                        // 区域的主体body，区域中所有body合并到此body中
                        var zonBodyModel = bodyMaps[zoneId];
                        var isOutsideFixture = false;
                        var zoneBody;
                        if (zoneB2BodyMap[zoneId]) {
                            zoneBody = zoneB2BodyMap[zoneId];
                            isOutsideFixture = true;
                        }
                        else {
                            var zoneRigidBody = zonBodyModel.components.find(function (comp) { return comp instanceof b2data.RigidBody; });
                            var zoneBodyDef = zoneRigidBody.createBodyDef();
                            var zoneName = zoneRigidBody.parent.parent.name;
                            zoneBody = zoneRigidBody.createBody(zoneName, world, zoneBodyDef, b2Union.oid);
                            var bodyPos = zonBodyModel.getInUnionPosition2();
                            zoneBody.SetPosition(new b2.Vec2(bodyPos.x, bodyPos.y));
                            zoneB2BodyMap[zoneId] = zoneBody;
                            b2Union.bodies.push(zoneBody);
                        }
                        // 遍历创建fixture
                        zoneMolecules.forEach(function (molecule) {
                            molecule.components.forEach(function (comp) {
                                if (comp instanceof b2data.PhysicsCollider) {
                                    var shapes = comp.createShapes(zonBodyModel);
                                    for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
                                        var shape = shapes_1[_i];
                                        var fixtureDef = comp.createFixtureDef();
                                        fixtureDef.shape = shape;
                                        var fixture = comp.createFixture(zoneBody, fixtureDef, b2Union.oid);
                                        b2Union.fixtures.push(fixture);
                                        if (isOutsideFixture) {
                                            b2Union.outsideFixture.push(fixture);
                                        }
                                        var fixtureOffset = molecule.calcShapePtInMainBody(zonBodyModel, new b2data.Vec2());
                                        var fixtureAngle = molecule.calcAngleInFixture(zonBodyModel);
                                        var fixtureFlip = molecule.calcFlipInMainBody(zonBodyModel);
                                        var fixtureTransform = new b2data.Transform();
                                        fixtureTransform.position = b2data.Vec3.fromXYZLike(fixtureOffset);
                                        fixtureTransform.rotation = fixtureAngle;
                                        fixtureTransform.flip = fixtureFlip;
                                        fixture.GetUserData().transform = fixtureTransform;
                                    }
                                }
                            });
                        });
                    };
                    // 遍历所有 zone 创建body,并附加 fixture
                    for (var zoneId in zoneMoleculesMap) {
                        _loop_1(zoneId);
                    }
                    // 设置整体原点信息
                    var headBodyId = zoneMap[mainRigidBody.oid];
                    if (headBodyId == null) {
                        headBodyId = mainRigidBody.oid;
                    }
                    b2Union.headBody = zoneB2BodyMap[headBodyId];
                    // 遍历创建joints
                    molecules.forEach(function (molecule) {
                        var myGroupId = molecule.findRigidBody().oid;
                        var myZoneId = zoneMap[myGroupId];
                        if (myZoneId == null) {
                            myZoneId = myGroupId;
                        }
                        var myZoneB2Body = zoneB2BodyMap[myZoneId];
                        molecule.components.forEach(function (comp) {
                            if (comp instanceof b2data.Joint) {
                                var groupId = comp.connectedBody.oid;
                                var zoneId = zoneMap[groupId];
                                if (zoneId == null) {
                                    zoneId = groupId;
                                }
                                var b2body = zoneB2BodyMap[zoneId];
                                var mainBodyModelA = bodyMaps[myZoneId];
                                var bodyModelA = bodyMaps[myGroupId];
                                var mainBodyModelB = bodyMaps[zoneId];
                                var bodyModelB = bodyMaps[groupId];
                                var jointDef = comp.createJointDef(mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB);
                                jointDef.bodyA = myZoneB2Body;
                                jointDef.bodyB = b2body;
                                var b2Joint = comp.createJoint(world, jointDef, b2Union.oid);
                                b2Union.joints.push(b2Joint);
                            }
                        });
                    });
                    b2Union.setPosition(fsync.Vector.asVector2(this.transform.position));
                    var isOutsideBody = outsideFixedContact.bodies.indexOf(b2Union.headBody) >= 0;
                    b2Union.isOutsideHeadBody = isOutsideBody;
                    if (!isOutsideBody) {
                        // 不去影响主体的旋转和位置
                        b2Union.headBody.SetAngle(this.transform.rotation);
                    }
                    return b2Union;
                };
                return Box2DUnionData;
            }());
            b2data.Box2DUnionData = Box2DUnionData;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var createContactListener = function () {
                var ContactListener = /** @class */ (function (_super) {
                    __extends(ContactListener, _super);
                    function ContactListener() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.mm = {};
                        return _this;
                    }
                    /**
                    * Called when two fixtures begin to touch.
                    * 当两个fixture碰撞时，触发该函数
                    * @param contact Contact point.
                    **/
                    ContactListener.prototype.BeginContact = function (contact) {
                        {
                            var a = contact.GetFixtureA().GetUserData();
                            var b = contact.GetFixtureB().GetUserData();
                            var fixtureA_1 = contact.GetFixtureA();
                            var fixtureB_1 = contact.GetFixtureB();
                            this.mm[fixtureA_1.GetUserData().oid] = true;
                            this.mm[fixtureB_1.GetUserData().oid] = true;
                            // console.log("Collision-begin", this.mm)
                            a.contacts = a.contacts.filter(function (c) { return c.contact.GetFixtureA() != fixtureB_1 && c.contact.GetFixtureB() != fixtureB_1; });
                            b.contacts = b.contacts.filter(function (c) { return c.contact.GetFixtureA() != fixtureA_1 && c.contact.GetFixtureB() != fixtureA_1; });
                            var state = "begin";
                            if (a) {
                                a.contacts.push({ state: state, contact: contact });
                            }
                            if (b) {
                                b.contacts.push({ state: state, contact: contact });
                            }
                        }
                    };
                    /**
                    * Called when two fixtures cease to touch.
                    * 当两个fixture停止碰撞时，触发该函数
                    * @param contact Contact point.
                    **/
                    ContactListener.prototype.EndContact = function (contact) {
                        var a = contact.GetFixtureA().GetUserData();
                        var b = contact.GetFixtureB().GetUserData();
                        var fixtureA = contact.GetFixtureA();
                        var fixtureB = contact.GetFixtureB();
                        this.mm[fixtureA.GetUserData().oid] = false;
                        this.mm[fixtureB.GetUserData().oid] = false;
                        // console.log("Collision-end", this.mm)
                        a.contacts = a.contacts.filter(function (c) { return c.contact.GetFixtureA() != fixtureB && c.contact.GetFixtureB() != fixtureB; });
                        b.contacts = b.contacts.filter(function (c) { return c.contact.GetFixtureA() != fixtureA && c.contact.GetFixtureB() != fixtureA; });
                        var state = "end";
                        if (a) {
                            a.contacts.push({ state: state, contact: contact });
                        }
                        if (b) {
                            b.contacts.push({ state: state, contact: contact });
                        }
                    };
                    /**
                    * This lets you inspect a contact after the solver is finished. This is useful for inspecting impulses. Note: the contact manifold does not include time of impact impulses, which can be arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly in a separate data structure. Note: this is only called for contacts that are touching, solid, and awake.
                    * 在碰撞检测之后，但在碰撞求解（物理模拟）之前，此函数的事件会被触发。这样是为了给开发者一个机会，根据当前情况来决定是否使这个接触失效。在回调的函数中使用一个设置函数就可以实现单侧碰撞的功能。每次碰撞处理时，接触会重新生效，开发者不得不在每一个时间步中都设置同一个接触无效。由于连续碰撞检测，PreSolve事件在单个时间步中有可能发生多次
                    * @param contact Contact point.
                    * @param impulse Contact impulse.
                    **/
                    ContactListener.prototype.PreSolve = function (contact, oldManifold) {
                    };
                    /**
                    * This is called after a contact is updated. This allows you to inspect a contact before it goes to the solver. If you are careful, you can modify the contact manifold (e.g. disable contact). A copy of the old manifold is provided so that you can detect changes. Note: this is called only for awake bodies. Note: this is called even when the number of contact points is zero. Note: this is not called for sensors. Note: if you set the number of contact points to zero, you will not get an EndContact callback. However, you may get a BeginContact callback the next step.
                    * 当引擎完成了碰撞求解，也就是物理模拟过程过后，开发者可以得到碰撞冲量（collision impulse）的结果时，函数postSolve就会被调用了。这将是提供给开发者附加碰撞结果的机会。
                    * 在一个接触回调函数PostSolve中去改变物理世界的模拟数据，是一件神奇的工作。例如，在游戏中可能会以碰撞的方式来消灭敌人。此时开发者就可以在此函数中施加伤害，并试图摧毁关联的角色和它的刚体。然而，引擎并不允许开发者在回调函数中改变物理世界的物体，这样做是为了避免摧毁引擎正在运算的对象，造成访问错误。
                    * @param contact Contact point.
                    * @param oldManifold Old manifold.
                    **/
                    ContactListener.prototype.PostSolve = function (contact, impulse) {
                    };
                    ContactListener.prototype.BeginContactFixtureParticle = function (system, contact) {
                    };
                    ContactListener.prototype.EndContactFixtureParticle = function (system, contact) {
                    };
                    ContactListener.prototype.BeginContactParticleParticle = function (system, contact) {
                    };
                    ContactListener.prototype.EndContactParticleParticle = function (system, contact) {
                    };
                    return ContactListener;
                }(b2.ContactListener));
                return new ContactListener();
            };
            var Box2DWorld = /** @class */ (function () {
                function Box2DWorld() {
                    this.gravity = new b2data.Vec2(0, -10);
                }
                Box2DWorld.prototype.loadFromJson = function (json) {
                    this.gravity = b2data.Vec2.fromNumArray(json.gravity['data']);
                };
                Box2DWorld.prototype.createWorld = function () {
                    this.concatListener = createContactListener();
                    var world = new b2.World(new b2.Vec2(this.gravity.x, this.gravity.y), true);
                    world.SetContactListener(this.concatListener);
                    return world;
                };
                return Box2DWorld;
            }());
            b2data.Box2DWorld = Box2DWorld;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// http://answers.unity3d.com/questions/977416/2d-polygon-convex-decomposition-code.html
/// <summary>
/// This class is took from the "FarseerUnity" physics engine, which uses Mark Bayazit's decomposition algorithm.
/// I also have to make it work with self-intersecting polygons, so I'll use another different algorithm to decompose a self-intersecting polygon into several simple polygons,
/// and then I would decompose each of them into convex polygons.
/// </summary>
//From phed rev 36
/// <summary>
/// Convex decomposition algorithm created by Mark Bayazit (http://mnbayazit.com/)
/// For more information about this algorithm, see http://mnbayazit.com/406/bayazit
/// </summary>
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var tools;
            (function (tools) {
                function At(i, vertices) {
                    var s = vertices.length;
                    return vertices[i < 0 ? s - (-i % s) : i % s];
                }
                tools.At = At;
                function Copy(i, j, vertices) {
                    var p = [];
                    while (j < i)
                        j += vertices.length;
                    //p.reserve(j - i + 1);
                    for (; i <= j; ++i) {
                        p.push(At(i, vertices));
                    }
                    return p;
                }
                tools.Copy = Copy;
                /// <summary>
                /// Decompose the polygon into several smaller non-concave polygon.
                /// If the polygon is already convex, it will return the original polygon, unless it is over Settings.MaxPolygonVertices.
                /// Precondition: Counter Clockwise polygon
                /// </summary>
                /// <param name="vertices"></param>
                /// <returns></returns>
                function ConvexPartition(vertices) {
                    //We force it to CCW as it is a precondition in this algorithm.
                    ForceCounterClockWise(vertices);
                    var list = [];
                    var d, lowerDist, upperDist;
                    var p;
                    var lowerInt = { x: 0, y: 0 };
                    var upperInt = { x: 0, y: 0 };
                    var lowerIndex = 0, upperIndex = 0;
                    var lowerPoly, upperPoly;
                    for (var i = 0; i < vertices.length; ++i) {
                        if (Reflex(i, vertices)) {
                            lowerDist = upperDist = 10e7; // std::numeric_limits<qreal>::max();
                            for (var j = 0; j < vertices.length; ++j) {
                                // if line intersects with an edge
                                if (Left(At(i - 1, vertices), At(i, vertices), At(j, vertices)) &&
                                    RightOn(At(i - 1, vertices), At(i, vertices), At(j - 1, vertices))) {
                                    // find the povar of intersection
                                    p = LineIntersect(At(i - 1, vertices), At(i, vertices), At(j, vertices), At(j - 1, vertices));
                                    if (Right(At(i + 1, vertices), At(i, vertices), p)) {
                                        // make sure it's inside the poly
                                        d = SquareDist(At(i, vertices), p);
                                        if (d < lowerDist) {
                                            // keep only the closest intersection
                                            lowerDist = d;
                                            lowerInt = p;
                                            lowerIndex = j;
                                        }
                                    }
                                }
                                if (Left(At(i + 1, vertices), At(i, vertices), At(j + 1, vertices)) &&
                                    RightOn(At(i + 1, vertices), At(i, vertices), At(j, vertices))) {
                                    p = LineIntersect(At(i + 1, vertices), At(i, vertices), At(j, vertices), At(j + 1, vertices));
                                    if (Left(At(i - 1, vertices), At(i, vertices), p)) {
                                        d = SquareDist(At(i, vertices), p);
                                        if (d < upperDist) {
                                            upperDist = d;
                                            upperIndex = j;
                                            upperInt = p;
                                        }
                                    }
                                }
                            }
                            // if there are no vertices to connect to, choose a povar in the middle
                            if (lowerIndex == (upperIndex + 1) % vertices.length) {
                                // var sp = lowerInt.add(upperInt).div(2);
                                var sp = {
                                    x: (lowerInt.x + upperInt.x) / 2,
                                    y: (lowerInt.y + upperInt.y) / 2,
                                };
                                lowerPoly = Copy(i, upperIndex, vertices);
                                lowerPoly.push(sp);
                                upperPoly = Copy(lowerIndex, i, vertices);
                                upperPoly.push(sp);
                            }
                            else {
                                var highestScore = 0, bestIndex = lowerIndex;
                                while (upperIndex < lowerIndex) {
                                    upperIndex += vertices.length;
                                }
                                for (var j = lowerIndex; j <= upperIndex; ++j) {
                                    if (CanSee(i, j, vertices)) {
                                        var score = 1 / (SquareDist(At(i, vertices), At(j, vertices)) + 1);
                                        if (Reflex(j, vertices)) {
                                            if (RightOn(At(j - 1, vertices), At(j, vertices), At(i, vertices)) &&
                                                LeftOn(At(j + 1, vertices), At(j, vertices), At(i, vertices))) {
                                                score += 3;
                                            }
                                            else {
                                                score += 2;
                                            }
                                        }
                                        else {
                                            score += 1;
                                        }
                                        if (score > highestScore) {
                                            bestIndex = j;
                                            highestScore = score;
                                        }
                                    }
                                }
                                lowerPoly = Copy(i, bestIndex, vertices);
                                upperPoly = Copy(bestIndex, i, vertices);
                            }
                            list = list.concat(ConvexPartition(lowerPoly));
                            list = list.concat(ConvexPartition(upperPoly));
                            return list;
                        }
                    }
                    // polygon is already convex
                    list.push(vertices);
                    //Remove empty vertice collections
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i].length == 0)
                            list.splice(i, 0);
                    }
                    return list;
                }
                tools.ConvexPartition = ConvexPartition;
                function CanSee(i, j, vertices) {
                    if (Reflex(i, vertices)) {
                        if (LeftOn(At(i, vertices), At(i - 1, vertices), At(j, vertices)) &&
                            RightOn(At(i, vertices), At(i + 1, vertices), At(j, vertices)))
                            return false;
                    }
                    else {
                        if (RightOn(At(i, vertices), At(i + 1, vertices), At(j, vertices)) ||
                            LeftOn(At(i, vertices), At(i - 1, vertices), At(j, vertices)))
                            return false;
                    }
                    if (Reflex(j, vertices)) {
                        if (LeftOn(At(j, vertices), At(j - 1, vertices), At(i, vertices)) &&
                            RightOn(At(j, vertices), At(j + 1, vertices), At(i, vertices)))
                            return false;
                    }
                    else {
                        if (RightOn(At(j, vertices), At(j + 1, vertices), At(i, vertices)) ||
                            LeftOn(At(j, vertices), At(j - 1, vertices), At(i, vertices)))
                            return false;
                    }
                    for (var k = 0; k < vertices.length; ++k) {
                        if ((k + 1) % vertices.length == i || k == i || (k + 1) % vertices.length == j || k == j) {
                            continue; // ignore incident edges
                        }
                        var intersectionPoint = { x: 0, y: 0 };
                        if (LineIntersect2(At(i, vertices), At(j, vertices), At(k, vertices), At(k + 1, vertices), intersectionPoint)) {
                            return false;
                        }
                    }
                    return true;
                }
                tools.CanSee = CanSee;
                // precondition: ccw
                function Reflex(i, vertices) {
                    return Right(i, vertices);
                }
                tools.Reflex = Reflex;
                function Right(a, b, c) {
                    if (typeof c === 'undefined') {
                        var i = a, vertices = b;
                        a = At(i - 1, vertices);
                        b = At(i, vertices);
                        c = At(i + 1, vertices);
                    }
                    return Area(a, b, c) < 0;
                }
                tools.Right = Right;
                function Left(a, b, c) {
                    return Area(a, b, c) > 0;
                }
                tools.Left = Left;
                function LeftOn(a, b, c) {
                    return Area(a, b, c) >= 0;
                }
                tools.LeftOn = LeftOn;
                function RightOn(a, b, c) {
                    return Area(a, b, c) <= 0;
                }
                tools.RightOn = RightOn;
                function SquareDist(a, b) {
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    return dx * dx + dy * dy;
                }
                tools.SquareDist = SquareDist;
                //forces counter clock wise order.
                function ForceCounterClockWise(vertices) {
                    if (!IsCounterClockWise(vertices)) {
                        vertices.reverse();
                    }
                }
                tools.ForceCounterClockWise = ForceCounterClockWise;
                function IsCounterClockWise(vertices) {
                    //We just return true for lines
                    if (vertices.length < 3)
                        return true;
                    return (GetSignedArea(vertices) > 0);
                }
                tools.IsCounterClockWise = IsCounterClockWise;
                //gets the signed area.
                function GetSignedArea(vertices) {
                    var i;
                    var area = 0;
                    for (i = 0; i < vertices.length; i++) {
                        var j = (i + 1) % vertices.length;
                        area += vertices[i].x * vertices[j].y;
                        area -= vertices[i].y * vertices[j].x;
                    }
                    area /= 2;
                    return area;
                }
                tools.GetSignedArea = GetSignedArea;
                //From Mark Bayazit's convex decomposition algorithm
                function LineIntersect(p1, p2, q1, q2) {
                    var i = { x: 0, y: 0 };
                    var a1 = p2.y - p1.y;
                    var b1 = p1.x - p2.x;
                    var c1 = a1 * p1.x + b1 * p1.y;
                    var a2 = q2.y - q1.y;
                    var b2 = q1.x - q2.x;
                    var c2 = a2 * q1.x + b2 * q1.y;
                    var det = a1 * b2 - a2 * b1;
                    if (!FloatEquals(det, 0)) {
                        // lines are not parallel
                        i.x = (b2 * c1 - b1 * c2) / det;
                        i.y = (a1 * c2 - a2 * c1) / det;
                    }
                    return i;
                }
                tools.LineIntersect = LineIntersect;
                //from Eric Jordan's convex decomposition library, it checks if the lines a0->a1 and b0->b1 cross.
                //if they do, intersectionPovar will be filled with the povar of crossing. Grazing lines should not return true.
                function LineIntersect2(a0, a1, b0, b1, intersectionPoint) {
                    if (a0 == b0 || a0 == b1 || a1 == b0 || a1 == b1)
                        return false;
                    var x1 = a0.x;
                    var y1 = a0.y;
                    var x2 = a1.x;
                    var y2 = a1.y;
                    var x3 = b0.x;
                    var y3 = b0.y;
                    var x4 = b1.x;
                    var y4 = b1.y;
                    //AABB early exit
                    if (Math.max(x1, x2) < Math.min(x3, x4) || Math.max(x3, x4) < Math.min(x1, x2))
                        return false;
                    if (Math.max(y1, y2) < Math.min(y3, y4) || Math.max(y3, y4) < Math.min(y1, y2))
                        return false;
                    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
                    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3));
                    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
                    if (Math.abs(denom) < 10e-7) {
                        //Lines are too close to parallel to call
                        return false;
                    }
                    ua /= denom;
                    ub /= denom;
                    if ((0 < ua) && (ua < 1) && (0 < ub) && (ub < 1)) {
                        intersectionPoint.x = (x1 + ua * (x2 - x1));
                        intersectionPoint.y = (y1 + ua * (y2 - y1));
                        return true;
                    }
                    return false;
                }
                tools.LineIntersect2 = LineIntersect2;
                function FloatEquals(value1, value2) {
                    return Math.abs(value1 - value2) <= 10e-7;
                }
                tools.FloatEquals = FloatEquals;
                //returns a positive number if c is to the left of the line going from a to b. Positive number if povar is left, negative if povar is right, and 0 if points are collinear.</returns>
                function Area(a, b, c) {
                    return a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
                }
                tools.Area = Area;
            })(tools = b2data.tools || (b2data.tools = {}));
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var CollisionGroup = /** @class */ (function () {
                function CollisionGroup() {
                    this.enabled = false;
                    this.groupIndex = "";
                    this.categoryBits = "";
                    this.maskBits = "";
                    this.team = 0;
                    this.totalTeams = [];
                    /**
                     * 启用自动双向碰撞
                     */
                    this.enableDuplex = true;
                    /**
                     * 检查单双向碰撞 maskbits 差异
                     */
                    this.checkDuplexDifference = false;
                }
                CollisionGroup.prototype.setTeamInfo = function (team, totalTeams) {
                    this.team = team;
                    this.totalTeams = totalTeams;
                };
                CollisionGroup.prototype.loadFromJson = function (json) {
                    this.enabled = json.enabled;
                    this.groupIndex = json.groupIndex;
                    this.categoryBits = json.categoryBits;
                    this.maskBits = json.maskBits;
                };
                CollisionGroup.prototype.updateCollisionGroup = function () {
                    var groupIndex = CollisionGroup.groupIndexMap[this.groupIndex];
                    if (groupIndex == null) {
                        if (!!this.groupIndex) {
                            groupIndex = CollisionGroup.groupIndexMap[this.groupIndex] = CollisionGroup.groupIndexAcc++;
                        }
                    }
                    this.updateCategorys(this.categoryBits);
                    this.updateCategorys(this.maskBits);
                    this.updateMaskBitsMap(this.maskBits);
                };
                CollisionGroup.prototype.updateMaskBitsMap = function (maskBits) {
                    var _this = this;
                    var key = "" + this.getCategoryBits();
                    var maskBitsNum = CollisionGroup.maskBitsMap[key];
                    if (maskBitsNum == undefined) {
                        maskBitsNum = 0;
                    }
                    var categorys = maskBits.split(";");
                    categorys.forEach(function (category) {
                        _this.expandCategoryTeams(category, function (category) {
                            var categoryExpNum = CollisionGroup.categoryMap[category];
                            var categoryNum = Math.pow(2, categoryExpNum);
                            maskBitsNum = maskBitsNum | categoryNum;
                        });
                    });
                    CollisionGroup.maskBitsMap[key] = maskBitsNum;
                };
                CollisionGroup.prototype.updateCategorys = function (categoryBits) {
                    var _this = this;
                    var categorys = categoryBits.split(";");
                    categorys.forEach(function (category) {
                        _this.expandCategoryTeams(category, function (category) {
                            var categoryExpNum = CollisionGroup.categoryMap[category];
                            if (categoryExpNum == null) {
                                if (!!category) {
                                    var n = CollisionGroup.categoryExpAcc++;
                                    categoryExpNum = CollisionGroup.categoryMap[category] = n;
                                }
                            }
                        });
                    });
                };
                CollisionGroup.prototype.expandCategoryTeams = function (category, call) {
                    var _this = this;
                    if (category.startsWith("$")) {
                        // 	$开头，则替换为组序号
                        var teamCategory = category.replace("$", "T" + this.team + "_");
                        call(teamCategory);
                    }
                    else if (category.startsWith("~")) {
                        // 	~开头，则替换为其他组序号
                        this.totalTeams.forEach(function (team) {
                            if (team != _this.team) {
                                var deCategory = category.replace("~", "T" + team + "_");
                                call(deCategory);
                            }
                        });
                    }
                    else if (category.startsWith("#")) {
                        // 	#开头，则替换为所有组序号
                        this.totalTeams.forEach(function (team) {
                            var deCategory = category.replace("#", "T" + team + "_");
                            call(deCategory);
                        });
                    }
                    else {
                        call(category);
                    }
                };
                CollisionGroup.prototype.mapCategorys = function (categoryBits) {
                    var _this = this;
                    var categorys = categoryBits.split(";");
                    var categorysNum = 0;
                    categorys.forEach(function (category) {
                        _this.expandCategoryTeams(category, function (category) {
                            var categoryExpNum = CollisionGroup.categoryMap[category];
                            categorysNum = categorysNum | Math.pow(2, categoryExpNum);
                        });
                    });
                    return categorysNum;
                };
                CollisionGroup.prototype.getGroupIndex = function () {
                    if (!!this.groupIndex) {
                        return CollisionGroup.groupIndexMap[this.groupIndex];
                    }
                    return 0;
                };
                /**
                * 表示刚体的分组信息，但不决定要碰撞的分组对象。另外，值得注意的，这个值必须是2的N次方。当然设置成其他值，程序不会报错，但是实际的碰撞分类效果，可能会出现意想不到的差错。
                */
                CollisionGroup.prototype.getCategoryBits = function () {
                    return this.mapCategorys(this.categoryBits);
                };
                /**
                * 表示刚体要碰撞的那个刚体分组对象。这个值通常是另外一个FilterData对象的categoryBits属性，表示只与该类刚体发生碰撞。如果要对多组刚体进行碰撞，可以设置maskBits为多个categoryBits的加合。如要和categoryBits分别为2和4的刚体组都进行碰撞，可以设置maskBits属性为6。
                */
                CollisionGroup.prototype.getMaskBits = function () {
                    if (this.enableDuplex) {
                        var key = "" + this.getCategoryBits();
                        var bits = CollisionGroup.maskBitsMap[key];
                        if (this.checkDuplexDifference) {
                            var bits1 = this.mapCategorys(this.maskBits);
                            if (bits1 != bits) {
                                console.warn("unmatched mask bits", this);
                            }
                        }
                        return bits;
                    }
                    else {
                        var bits1 = this.mapCategorys(this.maskBits);
                        return bits1;
                    }
                };
                CollisionGroup.groupIndexMap = {};
                CollisionGroup.groupIndexAcc = 1;
                CollisionGroup.categoryMap = {};
                CollisionGroup.categoryExpAcc = 1;
                CollisionGroup.categoryExpMax = 16;
                CollisionGroup.maskBitsMap = {};
                return CollisionGroup;
            }());
            b2data.CollisionGroup = CollisionGroup;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var SkillExtra = /** @class */ (function () {
                function SkillExtra() {
                }
                return SkillExtra;
            }());
            b2data.SkillExtra = SkillExtra;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en
                Base class for joints to connect rigidbody.
                !#zh
                关节类的基类 */
            var Joint = /** @class */ (function (_super) {
                __extends(Joint, _super);
                function Joint() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Joint.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.anchor = b2data.Vec2.fromNumArray(json.anchor['data']);
                    this.connectedAnchor = b2data.Vec2.fromNumArray(json.connectedAnchor['data']);
                    this.connectedBody = new b2data.RigidBody();
                    this.connectedBody.loadFromJson(json.connectedBody);
                    this.collideConnected = json.collideConnected;
                };
                Joint.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.anchor, rptm);
                    fsync.Vector.multUpVar(this.connectedAnchor, rptm);
                };
                Joint.prototype.createJointDef = function (mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB) {
                    return null;
                };
                Joint.prototype.createJoint = function (world, jointDef, unionId) {
                    var b2Joint = world.CreateJoint(jointDef);
                    var userData = {
                        name: this.parent.name,
                        mid: this.oid,
                        oid: "unknown",
                        unionId: unionId,
                    };
                    b2Joint.SetUserData(userData);
                    return b2Joint;
                };
                return Joint;
            }(b2data.Component));
            b2data.Joint = Joint;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var objIdMap = {};
            var oidAcc = 1;
            var genOid = function () {
                return oidAcc++;
            };
            function toExpression(varname) {
                if (typeof (varname) == "string") {
                    return "\"" + varname + "\"";
                }
                else {
                    return varname;
                }
            }
            b2data.toExpression = toExpression;
            function exportValueToTypescript(sentences, depth, parentName, varname, node) {
                var tab = '\t'.repeat(depth);
                sentences.push("" + tab + parentName + "[" + toExpression(varname) + "] = " + toExpression(node) + ";");
            }
            b2data.exportValueToTypescript = exportValueToTypescript;
            function exportArrayToTypescript(sentences, depth, parentName, varname, node) {
                var typeName = node.constructor.name;
                var varLocalKey = "var_" + varname;
                var tab = '\t'.repeat(depth);
                sentences.push(tab + "const " + varLocalKey + ": any[] = [];\n");
                sentences.push("" + tab + parentName + "[" + toExpression(varname) + "] = " + varLocalKey + ";");
                sentences.push(tab + "{\n");
                for (var _i = 0, _a = Object.getOwnPropertyNames(node); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = node[key];
                    if (typeof (value) == "object") {
                        if (value instanceof Array) {
                            exportObjectToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                        }
                        else {
                            exportObjectToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                        }
                    }
                    else {
                        exportValueToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                    }
                }
                sentences.push(tab + "}\n");
            }
            b2data.exportArrayToTypescript = exportArrayToTypescript;
            function exportObjectToTypescript(sentences, depth, parentName, varname, node) {
                var typeName = node.constructor.name;
                if (b2data[typeName]) {
                    typeName = "b2data." + typeName;
                }
                else if (fsync[typeName]) {
                    typeName = "fsync." + typeName;
                }
                var tab = '\t'.repeat(depth);
                var varLocalKey = "var_" + varname;
                var oid = node["oid"];
                if (oid && objIdMap[oid]) {
                    var gName = objIdMap[oid];
                    sentences.push("" + tab + parentName + "[" + toExpression(varname) + "] = " + gName + ";");
                }
                else {
                    sentences.push(tab + "const " + varLocalKey + ": " + typeName + " = new " + typeName + "();");
                    if (oid) {
                        var gid = genOid();
                        var gName = "gvar_" + gid;
                        objIdMap[oid] = gName;
                        sentences.push(tab + "var " + gName + " = " + varLocalKey + ";");
                    }
                    sentences.push("" + tab + parentName + "[" + toExpression(varname) + "] = " + varLocalKey + ";");
                    sentences.push(tab + "{\n");
                    for (var _i = 0, _a = Object.getOwnPropertyNames(node); _i < _a.length; _i++) {
                        var key = _a[_i];
                        var value = node[key];
                        if (typeof (value) == "object") {
                            if (value instanceof Array) {
                                exportArrayToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                            }
                            else {
                                exportObjectToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                            }
                        }
                        else {
                            exportValueToTypescript(sentences, depth + 1, "" + varLocalKey, key, value);
                        }
                    }
                    sentences.push(tab + "}\n");
                }
            }
            b2data.exportObjectToTypescript = exportObjectToTypescript;
            function exportB2NodeToTypescript(b2Node) {
                oidAcc = 1;
                objIdMap = {};
                var sentences = [];
                sentences.push("namespace b2stuffs {");
                sentences.push("\texport const get" + b2Node.name + "Data = () => {");
                sentences.push("\t\tconst b2Root = {};");
                b2data.exportObjectToTypescript(sentences, 2, "b2Root", "b2Var", b2Node);
                sentences.push("\t\tconst result" + b2Node.name + " = b2Root[\"b2Var\"];");
                sentences.push("\t\treturn result" + b2Node.name + ";");
                sentences.push("\t}");
                sentences.push("}");
                return sentences;
            }
            b2data.exportB2NodeToTypescript = exportB2NodeToTypescript;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            var OutsideFixedContact = /** @class */ (function () {
                function OutsideFixedContact() {
                    this.fixedContacts = [];
                    this.bodies = [];
                    this.bodyModels = [];
                }
                return OutsideFixedContact;
            }());
            b2data.OutsideFixedContact = OutsideFixedContact;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            b2data.ANGLE_TO_PHYSICS_ANGLE = -Math.PI / 180; //在cocos中角度是反的，因此要加入-来转换
            b2data.PHYSICS_ANGLE_TO_ANGLE = -180 / Math.PI;
            /** !#en Collider component base class.
                !#zh 碰撞组件基类 */
            var Collider = /** @class */ (function (_super) {
                __extends(Collider, _super);
                function Collider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Collider.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.tag = json.tag;
                };
                return Collider;
            }(b2data.Component));
            b2data.Collider = Collider;
            /** undefined */
            var PhysicsCollider = /** @class */ (function (_super) {
                __extends(PhysicsCollider, _super);
                function PhysicsCollider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PhysicsCollider.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.density = json.density;
                    this.sensor = json.sensor;
                    this.friction = json.friction;
                    this.restitution = json.restitution;
                    if (json.body) {
                        this.body = new b2data.RigidBody();
                        this.body.loadFromJson(json.body);
                    }
                };
                PhysicsCollider.prototype.createShape = function (mainBody) {
                    return null;
                };
                PhysicsCollider.prototype.createShapes = function (mainBody) {
                    return [this.createShape(mainBody)];
                };
                PhysicsCollider.prototype.createFixtureDef = function () {
                    var def = new b2.FixtureDef();
                    def.density = this.density;
                    def.friction = this.friction;
                    def.isSensor = this.sensor;
                    def.restitution = this.restitution;
                    // def.filter.categoryBits = categoryBits ?? this.categoryBits
                    // def.filter.maskBits = maskBits ?? this.maskBits
                    // def.filter.groupIndex = groupIndex ?? this.groupIndex
                    var collisionGroup = this.parent.collisionGroup;
                    if (collisionGroup.enabled) {
                        def.filter.categoryBits = this.parent.collisionGroup.getCategoryBits();
                        def.filter.maskBits = this.parent.collisionGroup.getMaskBits();
                        def.filter.groupIndex = this.parent.collisionGroup.getGroupIndex();
                    }
                    return def;
                };
                PhysicsCollider.prototype.createFixture = function (zoneBody, fixtureDef, unionId) {
                    var fixture = zoneBody.CreateFixture(fixtureDef);
                    var userData = {
                        name: this.parent.name,
                        mid: this.oid,
                        oid: "unknown",
                        contacts: [],
                        unionId: unionId,
                        displayKey: this.displayKey,
                    };
                    fixture.SetUserData(userData);
                    return fixture;
                };
                PhysicsCollider.prototype.calcShaptPtInMainBody = function (mainBody, shapePt) {
                    return this.parent.calcShapePtInMainBody(mainBody, shapePt);
                };
                return PhysicsCollider;
            }(Collider));
            b2data.PhysicsCollider = PhysicsCollider;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** undefined */
            var PhysicsBoxCollider = /** @class */ (function (_super) {
                __extends(PhysicsBoxCollider, _super);
                function PhysicsBoxCollider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PhysicsBoxCollider.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.offset = b2data.Vec2.fromNumArray(json.offset['data']);
                    this.size = fsync.Size2.fromNumArray(json.size['data']);
                };
                PhysicsBoxCollider.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.offset, rptm);
                    fsync.Vector.multUpVar(this.size, rptm);
                };
                PhysicsBoxCollider.prototype.createShape = function (mainBody) {
                    var centerPt = this.calcShaptPtInMainBody(mainBody, this.offset);
                    var angle = this.getInUnionRotationZ();
                    var polygon = new b2.PolygonShape();
                    polygon.SetAsBox(this.size.width / 2, this.size.height / 2, new b2.Vec2(centerPt.x, centerPt.y), angle);
                    return polygon;
                };
                return PhysicsBoxCollider;
            }(b2data.PhysicsCollider));
            b2data.PhysicsBoxCollider = PhysicsBoxCollider;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** undefined */
            var PhysicsCircleCollider = /** @class */ (function (_super) {
                __extends(PhysicsCircleCollider, _super);
                function PhysicsCircleCollider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PhysicsCircleCollider.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.offset = b2data.Vec2.fromNumArray(json.offset['data']);
                    this.radius = json.radius;
                };
                PhysicsCircleCollider.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.offset, rptm);
                    this.radius = this.radius * rptm;
                };
                PhysicsCircleCollider.prototype.createShape = function (mainBody) {
                    var shapePtInMainBody = this.calcShaptPtInMainBody(mainBody, this.offset);
                    var cir = new b2.CircleShape();
                    // cir.m_p.Set(shapePtInMainBody.x, shapePtInMainBody.y)
                    cir.Set(new b2.Vec2(shapePtInMainBody.x, shapePtInMainBody.y), this.radius);
                    return cir;
                };
                return PhysicsCircleCollider;
            }(b2data.PhysicsCollider));
            b2data.PhysicsCircleCollider = PhysicsCircleCollider;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** undefined */
            var PhysicsPolygonCollider = /** @class */ (function (_super) {
                __extends(PhysicsPolygonCollider, _super);
                function PhysicsPolygonCollider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PhysicsPolygonCollider.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.offset = b2data.Vec2.fromNumArray(json.offset['data']);
                    this.points = json.points.map(function (vec) { return b2data.Vec2.fromNumArray(vec['data']); });
                };
                PhysicsPolygonCollider.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.offset, rptm);
                    this.points.map(function (pt) { return fsync.Vector.multUpVar(pt, rptm); });
                };
                PhysicsPolygonCollider.prototype.createShapes = function (mainBody) {
                    var shapes = [];
                    var points = this.points;
                    // check if last point equal to first point
                    if (points.length > 0 && fsync.Vector.equal(points[0], points[points.length - 1])) {
                        points.length -= 1;
                    }
                    var polys = b2data.tools.ConvexPartition(points);
                    var offset = this.offset;
                    for (var i = 0; i < polys.length; i++) {
                        var poly = polys[i];
                        var shape = null, vertices = [];
                        var firstVertice = null;
                        for (var j = 0, l = poly.length; j < l; j++) {
                            if (!shape) {
                                shape = new b2.PolygonShape();
                            }
                            var p = poly[j];
                            var x = (p.x + offset.x);
                            var y = (p.y + offset.y);
                            var newP = new b2.Vec2(x, y);
                            // //对点进行反转+旋转
                            // v.x = flip * v.x;
                            // {
                            // 	let cosInc = Math.cos(angle)
                            // 	let sinInc = Math.sin(angle)
                            // 	let x = cosInc * v.x - sinInc * v.y;
                            // 	let y = sinInc * v.x + cosInc * v.y;
                            // 	v.x = x;
                            // 	v.y = y;
                            // }
                            var v = this.calcShaptPtInMainBody(mainBody, b2data.Vec2.fromXYZLike(newP));
                            vertices.push(v);
                            if (!firstVertice) {
                                firstVertice = v;
                            }
                            if (vertices.length === b2.maxPolygonVertices) {
                                shape.Set(vertices, vertices.length);
                                shapes.push(shape);
                                shape = null;
                                if (j < l - 1) {
                                    vertices = [firstVertice, vertices[vertices.length - 1]];
                                }
                            }
                        }
                        if (shape) {
                            shape.Set(vertices, vertices.length);
                            shapes.push(shape);
                        }
                    }
                    return shapes;
                };
                return PhysicsPolygonCollider;
            }(b2data.PhysicsCollider));
            b2data.PhysicsPolygonCollider = PhysicsPolygonCollider;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en
            A prismatic joint. This joint provides one degree of freedom: translation
            along an axis fixed in rigidbody. Relative rotation is prevented. You can
            use a joint limit to restrict the range of motion and a joint motor to
            drive the motion or to model joint friction.
            !#zh
            移动关节指定了只能在一个方向上移动刚体。
            你可以开启关节限制来设置刚体运行移动的间距，也可以开启马达来使用关节马达驱动刚体的运行。 */
            var PrismaticJoint = /** @class */ (function (_super) {
                __extends(PrismaticJoint, _super);
                function PrismaticJoint() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PrismaticJoint.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.localAxisA = b2data.Vec2.fromNumArray(json.localAxisA["data"]);
                    this.referenceAngle = json.referenceAngle * b2data.ANGLE_TO_PHYSICS_ANGLE;
                    this.enableLimit = json.enableLimit;
                    this.enableMotor = json.enableMotor;
                    this.lowerLimit = json.lowerLimit;
                    this.upperLimit = json.upperLimit;
                    this.maxMotorForce = json.maxMotorForce;
                    this.motorSpeed = json.motorSpeed;
                };
                PrismaticJoint.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    this.lowerLimit = this.lowerLimit * rptm;
                    this.upperLimit = this.upperLimit * rptm;
                };
                PrismaticJoint.prototype.createJointDef = function (mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB) {
                    var def = new b2.PrismaticJointDef();
                    def.collideConnected = this.collideConnected;
                    def.enableMotor = this.enableMotor;
                    def.referenceAngle = this.referenceAngle;
                    def.motorSpeed = this.motorSpeed;
                    def.enableLimit = this.enableLimit;
                    def.lowerTranslation = this.lowerLimit;
                    def.upperTranslation = this.upperLimit;
                    def.maxMotorForce = this.maxMotorForce;
                    // {
                    // 	let selfX = flip * this.anchor.x
                    // 	let cosInc = Math.cos(angle)
                    // 	let sinInc = Math.sin(angle)
                    // 	let x = cosInc * selfX - sinInc * this.anchor.y;
                    // 	let y = sinInc * selfX + cosInc * this.anchor.y;
                    // 	def.localAnchorA.Set(flip * x, y)
                    // }
                    // {
                    // 	let targetX = flip * this.connectedAnchor.x
                    // 	let cosInc = Math.cos(angle)
                    // 	let sinInc = Math.sin(angle)
                    // 	let x = cosInc * targetX - sinInc * this.connectedAnchor.y;
                    // 	let y = sinInc * targetX + cosInc * this.connectedAnchor.y;
                    // 	def.localAnchorB.Set(flip * x, y)
                    // }
                    var anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor);
                    def.localAnchorA.Set(anchorA.x, anchorA.y);
                    var anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor);
                    def.localAnchorB.Set(anchorB.x, anchorB.y);
                    def.localAxisA.Set(this.getWorldFlipY() * this.localAxisA.x, this.localAxisA.y);
                    return def;
                };
                return PrismaticJoint;
            }(b2data.Joint));
            b2data.PrismaticJoint = PrismaticJoint;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en
            A revolute joint constrains two bodies to share a common point while they
            are free to rotate about the point. The relative rotation about the shared
            point is the joint angle. You can limit the relative rotation with
            a joint limit that specifies a lower and upper angle. You can use a motor
            to drive the relative rotation about the shared point. A maximum motor torque
            is provided so that infinite forces are not generated.
            !#zh
            旋转关节可以约束两个刚体围绕一个点来进行旋转。
            你可以通过开启关节限制来限制旋转的最大角度和最小角度。
            你可以通过开启马达来施加一个扭矩力来驱动这两个刚体在这一点上的相对速度。 */
            var RevoluteJoint = /** @class */ (function (_super) {
                __extends(RevoluteJoint, _super);
                function RevoluteJoint() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RevoluteJoint.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.referenceAngle = json.referenceAngle * b2data.ANGLE_TO_PHYSICS_ANGLE;
                    this.lowerAngle = json.lowerAngle * b2data.ANGLE_TO_PHYSICS_ANGLE;
                    this.upperAngle = json.upperAngle * b2data.ANGLE_TO_PHYSICS_ANGLE;
                    this.maxMotorTorque = json.maxMotorTorque;
                    this.motorSpeed = json.motorSpeed;
                    this.enableLimit = json.enableLimit;
                    this.enableMotor = json.enableMotor;
                };
                RevoluteJoint.prototype.createJointDef = function (mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB) {
                    var def = new b2.RevoluteJointDef();
                    def.referenceAngle = this.referenceAngle;
                    def.enableLimit = this.enableLimit;
                    def.lowerAngle = this.lowerAngle;
                    def.upperAngle = this.upperAngle;
                    def.collideConnected = this.collideConnected;
                    def.enableMotor = this.enableMotor;
                    def.maxMotorTorque = this.maxMotorTorque;
                    def.motorSpeed = this.motorSpeed;
                    // {
                    // 	let selfX = flip * this.anchor.x
                    // 	let cosInc = Math.cos(angle)
                    // 	let sinInc = Math.sin(angle)
                    // 	let x = cosInc * selfX - sinInc * this.anchor.y;
                    // 	let y = sinInc * selfX + cosInc * this.anchor.y;
                    // 	def.localAnchorA.Set(flip * x, y)
                    // }
                    // {
                    // 	let targetX = flip * this.connectedAnchor.x
                    // 	let cosInc = Math.cos(angle)
                    // 	let sinInc = Math.sin(angle)
                    // 	let x = cosInc * targetX - sinInc * this.connectedAnchor.y;
                    // 	let y = sinInc * targetX + cosInc * this.connectedAnchor.y;
                    // 	def.localAnchorB.Set(flip * x, y)
                    // }
                    var anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor);
                    def.localAnchorA.Set(anchorA.x, anchorA.y);
                    var anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor);
                    def.localAnchorB.Set(anchorB.x, anchorB.y);
                    // if (this.bodyA.isBox) {
                    // 	def.bodyA = mainBody;
                    // 	def.localAnchorA.SelfAddXY(isFlip ? -this.bodyA.position.x : this.bodyA.position.x, this.bodyA.position.y);
                    // } else {
                    // 	def.bodyA = this.findBodyByDef(world, this.bodyA)
                    // }
                    // if (this.bodyB.isBox) {
                    // 	def.bodyB = mainBody;
                    // 	def.localAnchorB.SelfAddXY(isFlip ? -this.bodyB.position.x : this.bodyB.position.x, this.bodyB.position.y);
                    // } else {
                    // 	def.bodyB = this.findBodyByDef(world, this.bodyB)
                    // }
                    return def;
                };
                return RevoluteJoint;
            }(b2data.Joint));
            b2data.RevoluteJoint = RevoluteJoint;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en Enum for RigidBodyType.
            !#zh 刚体类型 */
            var RigidBodyType;
            (function (RigidBodyType) {
                RigidBodyType[RigidBodyType["Static"] = 0] = "Static";
                RigidBodyType[RigidBodyType["Kinematic"] = 0] = "Kinematic";
                RigidBodyType[RigidBodyType["Dynamic"] = 0] = "Dynamic";
                RigidBodyType[RigidBodyType["Animated"] = 0] = "Animated";
            })(RigidBodyType = b2data.RigidBodyType || (b2data.RigidBodyType = {}));
            /** undefined */
            var RigidBody = /** @class */ (function (_super) {
                __extends(RigidBody, _super);
                function RigidBody() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RigidBody.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.enabledContactListener = json.enabledContactListener;
                    this.bullet = json.bullet;
                    this.type = json.type;
                    this.allowSleep = json.allowSleep;
                    this.gravityScale = json.gravityScale;
                    this.linearDamping = json.linearDamping;
                    this.angularDamping = json.angularDamping;
                    this.linearVelocity = b2data.Vec2.fromNumArray(json.linearVelocity['data']);
                    this.angularVelocity = json.angularVelocity * b2data.ANGLE_TO_PHYSICS_ANGLE;
                    this.fixedRotation = json.fixedRotation;
                    this.awake = json.awake;
                    this.awakeOnLoad = json.awakeOnLoad;
                    this.active = json.active;
                };
                RigidBody.prototype.updatePTMRatio = function () {
                    var rptm = 1 / this.getPTMRatio();
                    fsync.Vector.multUpVar(this.linearVelocity, rptm);
                };
                RigidBody.prototype.createBodyDef = function () {
                    var def = new b2.BodyDef();
                    def.linearVelocity.Set(this.linearVelocity.x, this.linearVelocity.y);
                    def.angularVelocity = this.angularVelocity;
                    def.linearDamping = this.linearDamping;
                    def.angularDamping = this.angularDamping;
                    def.allowSleep = this.allowSleep;
                    def.awake = this.awake;
                    def.fixedRotation = this.fixedRotation;
                    def.bullet = this.bullet;
                    // def.type = rtype == RigidBodyType.Dynamic ? b2.BodyType.b2_dynamicBody : (rtype == RigidBodyType.Kinematic ? b2.BodyType.b2_kinematicBody : b2.BodyType.b2_staticBody);
                    def.type = this.type;
                    def.active = this.active;
                    def.gravityScale = this.gravityScale;
                    return def;
                };
                RigidBody.prototype.createBody = function (name, world, zoneBodyDef, unionId) {
                    var zoneBody = world.CreateBody(zoneBodyDef);
                    var userData = {
                        name: name,
                        mid: this.oid,
                        oid: "unknown",
                        contacts: [],
                        unionId: unionId,
                    };
                    zoneBody.SetUserData(userData);
                    return zoneBody;
                };
                return RigidBody;
            }(b2data.Component));
            b2data.RigidBody = RigidBody;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en
            A weld joint essentially glues two bodies together. A weld joint may
            distort somewhat because the island constraint solver is approximate.
            !#zh
            熔接关节相当于将两个刚体粘在了一起。
            熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。 */
            var WeldJoint = /** @class */ (function (_super) {
                __extends(WeldJoint, _super);
                function WeldJoint() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WeldJoint.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.referenceAngle = json.referenceAngle;
                    this.frequency = json.frequency;
                    this.dampingRatio = json.dampingRatio;
                };
                WeldJoint.prototype.createJointDef = function (mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB) {
                    var def = new b2.WeldJointDef();
                    def.referenceAngle = this.referenceAngle;
                    def.frequencyHz = this.frequency;
                    def.dampingRatio = this.dampingRatio;
                    def.collideConnected = this.collideConnected;
                    var anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor);
                    def.localAnchorA.Set(anchorA.x, anchorA.y);
                    var anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor);
                    def.localAnchorB.Set(anchorB.x, anchorB.y);
                    return def;
                };
                return WeldJoint;
            }(b2data.Joint));
            b2data.WeldJoint = WeldJoint;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var box2d;
    (function (box2d) {
        var b2data;
        (function (b2data) {
            /** !#en
            A wheel joint. This joint provides two degrees of freedom: translation
            along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
            the rotation or to model rotational friction.
            This joint is designed for vehicle suspensions.
            !#zh
            轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
            你可以通过开启关节马达来使用马达驱动刚体的旋转。
            轮组关节是专门为机动车类型设计的。 */
            var WheelJoint = /** @class */ (function (_super) {
                __extends(WheelJoint, _super);
                function WheelJoint() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WheelJoint.prototype.loadFromJson = function (json) {
                    _super.prototype.loadFromJson.call(this, json);
                    this.localAxisA = b2data.Vec2.fromNumArray(json.localAxisA['data']);
                    this.maxMotorTorque = json.maxMotorTorque;
                    this.motorSpeed = json.motorSpeed;
                    this.enableMotor = json.enableMotor;
                    this.frequency = json.frequency;
                    this.dampingRatio = json.dampingRatio;
                };
                WheelJoint.prototype.createJointDef = function (mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB) {
                    var def = new b2.WheelJointDef();
                    def.frequencyHz = this.frequency;
                    def.dampingRatio = this.dampingRatio;
                    def.collideConnected = this.collideConnected;
                    def.enableMotor = this.enableMotor;
                    def.maxMotorTorque = this.maxMotorTorque;
                    def.motorSpeed = this.motorSpeed;
                    // {
                    // 	let selfX = flip * this.anchor.x
                    // 	let cosInc = Math.cos(angle)
                    // 	let sinInc = Math.sin(angle)
                    // 	let x = cosInc * selfX - sinInc * this.anchor.y;
                    // 	let y = sinInc * selfX + cosInc * this.anchor.y;
                    // 	def.localAnchorA.Set(flip * x + offsetA.x, y + offsetA.y)
                    // }
                    // {
                    // 	// let targetX = flip * this.connectedAnchor.x
                    // 	// let cosInc = Math.cos(angle)
                    // 	// let sinInc = Math.sin(angle)
                    // 	// let x = cosInc * targetX - sinInc * this.connectedAnchor.y;
                    // 	// let y = sinInc * targetX + cosInc * this.connectedAnchor.y;
                    // 	def.localAnchorB.Set(offsetB.x + 0.4, offsetB.y)
                    // }
                    var anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor);
                    def.localAnchorA.Set(anchorA.x, anchorA.y);
                    var anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor);
                    def.localAnchorB.Set(anchorB.x, anchorB.y);
                    def.localAxisA.Set(this.getWorldFlipY() * this.localAxisA.x, this.localAxisA.y);
                    return def;
                };
                return WheelJoint;
            }(b2data.Joint));
            b2data.WheelJoint = WheelJoint;
        })(b2data = box2d.b2data || (box2d.b2data = {}));
    })(box2d = fsync.box2d || (fsync.box2d = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var LongHelper = /** @class */ (function () {
        function LongHelper() {
        }
        LongHelper.toNumber = function (n) {
            if (typeof (n) == "number") {
                return n;
            }
            else {
                return n.toNumber();
            }
        };
        return LongHelper;
    }());
    fsync.LongHelper = LongHelper;
})(fsync || (fsync = {}));
var lang;
(function (lang) {
    var helper;
    (function (helper) {
        var TArrayHelper = /** @class */ (function () {
            function TArrayHelper() {
            }
            TArrayHelper.prototype.max = function (ls, call) {
                var maxValue = -Infinity;
                var maxEle = ls[0];
                for (var _i = 0, ls_1 = ls; _i < ls_1.length; _i++) {
                    var e = ls_1[_i];
                    var value = call(e);
                    if (maxValue <= value) {
                        maxValue = value;
                        maxEle = e;
                    }
                }
                return maxEle;
            };
            TArrayHelper.prototype.min = function (ls, call) {
                var minValue = Infinity;
                var minEle = ls[0];
                for (var _i = 0, ls_2 = ls; _i < ls_2.length; _i++) {
                    var e = ls_2[_i];
                    var value = call(e);
                    if (minValue >= value) {
                        minValue = value;
                        minEle = e;
                    }
                }
                return minEle;
            };
            TArrayHelper.prototype.remove = function (ls, e) {
                var index = ls.indexOf(e);
                if (index >= 0) {
                    ls.splice(index, 1);
                }
            };
            /**
             * 求出两列中差异的部分
             * @param ls1
             * @param idGetter1
             * @param ls2
             * @param idGetter2
             * @param call
             */
            TArrayHelper.prototype.foreachDifferentPairs = function (ls1, idGetter1, ls2, idGetter2, call) {
                var ls1Map = lang.EmptyTable();
                var ls2Map = lang.EmptyTable();
                ls1.forEach(function (e) {
                    var id = idGetter1(e);
                    ls1Map[id] = e;
                });
                ls2.forEach(function (e) {
                    var id = idGetter2(e);
                    ls2Map[id] = e;
                });
                for (var id in ls1Map) {
                    var e1 = ls1Map[id];
                    var e2 = ls2Map[id];
                    call(e1, e2);
                }
                for (var id in ls2Map) {
                    var e1 = ls1Map[id];
                    var e2 = ls2Map[id];
                    if (!(id in ls1Map)) {
                        call(e1, e2);
                    }
                }
            };
            TArrayHelper.prototype.sum = function (ls, call) {
                if (!call) {
                    var n = 0;
                    for (var _i = 0, ls_3 = ls; _i < ls_3.length; _i++) {
                        var m = ls_3[_i];
                        n += this.autoParseNumber(m);
                    }
                    return n;
                }
                else {
                    var n = 0;
                    for (var _a = 0, ls_4 = ls; _a < ls_4.length; _a++) {
                        var m = ls_4[_a];
                        var ret = call(m);
                        if (typeof (ret) == "number") {
                            n += ret;
                        }
                    }
                    return n;
                }
            };
            TArrayHelper.prototype.autoParseNumber = function (m) {
                if (typeof (m) == "number") {
                    return m;
                }
                else if (typeof (m) == "string") {
                    return parseFloat(m);
                }
                else {
                    return m;
                }
            };
            TArrayHelper.prototype.average = function (ls, call) {
                if (ls.length == 0) {
                    return 0;
                }
                if (!call) {
                    var n = 0;
                    for (var _i = 0, ls_5 = ls; _i < ls_5.length; _i++) {
                        var m = ls_5[_i];
                        n += this.autoParseNumber(m);
                    }
                    var ave = n / ls.length;
                    return ave;
                }
                else {
                    var count = 0;
                    var n = 0;
                    for (var _a = 0, ls_6 = ls; _a < ls_6.length; _a++) {
                        var m = ls_6[_a];
                        var ret = call(m);
                        if (typeof (ret) == "number") {
                            n += ret;
                            count++;
                        }
                    }
                    var ave = n / count;
                    return ave;
                }
            };
            return TArrayHelper;
        }());
        helper.TArrayHelper = TArrayHelper;
        helper.ArrayHelper = new TArrayHelper();
    })(helper = lang.helper || (lang.helper = {}));
})(lang || (lang = {}));
var lang;
(function (lang) {
    var helper;
    (function (helper) {
        var TMapArrayHelper = /** @class */ (function () {
            function TMapArrayHelper() {
            }
            TMapArrayHelper.prototype.filter = function (m, call) {
                var ls = [];
                for (var key in m) {
                    var v = m[key];
                    if (call(v, key)) {
                        ls.push(v);
                    }
                }
                return ls;
            };
            return TMapArrayHelper;
        }());
        helper.TMapArrayHelper = TMapArrayHelper;
        helper.MapArrayHelper = new TMapArrayHelper();
    })(helper = lang.helper || (lang.helper = {}));
})(lang || (lang = {}));
var lang;
(function (lang) {
    lang.EmptyCall = function () { };
    lang.EmptyTable = function () {
        return Object.create(null);
        // return {}
    };
    function Clean(container) {
        if (container == null) {
            return container;
        }
        if (container instanceof Array) {
            container.length = 0;
        }
        else {
            for (var _i = 0, _a = Object.keys(container); _i < _a.length; _i++) {
                var key = _a[_i];
                delete container[key];
            }
        }
        return container;
    }
    lang.Clean = Clean;
    function CleanTable(container) {
        if (container == null) {
            return lang.EmptyTable();
        }
        else {
            return Clean(container);
        }
    }
    lang.CleanTable = CleanTable;
    function CleanArray(container) {
        if (container == null) {
            return [];
        }
        else {
            return Clean(container);
        }
    }
    lang.CleanArray = CleanArray;
    var _copyDataDeep = function (source, target) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(source); _i < _a.length; _i++) {
            var key = _a[_i];
            // 清除溢出字段
            if (target[key] == null) {
                delete source[key];
            }
        }
        for (var _b = 0, _c = Object.getOwnPropertyNames(target); _b < _c.length; _b++) {
            var key = _c[_b];
            var tvalue = target[key];
            if (tvalue == null) {
                source[key] = target[key];
            }
            else if (typeof (tvalue) == "object") {
                var svalue = source[key];
                if (typeof (svalue) != "object" || svalue == tvalue) {
                    // 指向同一个对象或空，则重新创建新的
                    svalue = {};
                    source[key] = svalue;
                }
                _copyDataDeep(svalue, tvalue);
            }
            else {
                if (source[key] != target[key]) {
                    source[key] = target[key];
                }
            }
        }
    };
    var ObjectUtils = /** @class */ (function () {
        function ObjectUtils() {
        }
        /**
         * 深度复制
         * @param source
         * @param target
         */
        ObjectUtils.copyDataDeep = function (source, target) {
            if (target == null) {
                return null;
            }
            else if (typeof (source) == "object" && typeof (target) == "object") {
                _copyDataDeep(source, target);
                return source;
            }
            else {
                return target;
            }
        };
        /**
         * 浅克隆对象
         * @param source
         */
        ObjectUtils.clone = function (source) {
            var target = lang.EmptyTable();
            for (var key in source) {
                target[key] = source[key];
            }
            Object.setPrototypeOf(target, Object.getPrototypeOf(source));
            return target;
        };
        ObjectUtils.values = function (source) {
            if (Object.values) {
                return Object.values(source);
            }
            var values = [];
            for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
                var key = _a[_i];
                values.push(source[key]);
            }
            return values;
        };
        return ObjectUtils;
    }());
    lang.ObjectUtils = ObjectUtils;
})(lang || (lang = {}));
/// <reference path="../lang/ArrayHelper.ts" />
/// <reference path="../lang/MapHelper.ts" />
/// <reference path="../lang/ObjectUtils.ts" />
var fsync;
(function (fsync) {
    fsync.ArrayHelper = lang.helper.ArrayHelper;
    fsync.MapArrayHelper = lang.helper.MapArrayHelper;
    fsync.EmptyCall = lang.EmptyCall;
    fsync.EmptyTable = lang.EmptyTable;
    fsync.CleanTable = lang.CleanTable;
    fsync.CleanArray = lang.CleanArray;
    fsync.ObjectUtils = lang.ObjectUtils;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var BufferHelper = /** @class */ (function () {
        function BufferHelper() {
        }
        BufferHelper.concatUint8Array = function (ls) {
            var len = 0;
            for (var _i = 0, ls_7 = ls; _i < ls_7.length; _i++) {
                var b = ls_7[_i];
                len += b.length;
            }
            var m = new Uint8Array(len);
            var i = 0;
            for (var _a = 0, ls_8 = ls; _a < ls_8.length; _a++) {
                var b = ls_8[_a];
                for (var j = 0; j < b.length; j++) {
                    m[i++] = b[j];
                }
            }
            return m;
        };
        BufferHelper.from = function (str, encoding) {
            if (encoding === void 0) { encoding = undefined; }
            function asciiToBytes(str) {
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                    // Node's code seems to be doing this and not & 0x7F..
                    byteArray.push(str.charCodeAt(i) & 0xFF);
                }
                return byteArray;
            }
            function utf16leToBytes(str, units) {
                var c, hi, lo;
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                    if ((units -= 2) < 0)
                        break;
                    c = str.charCodeAt(i);
                    hi = c >> 8;
                    lo = c % 256;
                    byteArray.push(lo);
                    byteArray.push(hi);
                }
                return byteArray;
            }
            function numberIsNaN(obj) {
                // For IE11 support
                return obj !== obj; // eslint-disable-line no-self-compare
            }
            function blitBuffer(src, dst, offset, length) {
                for (var i = 0; i < length; ++i) {
                    if ((i + offset >= dst.length) || (i >= src.length))
                        break;
                    dst[i + offset] = src[i];
                }
                return i;
            }
            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                if (!length) {
                    length = remaining;
                }
                else {
                    length = Number(length);
                    if (length > remaining) {
                        length = remaining;
                    }
                }
                var strLen = string.length;
                if (length > strLen / 2) {
                    length = strLen / 2;
                }
                for (var i = 0; i < length; ++i) {
                    var parsed = parseInt(string.substr(i * 2, 2), 16);
                    if (numberIsNaN(parsed))
                        return i;
                    buf[offset + i] = parsed;
                }
                return i;
            }
            function utf8Write(buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
            }
            function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length);
            }
            function latin1Write(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length);
            }
            function base64Write(buf, string, offset, length) {
                // return blitBuffer(base64ToBytes(string), buf, offset, length)
                throw new Error("unsupport function: base64Write");
            }
            function ucs2Write(buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
            }
            function write(buf, string, offset, length, encoding) {
                if (length === void 0) { length = undefined; }
                if (encoding === void 0) { encoding = undefined; }
                // Buffer#write(string)
                if (offset === undefined) {
                    encoding = 'utf8';
                    length = buf.length;
                    offset = 0;
                    // Buffer#write(string, encoding)
                }
                else if (length === undefined && typeof offset === 'string') {
                    encoding = offset;
                    length = buf.length;
                    offset = 0;
                    // Buffer#write(string, offset[, length][, encoding])
                }
                else if (isFinite(offset)) {
                    offset = offset >>> 0;
                    if (isFinite(length)) {
                        length = length >>> 0;
                        if (encoding === undefined)
                            encoding = 'utf8';
                    }
                    else {
                        encoding = length;
                        length = undefined;
                    }
                }
                else {
                    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                }
                var remaining = buf.length - offset;
                if (length === undefined || length > remaining)
                    length = remaining;
                if ((string.length > 0 && (length < 0 || offset < 0)) || offset > buf.length) {
                    throw new RangeError('Attempt to write outside buffer bounds');
                }
                if (!encoding)
                    encoding = 'utf8';
                var loweredCase = false;
                for (;;) {
                    switch (encoding) {
                        case 'hex':
                            return hexWrite(buf, string, offset, length);
                        case 'utf8':
                        case 'utf-8':
                            return utf8Write(buf, string, offset, length);
                        case 'ascii':
                            return asciiWrite(buf, string, offset, length);
                        case 'latin1':
                        case 'binary':
                            return latin1Write(buf, string, offset, length);
                        case 'base64':
                            // Warning: maxLength not taken into account in base64Write
                            return base64Write(buf, string, offset, length);
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return ucs2Write(buf, string, offset, length);
                        default:
                            if (loweredCase)
                                throw new TypeError('Unknown encoding: ' + encoding);
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                    }
                }
            }
            function utf8ToBytes(str, units) {
                if (units === void 0) { units = undefined; }
                units = units || Infinity;
                var codePoint;
                var length = str.length;
                var leadSurrogate = null;
                var bytes = [];
                for (var i = 0; i < length; ++i) {
                    codePoint = str.charCodeAt(i);
                    // is surrogate component
                    if (codePoint > 0xD7FF && codePoint < 0xE000) {
                        // last char was a lead
                        if (!leadSurrogate) {
                            // no lead yet
                            if (codePoint > 0xDBFF) {
                                // unexpected trail
                                if ((units -= 3) > -1)
                                    bytes.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            else if (i + 1 === length) {
                                // unpaired lead
                                if ((units -= 3) > -1)
                                    bytes.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            // valid lead
                            leadSurrogate = codePoint;
                            continue;
                        }
                        // 2 leads in a row
                        if (codePoint < 0xDC00) {
                            if ((units -= 3) > -1)
                                bytes.push(0xEF, 0xBF, 0xBD);
                            leadSurrogate = codePoint;
                            continue;
                        }
                        // valid surrogate pair
                        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                    }
                    else if (leadSurrogate) {
                        // valid bmp char, but last char was a lead
                        if ((units -= 3) > -1)
                            bytes.push(0xEF, 0xBF, 0xBD);
                    }
                    leadSurrogate = null;
                    // encode utf8
                    if (codePoint < 0x80) {
                        if ((units -= 1) < 0)
                            break;
                        bytes.push(codePoint);
                    }
                    else if (codePoint < 0x800) {
                        if ((units -= 2) < 0)
                            break;
                        bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
                    }
                    else if (codePoint < 0x10000) {
                        if ((units -= 3) < 0)
                            break;
                        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
                    }
                    else if (codePoint < 0x110000) {
                        if ((units -= 4) < 0)
                            break;
                        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
                    }
                    else {
                        throw new Error('Invalid code point');
                    }
                }
                return bytes;
            }
            function byteLength(string, encoding) {
                var len = string.length;
                var mustMatch = (arguments.length > 2 && arguments[2] === true);
                if (!mustMatch && len === 0)
                    return 0;
                // Use a for loop to avoid recursion
                var loweredCase = false;
                for (;;) {
                    switch (encoding) {
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                            return len;
                        case 'utf8':
                        case 'utf-8':
                            return utf8ToBytes(string).length;
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return len * 2;
                        case 'hex':
                            return len >>> 1;
                        case 'base64':
                            // return base64ToBytes(string).length
                            throw new Error("byteLength: unsupport encoding: base64");
                        default:
                            if (loweredCase) {
                                return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
                            }
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                    }
                }
            }
            function isEncoding(encoding) {
                switch (String(encoding).toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                        return true;
                    default:
                        return false;
                }
            }
            var K_MAX_LENGTH = 0x7fffffff;
            function createBuffer(length) {
                if (length > K_MAX_LENGTH) {
                    throw new RangeError('The value "' + length + '" is invalid for option "size"');
                }
                // Return an augmented `Uint8Array` instance
                var buf = new Uint8Array(length);
                return buf;
            }
            if (typeof encoding !== 'string' || encoding === '') {
                encoding = 'utf8';
            }
            if (!isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding);
            }
            var length = byteLength(str, encoding) | 0;
            var buf = createBuffer(length);
            var actual = write(buf, str, encoding);
            if (actual !== length) {
                // Writing a hex string, for example, that contains invalid characters will
                // cause everything after the first invalid character to be ignored. (e.g.
                // 'abxxcd' will be treated as 'ab')
                buf = buf.slice(0, actual);
            }
            return buf;
        };
        return BufferHelper;
    }());
    fsync.BufferHelper = BufferHelper;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    fsync.supportClassProguard = true;
    fsync.detectClassProguard = function (name, cls) {
        if (cls != null) {
            if (cls.name != name) {
                fsync.supportClassProguard = false;
            }
        }
    };
    fsync.setSupportClassProguard = function (support) {
        fsync.supportClassProguard = fsync.supportClassProguard && support;
    };
    var _$ZAZ = /** @class */ (function () {
        function _$ZAZ() {
        }
        return _$ZAZ;
    }());
    var ZAZClsName = _$ZAZ.name;
    // 检测内部类名混淆
    fsync.detectClassProguard("_$ZAZ", _$ZAZ);
    /**
     * 自定义类名反射
     * @param name
     */
    function cname(name) {
        return function (cls) {
            if (!fsync.supportClassProguard) {
                Object.defineProperty(cls, "name", {
                    value: name,
                    writable: false,
                });
            }
            return cls;
        };
    }
    fsync.cname = cname;
    var uid = 0;
    /**
     * 自动录入唯一类名
     */
    function cid(cls) {
        if (!fsync.supportClassProguard) {
            uid++;
            Object.defineProperty(cls, "name", {
                value: "cid" + uid + "n",
                writable: false,
            });
        }
        return cls;
    }
    fsync.cid = cid;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    function assert(cond, tip) {
        if (!cond) {
            throw new Error(tip);
        }
        return cond;
    }
    fsync.assert = assert;
    function assert_true(cond) {
        if (!cond) {
            throw new Error(TestHelper.UNMATCHED_RESULT);
        }
        return cond;
    }
    fsync.assert_true = assert_true;
    function assert_equal(a, b) {
        if (a != b) {
            throw new Error(TestHelper.UNMATCHED_RESULT + (": " + a + " <- " + b));
        }
    }
    fsync.assert_equal = assert_equal;
    function shall_crash(f) {
        var broken = false;
        try {
            f();
        }
        catch (e) {
            broken = true;
        }
        if (!broken) {
            throw new Error("function shall crash");
        }
    }
    fsync.shall_crash = shall_crash;
    var TestHelper = /** @class */ (function () {
        function TestHelper() {
        }
        TestHelper.UNMATCHED_RESULT = "unmatched result";
        return TestHelper;
    }());
    fsync.TestHelper = TestHelper;
    function testfunc(target, propName) {
        var funRaw = target[propName];
        var className = target.constructor.name;
        target[propName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                console.log("\n=================================");
                console.log(className + "-" + propName + " TESTING");
                var ret = funRaw.apply(this, args);
                console.log(className + "-" + propName + " PASSED");
                console.log("=================================\n");
                return ret;
            }
            catch (e) {
                console.error(e);
                console.log(className + "-" + propName + " FAILED");
                console.log("=================================\n");
            }
        };
        return target[propName];
    }
    fsync.testfunc = testfunc;
    function test_entry(desc, fun) {
        console.log("==>> test entry<" + desc + "> BEGIN");
        fun();
        console.log("==<< test entry<" + desc + "> PASS");
    }
    fsync.test_entry = test_entry;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Intervals = /** @class */ (function () {
        function Intervals() {
            this.sw = { on: true };
        }
        Intervals.prototype.init = function () {
            this.intervals = [];
            this.timeouts = [];
            return this;
        };
        Intervals.prototype.setInterval = function (call, duration) {
            var sw = this.sw;
            this.intervals.push(setInterval(function () {
                if (sw.on == false) {
                    return;
                }
                call();
            }, duration));
        };
        Intervals.prototype.clearAllInterval = function () {
            this.sw.on = false;
            for (var _i = 0, _a = this.intervals; _i < _a.length; _i++) {
                var id = _a[_i];
                clearInterval(id);
            }
            this.sw = { on: true };
            this.intervals.length = 0;
        };
        Intervals.prototype.setTimeout = function (call, duration) {
            this.timeouts.push(setTimeout(call, duration));
        };
        Intervals.prototype.clearAllTimeout = function () {
            for (var _i = 0, _a = this.timeouts; _i < _a.length; _i++) {
                var id = _a[_i];
                clearTimeout(id);
            }
            this.timeouts.length = 0;
        };
        Intervals.prototype.clearAllTimer = function () {
            this.clearAllInterval();
            this.clearAllTimeout();
        };
        Intervals.inst = new Intervals().init();
        return Intervals;
    }());
    fsync.Intervals = Intervals;
})(fsync || (fsync = {}));
(function () {
    var p = Array.prototype;
    function define(name, func) {
        if (p[name] != null) {
            return;
        }
        try {
            Object.defineProperty(p, name, {
                value: func,
                enumerable: false
            });
        }
        catch (e) {
        }
    }
    define("remove", function (value) {
        var index = this.indexOf(value);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    });
    define("sum", function (callback) {
        var sum = 0;
        for (var i = 0; i < this.length; i++) {
            var element = this[i];
            var value = callback(element);
            sum += value;
        }
        return sum;
    });
    define("pushList", function (array) {
        this.push.apply(this, array);
        return this;
    });
    define("unpack", function () {
        if (this[0] instanceof Array == false)
            return this;
        var a = this[0];
        for (var i = 1; i < this.length; i++) {
            a = a.concat(this[i]);
        }
        return a;
    });
    define("find", function (callback, thisArg) {
        for (var i = 1; i < this.length; i++) {
            var e = callback(this[i], i, this);
            if (typeof (e) == "undefined") {
                e = thisArg;
            }
            if (!!e) {
                return this[i];
            }
        }
        return undefined;
    });
    define("clear", function () {
        return this.length = 0;
    });
    define("contains", function (e) {
        return this.indexOf(e) != -1;
    });
    define("copyTo", function (e, start) {
        for (var i = 0; i < this.length; i++) {
            e[start + i] = this[i];
        }
    });
})();
var fsync;
(function (fsync) {
    /**
     * 反转 MyPromise
     * - 外部调用 success时相当于调用了 resolve
     * - 外部调用 fail 时，相当于调用了 reject
     * @param T - resolve 参数类型
     * @param F - reject 参数类型
     */
    var YmPromise = /** @class */ (function () {
        function YmPromise(params) {
            this.init(params);
        }
        YmPromise.prototype.init = function (params) {
            var _this = this;
            this.promise = new Promise(function (resolve, reject) {
                _this.success = resolve;
                _this.fail = reject;
            });
        };
        return YmPromise;
    }());
    fsync.YmPromise = YmPromise;
    var RPromise = /** @class */ (function (_super) {
        __extends(RPromise, _super);
        function RPromise() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RPromise;
    }(YmPromise));
    fsync.RPromise = RPromise;
})(fsync || (fsync = {}));
var slib;
(function (slib) {
    var SimpleEvent = /** @class */ (function () {
        function SimpleEvent() {
            this._callbacks = [];
        }
        SimpleEvent.prototype.on = function (callback) {
            this._callbacks.push(callback);
        };
        SimpleEvent.prototype.off = function (callback) {
            // this._callbacks.remove(callback)
            lang.helper.ArrayHelper.remove(this._callbacks, callback);
        };
        SimpleEvent.prototype.emit = function (value) {
            this._callbacks.concat().forEach(function (callback) {
                callback(value);
            });
        };
        return SimpleEvent;
    }());
    slib.SimpleEvent = SimpleEvent;
    var SEvent = /** @class */ (function () {
        function SEvent() {
            this._events = Object.create(null);
        }
        SEvent.prototype.on = function (key, callback) {
            if (!this._events[key]) {
                this._events[key] = new SimpleEvent();
            }
            var event = this._events[key];
            if (event) {
                event.on(callback);
            }
        };
        SEvent.prototype.once = function (key, callback) {
            var _this = this;
            var call = function (evt) {
                _this.off(key, call);
                callback(evt);
            };
            this.on(key, call);
        };
        SEvent.prototype.off = function (key, callback) {
            if (callback == undefined) {
                delete this._events[key];
            }
            else {
                var event_1 = this._events[key];
                if (event_1) {
                    event_1.off(callback);
                }
            }
        };
        SEvent.prototype.emit = function (key, value) {
            if (this._events[key]) {
                var event_2 = this._events[key];
                if (event_2) {
                    event_2.emit(value);
                }
            }
        };
        return SEvent;
    }());
    slib.SEvent = SEvent;
})(slib || (slib = {}));
/// <reference path="../lang/ArrayHelper.ts" />
/// <reference path="../lang/ObjectUtils.ts" />
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var DataClass = /** @class */ (function () {
            function DataClass() {
            }
            DataClass.prototype.init = function () {
                return this;
            };
            /**
             * 数据无效,已释放
             */
            DataClass.prototype.isNull = function () {
                return !this.dataManager.existsData(this);
            };
            /**
             * 数据有效
             */
            DataClass.prototype.isNotNull = function () {
                return this.dataManager.existsData(this);
            };
            return DataClass;
        }());
        eds.DataClass = DataClass;
        var DataClassDef = /** @class */ (function (_super) {
            __extends(DataClassDef, _super);
            function DataClassDef() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DataClassDef;
        }(DataClass));
        eds.DataClassDef = DataClassDef;
        // export const NullOID = EmptyTable()
        eds._NullData = new DataClassDef();
        Object.defineProperty(eds._NullData, "oid", {
            value: undefined,
            writable: false,
            enumerable: false,
        });
        Object.defineProperty(eds._NullData, 'otype', {
            value: "NullData",
            writable: false,
            enumerable: false,
        });
        function NullData(cls) {
            return eds._NullData;
        }
        eds.NullData = NullData;
        function NewData(cls) {
            var typeData = new DataClassDef();
            typeData.t = cls;
            return typeData;
        }
        eds.NewData = NewData;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var DataFeature = /** @class */ (function () {
            function DataFeature() {
            }
            return DataFeature;
        }());
        eds.DataFeature = DataFeature;
        var doFilter = function (filter, data) {
            var b = true;
            if (filter.filter) {
                b = b && filter.filter(data);
            }
            if (filter.includes) {
                for (var _i = 0, _a = filter.includes; _i < _a.length; _i++) {
                    var include = _a[_i];
                    b = b && doFilter(include, data);
                }
            }
            if (filter.excludes) {
                for (var _b = 0, _c = filter.excludes; _b < _c.length; _b++) {
                    var exclude = _c[_b];
                    b = b && !doFilter(exclude, data);
                }
            }
            return b;
        };
        var DataFeatureHelper = /** @class */ (function () {
            function DataFeatureHelper() {
            }
            DataFeatureHelper.doFilter = doFilter;
            return DataFeatureHelper;
        }());
        eds.DataFeatureHelper = DataFeatureHelper;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
/// <reference path="DataFeature.ts" />
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var doFilter = eds.DataFeatureHelper.doFilter;
        var DataContainer = /** @class */ (function () {
            function DataContainer() {
            }
            DataContainer.prototype.clearEntities = function () {
                this.init();
            };
            DataContainer.prototype.init = function () {
                if (this.allDatas) {
                    this.allDatas.length = 0;
                }
                else {
                    this.allDatas = [];
                }
                this.referRelationMap = fsync.EmptyTable();
                this.dataMap = fsync.EmptyTable();
                this.usingFeatures = fsync.EmptyTable();
                this.featureCache = fsync.EmptyTable();
                this.featureCacheMap = fsync.EmptyTable();
                return this;
            };
            /**
             * 构建引用依赖表
             */
            DataContainer.prototype.buildReferRelationMap = function () {
                var referRelationMap = this.referRelationMap;
                var dataMap = this.dataMap;
                this.allDatas.forEach(function (data) {
                    var oid = data.oid;
                    if (referRelationMap[oid]) {
                        referRelationMap[oid].length = 0;
                    }
                    else {
                        referRelationMap[oid] = [];
                    }
                });
                this.allDatas.forEach(function (data) {
                    var oid = data.oid;
                    for (var _i = 0, _a = Object.getOwnPropertyNames(data); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (key.startsWith("__")) {
                            var testOid = data[key];
                            if (dataMap[testOid]) {
                                referRelationMap[testOid].push(oid);
                            }
                        }
                    }
                });
            };
            /**
             * gc释放
             */
            DataContainer.prototype.cleanUnused = function () {
                var referRelationMap = this.referRelationMap;
                for (var key in referRelationMap) {
                    var group = referRelationMap[key];
                    if (group.length === 0) {
                        var data = this.getDataById(key);
                        this.deattach(data);
                    }
                }
            };
            DataContainer.prototype.clearDatas = function () {
                this.init();
            };
            DataContainer.prototype.forEachDatas = function (call) {
                this.allDatas.forEach(call);
            };
            DataContainer.prototype.existsData = function (ecsdata) {
                return !!this.dataMap[ecsdata.oid];
            };
            DataContainer.prototype.getDataById = function (oid) {
                return this.dataMap[oid];
            };
            DataContainer.prototype.attach = function (data) {
                if (!this.dataMap[data.oid]) {
                    this.dataMap[data.oid] = data;
                    this.allDatas.push(data);
                    this.presetDataFeature(data);
                }
                return data;
            };
            DataContainer.prototype.deattach = function (data) {
                var key = data.oid;
                var dataMap = this.dataMap;
                if (dataMap[key]) {
                    var data_1 = dataMap[key];
                    this.cleanDataFeature(data_1);
                    // this.allDatas.remove(data)
                    fsync.ArrayHelper.remove(this.allDatas, data_1);
                    delete dataMap[key];
                    delete data_1["dataManager"];
                }
            };
            /**
             * 更新该数据的特征组缓存
             * @param data
             */
            DataContainer.prototype.presetDataFeature = function (data) {
                var featureCache = this.featureCache;
                var featureCacheMap = this.featureCacheMap;
                for (var key in this.usingFeatures) {
                    var feature = this.usingFeatures[key];
                    var b = doFilter(feature, data);
                    if (b) {
                        var cacheKey = feature.name;
                        var ls = featureCache[cacheKey];
                        var map = featureCacheMap[cacheKey];
                        ls.push(data);
                        map[data.oid] = data;
                    }
                }
            };
            /**
             * 清除该数据的特征组缓存
             * @param data
             */
            DataContainer.prototype.cleanDataFeature = function (data) {
                var featureCache = this.featureCache;
                var featureCacheMap = this.featureCacheMap;
                for (var key in this.usingFeatures) {
                    var feature = this.usingFeatures[key];
                    var cacheKey = feature.name;
                    var ls = featureCache[cacheKey];
                    var map = featureCacheMap[cacheKey];
                    // ls.remove(data)
                    fsync.ArrayHelper.remove(ls, data);
                    delete map[data.oid];
                }
            };
            /**
             * 构建特征群组
             */
            DataContainer.prototype.buildFeatureGroups = function (features) {
                var _this = this;
                var featureCache = this.featureCache;
                var featureCacheMap = this.featureCacheMap;
                // 生成默认的类映射
                this.forEachDatas(function (data) {
                    var key = data.otype;
                    if (featureCache[key]) {
                        featureCache[key].length = 0;
                    }
                    else {
                        featureCache[key] = [];
                    }
                    featureCacheMap[key] = fsync.EmptyTable();
                });
                this.forEachDatas(function (data) {
                    var key = data.otype;
                    featureCache[key].push(data);
                    featureCacheMap[key][data.oid] = data;
                });
                // 生成features的类映射
                features.forEach(function (feature) {
                    var key = feature.name;
                    if (featureCache[key]) {
                        featureCache[key].length = 0;
                    }
                    else {
                        featureCache[key] = [];
                    }
                    featureCacheMap[key] = fsync.EmptyTable();
                });
                features.forEach(function (feature) {
                    _this._buildFeatureGroup(feature, feature.name);
                });
            };
            /**
             * 添加需要持续缓存的特征
             * @param feature
             */
            DataContainer.prototype.addFeature = function (feature) {
                this.usingFeatures[feature.name] = feature;
            };
            DataContainer.prototype._buildFeatureGroup = function (feature, key) {
                this.addFeature(feature);
                var featureCache = this.featureCache;
                var featureCacheMap = this.featureCacheMap;
                var ls = featureCache[key];
                var map = featureCacheMap[key];
                this.forEachDatas(function (data) {
                    var b = doFilter(feature, data);
                    if (b) {
                        ls.push(data);
                        map[data.oid] = data;
                    }
                });
                return ls;
            };
            /**
             * 构建特征组
             * @param feature
             * @param key
             */
            DataContainer.prototype.buildFeatureGroup = function (feature, key) {
                var featureCache = this.featureCache;
                var featureCacheMap = this.featureCacheMap;
                key = key || feature.name;
                if (featureCache[key]) {
                    featureCache[key].length = 0;
                }
                else {
                    featureCache[key] = [];
                }
                featureCacheMap[key] = fsync.EmptyTable();
                var group = this._buildFeatureGroup(feature, key);
                return group;
            };
            /**
             * 添加特征组
             * @param cacheKey
             * @param validGroup
             * @param validGroupMap
             */
            DataContainer.prototype.addFeatureGroup = function (cacheKey, validGroup, validGroupMap) {
                this.featureCache[cacheKey] = validGroup;
                this.featureCacheMap[cacheKey] = validGroupMap;
            };
            /**
             * 是否存在特征组
             * @param key
             */
            DataContainer.prototype.existFeatureGroup = function (key) {
                return !!this.featureCache[key];
            };
            /**
             * 获取特征组
             * @param name
             */
            DataContainer.prototype.getFeatureGroupByName = function (name) {
                var group = this.featureCache[name];
                return group;
            };
            /**
             * 获取类型所属特征组
             * @param cls
             */
            DataContainer.prototype.getTypeFeatureGroup = function (cls) {
                var group = this.getFeatureGroupByName(cls.name);
                if (group == null) {
                    var typeFeature = {
                        name: cls.name,
                        filter: function (data) { return data instanceof cls; },
                    };
                    group = this.buildFeatureGroup(typeFeature);
                }
                return group;
            };
            /**
             * 获取特征组
             * @param feature
             */
            DataContainer.prototype.getFeatureGroup = function (feature) {
                var group = this.featureCache[feature.name];
                return group;
            };
            /**
             * 获取特征组
             * @param feature
             */
            DataContainer.prototype.getFeatureGroupMap = function (feature) {
                var map = this.featureCacheMap[feature.name];
                return map;
            };
            /**
             * 按特征组移除所有对象
             * @param feature
             */
            DataContainer.prototype.deattachFeatureGroup = function (name) {
                var _this = this;
                var group = this.featureCache[name];
                if (group) {
                    group.forEach(function (data) {
                        _this.deattach(data);
                    });
                    delete this.featureCache[name];
                    delete this.featureCacheMap[name];
                }
                return group;
            };
            return DataContainer;
        }());
        eds.DataContainer = DataContainer;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
/// <reference path="DataFeature.ts" />
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var DataManager = /** @class */ (function () {
            function DataManager() {
                this.oid = "DataManager_" + DataManager._IdAcc++;
            }
            DataManager.prototype.init = function (utils) {
                this.dataContainer = new eds.DataContainer().init();
                this.dirtyManager = new eds.DirtyManager().init();
                this.utils = utils;
                return this;
            };
            DataManager.prototype.clearDatas = function () {
                this.dirtyManager.clearFlags();
                this.dataContainer.clearEntities();
            };
            DataManager.prototype.existsData = function (ecsdata) {
                return this.dataContainer.existsData(ecsdata);
            };
            DataManager.prototype.getDataById = function (oid) {
                return this.dataContainer.getDataById(oid);
            };
            //#region 用于合并
            DataManager.prototype.overwriteData = function (ecsdata, dataManager) {
                var data = this.getDataById(ecsdata.oid);
                eds.MergeECSData(ecsdata, data, this);
            };
            DataManager.prototype.removeData = function (ecsdata) {
                if (ecsdata.clear) {
                    ecsdata.clear();
                }
                this.deattachData(ecsdata);
            };
            DataManager.prototype.cloneData = function (ecsdata, dataManager) {
                var copyed = eds.CloneECSData(ecsdata, this);
                this.attachData(copyed);
                return copyed;
            };
            //#endregion
            /**
             * 创建查询器
             */
            DataManager.prototype.query = function () {
                var ret = new eds.DataQuery();
                ret.init(this);
                return ret;
            };
            DataManager.prototype.buildReferRelationMap = function () {
                this.dataContainer.buildReferRelationMap();
            };
            DataManager.prototype.addData = function (cls) {
                var data = new cls();
                eds.DecoECSDataClass(data, this);
                this.dirtyManager.markDirty(data);
                this.dataContainer.attach(data);
                return data;
            };
            DataManager.prototype.deattachDatas = function (cls) {
                var dirtyManager = this.dirtyManager;
                var group = this.dataContainer.deattachFeatureGroup(cls.name) || [];
                group.forEach(function (data) {
                    dirtyManager.markDirty(data);
                });
            };
            DataManager.prototype.deattachData = function (data) {
                this.dirtyManager.markDirty(data);
                this.dataContainer.deattach(data);
            };
            DataManager.prototype.attachData = function (data) {
                eds.DecoECSDataClass(data, this);
                this.dataContainer.attach(data);
                this.dirtyManager.markDirty(data);
                return data;
            };
            DataManager.prototype.buildFeatureGroups = function (features) {
                return this.dataContainer.buildFeatureGroups(features);
            };
            DataManager.prototype.buildFeatureGroup = function (feature, key) {
                return this.dataContainer.buildFeatureGroup(feature, key);
            };
            /**
             * 移除特征组
             * @param feature
             */
            DataManager.prototype.deattachFeatureGroup = function (feature) {
                var group = this.dataContainer.deattachFeatureGroup(feature.name);
                return (group || []);
            };
            /**
             * 按类型取
             * @param cls
             */
            DataManager.prototype.getTypeFeatureGroup = function (cls) {
                return this.dataContainer.getTypeFeatureGroup(cls);
            };
            /**
             * 按feature名称取
             * @param name
             */
            DataManager.prototype.getFeatureGroupByName = function (name) {
                return this.dataContainer.getFeatureGroupByName(name) || [];
            };
            /**
             * 获取特征组
             * @param feature
             */
            DataManager.prototype.getFeatureGroup = function (feature) {
                var group = this.dataContainer.getFeatureGroup(feature);
                return group || [];
            };
            /**
             * 获取特征组
             * @param feature
             */
            DataManager.prototype.getFeatureGroupMap = function (feature) {
                var map = this.dataContainer.getFeatureGroupMap(feature);
                return map;
            };
            DataManager.prototype.forEachWithFeatures = function (features, call, cacheKey) {
                var _this = this;
                if (!call) {
                    call = fsync.EmptyCall;
                }
                var dataContainer = this.dataContainer;
                /**
                 * 先检查是否已构建缓存
                 */
                var directGroup = dataContainer.getFeatureGroupByName(cacheKey);
                if (directGroup) {
                    for (var _i = 0, directGroup_1 = directGroup; _i < directGroup_1.length; _i++) {
                        var data = directGroup_1[_i];
                        if (call(data)) {
                            break;
                        }
                    }
                    return;
                }
                var minFeature = fsync.ArrayHelper.min(features, function (feature) {
                    return _this.getFeatureGroup(feature).length;
                });
                if (minFeature) {
                    var index = features.indexOf(minFeature);
                    var maps = features.map(function (feature) {
                        return _this.getFeatureGroupMap(feature);
                    });
                    // maps.removeAt(index)
                    maps.splice(index, 1);
                    if (cacheKey) {
                        var validGroupMap = fsync.EmptyTable();
                        var validGroup = [];
                    }
                    var group = this.getFeatureGroup(minFeature);
                    var isContinue = true;
                    for (var _a = 0, group_1 = group; _a < group_1.length; _a++) {
                        var data = group_1[_a];
                        var isMatched = true;
                        for (var _b = 0, maps_1 = maps; _b < maps_1.length; _b++) {
                            var map = maps_1[_b];
                            if (!map[data.oid]) {
                                isMatched = false;
                                break;
                            }
                        }
                        if (isMatched) {
                            if (cacheKey) {
                                validGroup.push(data);
                                validGroupMap[data.oid] = data;
                            }
                            if (isContinue) {
                                if (call(data)) {
                                    isContinue = false;
                                }
                            }
                        }
                    }
                    if (cacheKey) {
                        dataContainer.addFeatureGroup(cacheKey, validGroup, validGroupMap);
                    }
                }
            };
            DataManager._IdAcc = 0;
            return DataManager;
        }());
        eds.DataManager = DataManager;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var DataQuery = /** @class */ (function () {
            function DataQuery() {
                this.enableCache = true;
            }
            DataQuery.prototype.init = function (dataManager) {
                this.dataManager = dataManager;
                this.filter = {
                    name: "",
                    includes: [],
                };
                return this;
            };
            DataQuery.prototype.with = function (feature) {
                this.filter.includes.push(feature);
                return this;
            };
            DataQuery.prototype.withCache = function (enable) {
                this.enableCache = enable;
            };
            DataQuery.prototype.forEach = function (call) {
                var cacheKey = null;
                if (this.enableCache) {
                    cacheKey = this.filter.includes.map(function (feature) { return feature.name; }).join("_+_");
                }
                this.dataManager.forEachWithFeatures(this.filter.includes, call, cacheKey);
                return this;
            };
            DataQuery.prototype.toArray = function () {
                var array = [];
                this.forEach(function (data) {
                    array.push(data);
                });
                return array;
            };
            DataQuery.prototype.first = function () {
                var first = null;
                this.forEach(function (data) {
                    first = data;
                    return first;
                });
                return first;
            };
            DataQuery.prototype.count = function () {
                var count = 0;
                this.forEach(function (data) {
                    ++count;
                });
                return count;
            };
            return DataQuery;
        }());
        eds.DataQuery = DataQuery;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        function buildGetSet(target, property, dataManager) {
            var value0 = target[property];
            var hiddenProp = "__" + property + "__";
            delete target[property];
            if (!(value0 instanceof eds.DataClassDef)) {
                target[hiddenProp] = value0;
                Object.defineProperty(target, property, {
                    get: function () {
                        return this[hiddenProp];
                    },
                    set: function (value) {
                        var desc = Object.getOwnPropertyDescriptor(this, hiddenProp);
                        if (!desc.writable) {
                            throw new Error("cannot set value to a prop not writable");
                        }
                        if (this[hiddenProp] != value) {
                            this[hiddenProp] = value;
                            this.dataManager.dirtyManager.markDirty(this);
                        }
                    }
                });
            }
            else {
                if (value0 == eds._NullData) {
                    target[hiddenProp] = "";
                }
                else {
                    var ctype = value0.t;
                    var subData = dataManager.addData(ctype);
                    target[hiddenProp] = subData.oid;
                }
                Object.defineProperty(target, property, {
                    get: function () {
                        var oid = this[hiddenProp];
                        var data = this.dataManager.getDataById(oid);
                        return data;
                    },
                    set: function (value) {
                        var targetOid = value.oid;
                        if (this[hiddenProp] != targetOid) {
                            this[hiddenProp] = targetOid;
                            this.dataManager.dirtyManager.markDirty(this);
                        }
                    }
                });
            }
        }
        function DefindECSDataMetaValue(data, dataManager) {
            var uidTool = dataManager.utils.uidTool;
            var typeName = data["constructor"].name;
            Object.defineProperty(data, 'otype', {
                value: typeName,
                writable: false,
                enumerable: false,
            });
            Object.defineProperty(data, 'oid', {
                value: uidTool.genTypedId(typeName),
                writable: false,
                enumerable: false,
            });
            Object.defineProperty(data, 'dataManager', {
                value: dataManager,
                writable: false,
                enumerable: false,
            });
        }
        eds.DefindECSDataMetaValue = DefindECSDataMetaValue;
        function DecoECSDataClass(data, dataManager) {
            if (data.oid != null) {
                return;
            }
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    buildGetSet(data, key, dataManager);
                }
            }
            DefindECSDataMetaValue(data, dataManager);
        }
        eds.DecoECSDataClass = DecoECSDataClass;
        /**
         * 合并 ecs 数据: ecsdata -> copy
         * @param ecsdata
         * @param copy
         * @param dataManager
         */
        function MergeECSData(ecsdata, copy, dataManager) {
            if (copy.mergeFrom) {
                // 如果支持 自带 merge, 那么优先用自带merge
                copy.mergeFrom(ecsdata);
            }
            else {
                // 复制属性值
                for (var key in ecsdata) {
                    var data = ecsdata[key];
                    if (typeof (data) == "object" && data != null) {
                        if (data.mergeFrom
                            && (!!copy[key])
                            && Object.getPrototypeOf(copy[key]) == Object.getPrototypeOf(data)) {
                            copy[key].mergeFrom(data);
                        }
                        else if (data.clone != undefined) {
                            var copyAttrValue = copy[key] = data.clone();
                            DefindECSDataMetaValue(copyAttrValue, dataManager);
                        }
                        else {
                            if (data instanceof Array) {
                                // 仅简单支持基础类型数组复制
                                copy[key] = __spreadArray([], data);
                            }
                            else {
                                throw new Error("unsupport data type to clone");
                            }
                        }
                    }
                    else {
                        copy[key] = data;
                    }
                }
                if (copy.oid == null) {
                    for (var _i = 0, _a = Object.getOwnPropertyNames(ecsdata); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (!key.startsWith("__") && key != "dataManager") {
                            var prop = Object.getOwnPropertyDescriptor(ecsdata, key);
                            Object.defineProperty(copy, key, prop);
                        }
                    }
                    delete copy["dataManager"];
                    Object.defineProperty(copy, 'dataManager', {
                        value: dataManager,
                        writable: false,
                        enumerable: false,
                    });
                }
                // 相同继承
                Object.setPrototypeOf(copy, Object.getPrototypeOf(ecsdata));
            }
        }
        eds.MergeECSData = MergeECSData;
        function CloneECSData(ecsdata, dataManager) {
            if (ecsdata.clone) {
                // 如果支持 自带 clone, 那么优先用自带clone
                var copy = ecsdata.clone();
                return copy;
            }
            else {
                var copy = {
                // oid: ecsdata.oid,
                // otype: ecsdata.otype,
                };
                MergeECSData(ecsdata, copy, dataManager);
                return copy;
            }
        }
        eds.CloneECSData = CloneECSData;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var DirtyManager = /** @class */ (function () {
            function DirtyManager() {
            }
            DirtyManager.prototype.init = function () {
                this.dirtyDatas = fsync.EmptyTable();
                return this;
            };
            DirtyManager.prototype.isDirty = function (data) {
                return this.dirtyDatas[data.oid] != null;
            };
            DirtyManager.prototype.markDirty = function (data) {
                this.dirtyDatas[data.oid] = data;
            };
            DirtyManager.prototype.forEachDirtyEntities = function (call) {
                if (call == null) {
                    return;
                }
                var dirtyDatas = this.dirtyDatas;
                for (var key in dirtyDatas) {
                    var data = dirtyDatas[key];
                    fsync.assert(data != null, "ecs data should not be null");
                    call(data);
                }
            };
            DirtyManager.prototype.clearFlags = function () {
                this.init();
            };
            return DirtyManager;
        }());
        eds.DirtyManager = DirtyManager;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    function IsArrayEqual(arr1, arr2) {
        for (var i in arr1) {
            if (arr2[i] !== arr1[i]) {
                return false;
            }
        }
        return true;
    }
    fsync.IsArrayEqual = IsArrayEqual;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ComponentHelper = /** @class */ (function () {
        function ComponentHelper() {
        }
        ComponentHelper.getIdentity = function (comp) {
            return comp["__ecs_cid"];
        };
        ComponentHelper.getType = function (comp) {
            return comp['__ecs_ctype'];
        };
        ComponentHelper.isTypeOf = function (comp, cls) {
            return comp['__ecs_ctype'] == cls.name;
        };
        return ComponentHelper;
    }());
    fsync.ComponentHelper = ComponentHelper;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var _copyECSComponetAttrValue = function (data) {
        if (typeof (data) == "object") {
            if (data.clone != undefined) {
                return data.clone();
            }
            else {
                if (data instanceof Array) {
                    // 仅简单支持基础类型数组复制
                    return __spreadArray([], data);
                }
                else {
                    throw new Error("unsupport data type to clone");
                }
            }
        }
        else {
            return data;
        }
    };
    fsync.copyECSComponetAttrValue = _copyECSComponetAttrValue;
    function DecoECSComponent(comp, dirtyManager, uidTool) {
        if (comp["__ecs_cid"] != null) {
            return;
        }
        // comp['__ecs_ctype'] = ""
        function buildGetSet(target, property) {
            var value0 = target[property];
            var hiddenProp = "__" + property + "__";
            delete target[property];
            Object.defineProperty(target, property, {
                get: function () {
                    return this[hiddenProp];
                },
                set: function (value) {
                    var desc = Object.getOwnPropertyDescriptor(this, hiddenProp);
                    if (!desc.writable) {
                        throw new Error("cannot set value to a prop not writable");
                    }
                    this[hiddenProp] = value;
                    dirtyManager.markComponentDirty(this);
                }
            });
            comp[hiddenProp] = value0;
        }
        for (var key in comp) {
            if (comp.hasOwnProperty(key)) {
                buildGetSet(comp, key);
            }
        }
        var typeName = comp["constructor"].name;
        Object.defineProperty(comp, '__ecs_ctype', {
            value: typeName,
            writable: false,
            enumerable: false,
        });
        Object.defineProperty(comp, '__ecs_cid', {
            value: uidTool.genTypedId(typeName),
            writable: false,
            enumerable: false,
        });
        // comp['__ecs_ctype'] = typeName
        // comp["__ecs_cid"] = uidTool.genTypedId(typeName)
    }
    fsync.DecoECSComponent = DecoECSComponent;
    function CloneECSComponet(comp, dirtyManager) {
        var copy = {
            componentType: comp['__ecs_ctype'],
        };
        // 复制属性值
        for (var key in comp) {
            var data = comp[key];
            if (typeof (data) == "object") {
                if (data.clone != undefined) {
                    copy[key] = data.clone();
                }
                else {
                    if (data instanceof Array) {
                        // 仅简单支持基础类型数组复制
                        copy[key] = __spreadArray([], data);
                    }
                    else {
                        throw new Error("unsupport data type to clone");
                    }
                }
            }
            else {
                copy[key] = data;
            }
        }
        var _loop_2 = function (key) {
            if (!key.startsWith("__")) {
                var hiddenProp_1 = "__" + key + "__";
                Object.defineProperty(copy, key, {
                    get: function () {
                        return this[hiddenProp_1];
                    },
                    set: function (value) {
                        this[hiddenProp_1] = value;
                        dirtyManager.markComponentDirty(this);
                    }
                });
            }
        };
        // 复制get、set
        for (var _i = 0, _a = Object.getOwnPropertyNames(comp); _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_2(key);
        }
        // 相同继承
        Object.setPrototypeOf(copy, Object.getPrototypeOf(comp));
        return copy;
    }
    fsync.CloneECSComponet = CloneECSComponet;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    fsync.defaultEntityID = "";
    var Entity = /** @class */ (function () {
        function Entity() {
        }
        Object.defineProperty(Entity.prototype, "identity", {
            get: function () {
                return this.eid;
            },
            enumerable: false,
            configurable: true
        });
        Entity.prototype.clone = function () {
            return this;
        };
        Entity.fromId = function (id) {
            var entity = new Entity();
            entity.eid = id;
            return entity;
        };
        return Entity;
    }());
    fsync.Entity = Entity;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var FrameSyncUtils = /** @class */ (function () {
        function FrameSyncUtils() {
        }
        FrameSyncUtils.prototype.init = function () {
            // FrameSyncUtils.ls.push(this)
            this.random = new fsync.FrameSyncRandom();
            this.random.init();
            this.timer = new fsync.Timer();
            this.timer.init();
            this.uidTool = new fsync.UniqueIDTool();
            this.uidTool.init();
            return this;
        };
        return FrameSyncUtils;
    }());
    fsync.FrameSyncUtils = FrameSyncUtils;
})(fsync || (fsync = {}));
/// <reference path="./FrameSyncUtils.ts" />
var fsync;
(function (fsync) {
    /**
     * 所有Entity 存储区域
     */
    var EntitiesContainer = /** @class */ (function () {
        function EntitiesContainer() {
        }
        EntitiesContainer.prototype.init = function () {
            // entityId -> map<componentId,bool>
            this.entityComponentMap = fsync.EmptyTable();
            this.entityProtoMap = fsync.EmptyTable();
            // componentId -> entityId
            this.componentEntityMap = fsync.EmptyTable();
            // entityId -> entity
            this.entityMap = fsync.EmptyTable();
            // componentId -> component
            this.componentMap = fsync.EmptyTable();
            return this;
        };
        EntitiesContainer.prototype.updateEntityProto = function (entity) {
            var proto = fsync.EmptyTable();
            this.entityProtoMap[entity.identity] = proto;
            var comps = this.entityComponentMap[entity.identity];
            if (comps != null) {
                for (var _i = 0, _a = Object.keys(comps); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var comp = this.componentMap[key];
                    var t = fsync.ComponentHelper.getType(comp);
                    proto[t] = fsync.ComponentHelper.getIdentity(comp) || true;
                }
            }
        };
        EntitiesContainer.prototype.cleanEntityProtoMap = function () {
            var newMap = fsync.EmptyTable();
            var entityProtoMap = this.entityProtoMap;
            for (var key in entityProtoMap) {
                if (this.entityMap[key]) {
                    newMap[key] = entityProtoMap[key];
                }
            }
            this.entityProtoMap = newMap;
        };
        EntitiesContainer.prototype.addComponent = function (entity, comp) {
            var compId = fsync.ComponentHelper.getIdentity(comp);
            if (this.componentMap[compId] != null) {
                fsync.assert(false, "comp duplicate add");
            }
            if (this.entityMap[entity.identity] == null) {
                fsync.assert(false, "entity not exist");
            }
            this.entityComponentMap[entity.identity][compId] = true;
            this.componentEntityMap[compId] = entity.identity;
            this.componentMap[compId] = comp;
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.removeComponentByType = function (entity, t) {
            var compMap = this.entityComponentMap[entity.identity];
            for (var key in compMap) {
                if (fsync.ComponentHelper.getType(this.componentMap[key]) == t) {
                    var comp = this.componentMap[key];
                    delete this.componentEntityMap[key];
                    delete this.componentMap[key];
                    delete compMap[key];
                    this.updateEntityProto(entity);
                    return comp;
                }
            }
            return null;
        };
        EntitiesContainer.prototype.removeComponentsByType = function (entity, t) {
            var compMap = this.entityComponentMap[entity.identity];
            var removeList = [];
            for (var key in compMap) {
                if (fsync.ComponentHelper.getType(this.componentMap[key]) == t) {
                    removeList.push(key);
                }
            }
            for (var _i = 0, removeList_1 = removeList; _i < removeList_1.length; _i++) {
                var key = removeList_1[_i];
                delete this.componentEntityMap[key];
                delete this.componentMap[key];
            }
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype._removeComponent = function (entity, comp) {
            var compId = fsync.ComponentHelper.getIdentity(comp);
            delete this.componentEntityMap[compId];
            delete this.componentMap[compId];
            delete this.entityComponentMap[entity.identity][compId];
        };
        EntitiesContainer.prototype.removeComponent = function (entity, comp) {
            this._removeComponent(entity, comp);
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.removeComponents = function (entity, comps) {
            for (var _i = 0, comps_1 = comps; _i < comps_1.length; _i++) {
                var comp = comps_1[_i];
                this._removeComponent(entity, comp);
            }
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.removeAllComponents = function (entity) {
            var compMap = this.entityComponentMap[entity.identity];
            for (var key in compMap) {
                delete this.componentEntityMap[key];
                delete this.componentMap[key];
            }
            this.entityComponentMap[entity.identity] = fsync.EmptyTable();
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.addEntity = function (entity) {
            if (this.entityMap[entity.identity] != null) {
                fsync.assert(false, "entity duplicate add");
            }
            this.entityMap[entity.identity] = entity;
            if (this.entityComponentMap[entity.identity] == null) {
                this.entityComponentMap[entity.identity] = fsync.EmptyTable();
            }
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.getEntityById = function (entityId) {
            return this.entityMap[entityId];
        };
        EntitiesContainer.prototype.removeEntity = function (entity) {
            if (this.entityComponentMap[entity.identity] != null) {
                var comps = this.entityComponentMap[entity.identity];
                for (var compId in comps) {
                    delete this.componentEntityMap[compId];
                    delete this.componentMap[compId];
                }
                delete this.entityComponentMap[entity.identity];
            }
            delete this.entityMap[entity.identity];
            this.updateEntityProto(entity);
        };
        EntitiesContainer.prototype.getComponentById = function (entity, compId) {
            var compMap = this.entityComponentMap[entity.identity];
            if (compMap[compId]) {
                return this.componentMap[compId];
            }
            else {
                return undefined;
            }
        };
        EntitiesContainer.prototype.getComponent = function (entity, componentType) {
            // let components = this.entityComponentMap[entity.identity]
            // let componentMap = this.componentMap
            // for (let key in components) {
            // 	if (ComponentHelper.getType(componentMap[key]) == componentType) {
            // 		return componentMap[key]
            // 	}
            // }
            var componentMap = this.entityProtoMap[entity.identity];
            if (componentMap == null) {
                return null;
            }
            var componentId = componentMap[componentType];
            var components = this.entityComponentMap[entity.identity];
            if (components[componentId]) {
                return this.componentMap[componentId];
            }
            return null;
        };
        EntitiesContainer.prototype.getEntityCount = function () {
            return Object.keys(this.entityMap).length;
        };
        EntitiesContainer.prototype.getComponentOwnerEntity = function (comp) {
            var entityId = this.componentEntityMap[fsync.ComponentHelper.getIdentity(comp)];
            if (entityId != null) {
                return this.entityMap[entityId];
            }
            return null;
        };
        EntitiesContainer.prototype.getComponents = function (entity) {
            var theCompsMap = this.entityComponentMap[entity.identity];
            var compsMap = this.componentMap;
            return Object.keys(theCompsMap).map(function (key) { return compsMap[key]; });
        };
        EntitiesContainer.prototype.getComponentsWithComponent = function (entity, t) {
            var filterType = t.name;
            var theCompsMap = this.entityComponentMap[entity.identity];
            var compsMap = this.componentMap;
            return Object.keys(theCompsMap).map(function (key) { return compsMap[key]; }).filter(function (comp) { return fsync.ComponentHelper.getType(comp) == filterType; });
        };
        EntitiesContainer.prototype.forEachEntities = function (componentTypes, withoutComponentTypes, call) {
            if (call == null) {
                return;
            }
            for (var key in this.entityMap) {
                var comps = this.entityProtoMap[key];
                // let findKeys = '_' + Object.keys(comps).join('_') + '_'
                // 没有过滤项，则true
                var matched = true;
                for (var _i = 0, componentTypes_1 = componentTypes; _i < componentTypes_1.length; _i++) {
                    var ct = componentTypes_1[_i];
                    if (!comps[ct]) {
                        // if (findKeys.indexOf('_' + ct + '_') < 0) {
                        matched = false;
                        break;
                    }
                }
                if (matched) {
                    for (var _a = 0, withoutComponentTypes_1 = withoutComponentTypes; _a < withoutComponentTypes_1.length; _a++) {
                        var ct = withoutComponentTypes_1[_a];
                        if (comps[ct]) {
                            // if (findKeys.indexOf('_' + ct + '_') < 0) {
                            matched = false;
                            break;
                        }
                    }
                }
                if (matched) {
                    if (call(this.entityMap[key]) == true) {
                        break;
                    }
                }
            }
        };
        EntitiesContainer.prototype.existsEntity = function (entity) {
            return this.entityMap[entity.identity] != null;
        };
        EntitiesContainer.prototype.clearEntities = function () {
            this.init();
        };
        return EntitiesContainer;
    }());
    fsync.EntitiesContainer = EntitiesContainer;
    var EntityDirtyManager = /** @class */ (function () {
        function EntityDirtyManager() {
        }
        EntityDirtyManager.prototype.init = function () {
            this.dirtyComps = [];
            this.dirtyEntities = fsync.EmptyTable();
            return this;
        };
        EntityDirtyManager.prototype.isEntityDirty = function (entity) {
            return this.dirtyEntities[entity.identity] != null;
        };
        EntityDirtyManager.prototype.isComponentDirty = function (comp) {
            return this.dirtyComps.indexOf(comp) >= 0;
        };
        EntityDirtyManager.prototype.markComponentDirty = function (comp) {
            this.dirtyComps.push(comp);
        };
        EntityDirtyManager.prototype.markEntityDirty = function (entity) {
            this.dirtyEntities[entity.identity] = entity;
        };
        EntityDirtyManager.prototype.sortDirtyEntities = function (entityManager) {
            for (var _i = 0, _a = this.dirtyComps; _i < _a.length; _i++) {
                var comp = _a[_i];
                // let entity = comp["__entity"]
                var entity = entityManager.getComponentOwnerEntity(comp);
                if (entity != null) {
                    this.dirtyEntities[entity.identity] = entity;
                }
            }
        };
        EntityDirtyManager.prototype.forEachDirtyEntities = function (call) {
            if (call == null) {
                return;
            }
            for (var key in this.dirtyEntities) {
                var entity = this.dirtyEntities[key];
                fsync.assert(entity != null, "entity should not be null");
                call(entity);
            }
        };
        EntityDirtyManager.prototype.clearFlags = function () {
            this.dirtyComps = [];
            this.dirtyEntities = fsync.EmptyTable();
        };
        return EntityDirtyManager;
    }());
    fsync.EntityDirtyManager = EntityDirtyManager;
    var _EntityManagerIdAcc = 0;
    var EntityManager = /** @class */ (function () {
        function EntityManager() {
            this.identity = "EntityManager_" + _EntityManagerIdAcc++;
        }
        EntityManager.prototype.init = function (utils) {
            this.dirtyManager = new EntityDirtyManager().init();
            this.entityContainer = new EntitiesContainer().init();
            this.utils = utils;
        };
        EntityManager.prototype.clearDirtyManager = function () {
            this.dirtyManager.clearFlags();
        };
        EntityManager.prototype.createQuery = function () {
            return new fsync.EntityQuery().init(this);
        };
        EntityManager.prototype.createEntity = function (tcomps) {
            var entityIdPrefix = tcomps.map(function (comp) { return comp.name; }).sort().join('_');
            var entity = new fsync.Entity();
            entity["eid"] = this.utils.uidTool.genTypedId(entityIdPrefix);
            this.entityContainer.addEntity(entity);
            this.addComponents(entity, tcomps);
            return entity;
        };
        EntityManager.prototype.decoComponent = function (entity, comp) {
            fsync.DecoECSComponent(comp, this.dirtyManager, this.utils.uidTool);
            // comp['__entity'] = entity
        };
        EntityManager.prototype.getEntityById = function (entityId) {
            return this.entityContainer.getEntityById(entityId);
        };
        EntityManager.prototype.wrapEntityId = function (entityId) {
            var entity = this.entityContainer.getEntityById(entityId);
            if (entity == null) {
                entity = fsync.Entity.fromId(entityId);
            }
            return entity;
        };
        EntityManager.prototype.addComponent = function (entity, tcomp) {
            return this.attachComponent(entity, new tcomp());
        };
        EntityManager.prototype.attachComponent = function (entity, comp) {
            this.decoComponent(entity, comp);
            this.entityContainer.addComponent(entity, comp);
            this.dirtyManager.markEntityDirty(entity);
            return comp;
        };
        EntityManager.prototype.addComponents = function (entity, tcomps) {
            var comps = tcomps.map(function (tcomp) { return new tcomp(); });
            this.attachComponents(entity, comps);
            return comps;
        };
        EntityManager.prototype.attachComponents = function (entity, comps) {
            for (var _i = 0, comps_2 = comps; _i < comps_2.length; _i++) {
                var comp = comps_2[_i];
                this.decoComponent(entity, comp);
                this.entityContainer.addComponent(entity, comp);
            }
            this.dirtyManager.markEntityDirty(entity);
            return comps;
        };
        EntityManager.prototype.dettachComponent = function (entity, comp) {
            this.entityContainer.removeComponent(entity, comp);
            this.dirtyManager.markEntityDirty(entity);
            return comp;
        };
        EntityManager.prototype.dettachComponents = function (entity, comps) {
            this.entityContainer.removeComponents(entity, comps);
            this.dirtyManager.markEntityDirty(entity);
            return comps;
        };
        EntityManager.prototype.removeComponent = function (entity, t) {
            var ret = this.entityContainer.removeComponentByType(entity, t.name);
            this.dirtyManager.markEntityDirty(entity);
            return ret;
        };
        EntityManager.prototype.removeComponents = function (entity, t) {
            var ret = this.entityContainer.removeComponentsByType(entity, t.name);
            this.dirtyManager.markEntityDirty(entity);
            return ret;
        };
        EntityManager.prototype.removeEntity = function (entity) {
            this.entityContainer.removeEntity(entity);
            this.dirtyManager.markEntityDirty(entity);
        };
        /**
         * 检查entity是否有非空的identity
         */
        EntityManager.prototype.isValidEntity = function (entity) {
            return entity != null && entity.identity != null;
        };
        /**
         * 检查entity是否存在mananger中
         * @param entity
         */
        EntityManager.prototype.existsEntity = function (entity) {
            if (entity != null) {
                return this.entityContainer.existsEntity(entity);
            }
            else {
                return false;
            }
        };
        /**
         * 是否相同实体
         * @param entity1
         * @param entity2
         */
        EntityManager.prototype.isSameEntity = function (entity1, entity2) {
            return entity1.identity == entity2.identity;
        };
        /**
         * 是否相同实体
         * @param entity1
         * @param entity2
         */
        EntityManager.prototype.isSameEntitySafe = function (entity1, entity2) {
            if (entity1 && entity2) {
                return entity1.identity == entity2.identity;
            }
            else {
                return false;
            }
        };
        EntityManager.prototype.addEntity = function (entity) {
            this.entityContainer.addEntity(entity);
            this.dirtyManager.markEntityDirty(entity);
        };
        EntityManager.prototype.getComponents = function (entity, t) {
            if (t === void 0) { t = null; }
            if (t == null) {
                return this.entityContainer.getComponents(entity);
            }
            else {
                return this.entityContainer.getComponentsWithComponent(entity, t);
            }
        };
        EntityManager.prototype.getComponentById = function (entity, compId) {
            return this.entityContainer.getComponentById(entity, compId);
        };
        EntityManager.prototype.getComponentByType = function (entity, componentType) {
            return this.entityContainer.getComponent(entity, componentType);
        };
        EntityManager.prototype.getComponent = function (entity, t) {
            return this.entityContainer.getComponent(entity, t.name);
        };
        EntityManager.prototype.getOrAddComponent = function (entity, t) {
            var comp = this.getComponent(entity, t);
            if (comp == null) {
                comp = this.addComponent(entity, t);
            }
            return comp;
        };
        EntityManager.prototype.existComponent = function (entity, t) {
            return this.entityContainer.getComponent(entity, t.name) != undefined;
        };
        EntityManager.prototype.getEntityCount = function () {
            return this.entityContainer.getEntityCount();
        };
        EntityManager.prototype.getComponentOwnerEntity = function (comp) {
            return this.entityContainer.getComponentOwnerEntity(comp);
        };
        /**
         * 复制entity
         * @param entity
         * @param targetManager
         */
        EntityManager.prototype.cloneEntity = function (entity, targetManager) {
            var copyComps = [];
            var comps = targetManager.getComponents(entity);
            fsync.assert(comps != null, fsync.TestHelper.UNMATCHED_RESULT);
            for (var _i = 0, comps_3 = comps; _i < comps_3.length; _i++) {
                var comp = comps_3[_i];
                copyComps.push(fsync.CloneECSComponet(comp, this.dirtyManager));
            }
            this.addEntity(entity);
            this.attachComponents(entity, copyComps);
            return entity;
        };
        /**
         * 完全重置覆盖
         * @param entity
         * @param targetManager
         */
        EntityManager.prototype.overwriteEntity = function (entity, targetManager) {
            fsync.assert(this.entityContainer.existsEntity(entity), fsync.TestHelper.UNMATCHED_RESULT);
            this.entityContainer.removeAllComponents(entity);
            var comps = targetManager.getComponents(entity);
            fsync.assert(comps != null, fsync.TestHelper.UNMATCHED_RESULT);
            for (var _i = 0, comps_4 = comps; _i < comps_4.length; _i++) {
                var comp = comps_4[_i];
                this.entityContainer.addComponent(entity, fsync.CloneECSComponet(comp, this.dirtyManager));
            }
        };
        EntityManager.prototype.cleanEntityProtoMap = function () {
            this.entityContainer.cleanEntityProtoMap();
        };
        /**
         * 清空所有entity
         */
        EntityManager.prototype.clearEntities = function () {
            this.dirtyManager.clearFlags();
            this.entityContainer.clearEntities();
        };
        /**
         * 设置组件数据
         * @param entity
         * @param tcomp
         * @param compData
         */
        EntityManager.prototype.setComponentData = function (entity, tcomp, compData) {
            var comp = this.getOrAddComponent(entity, tcomp);
            for (var key in compData) {
                comp[key] = compData[key];
            }
            return comp;
        };
        return EntityManager;
    }());
    fsync.EntityManager = EntityManager;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var EntityQuery = /** @class */ (function () {
        function EntityQuery() {
            this.componentTypes = [];
            this.withoutComponentTypes = [];
        }
        EntityQuery.prototype.init = function (entityManager) {
            this.entityManager = entityManager;
            return this;
        };
        EntityQuery.prototype.with = function (componentType) {
            if (typeof (componentType) == "string") {
                this.componentTypes.push(componentType);
            }
            else {
                this.componentTypes.push(componentType.name);
            }
            return this;
        };
        EntityQuery.prototype.without = function (componentType) {
            if (typeof (componentType) == "string") {
                this.withoutComponentTypes.push(componentType);
            }
            else {
                this.withoutComponentTypes.push(componentType.name);
            }
            return this;
        };
        EntityQuery.prototype.forEach = function (call) {
            var entityManager = this.entityManager;
            entityManager.entityContainer.forEachEntities(this.componentTypes, this.withoutComponentTypes, call);
            return this;
        };
        EntityQuery.prototype.forEachWithComps = function (call) {
            var _this = this;
            var entityManager = this.entityManager;
            entityManager.entityContainer.forEachEntities(this.componentTypes, this.withoutComponentTypes, function (entity) {
                var comps = _this.componentTypes.map(function (t) { return entityManager.getComponentByType(entity, t); });
                call.apply(void 0, __spreadArray([entity], comps));
            });
            return this;
        };
        EntityQuery.prototype.toArray = function () {
            var entities = [];
            this.forEach(function (entity) {
                entities.push(entity);
            });
            return entities;
        };
        EntityQuery.prototype.first = function () {
            var first;
            this.forEach(function (entity) {
                first = entity;
                return true;
            });
            return first;
        };
        EntityQuery.prototype.count = function () {
            var count = 0;
            this.forEach(function (entity) {
                count++;
            });
            return count;
        };
        return EntityQuery;
    }());
    fsync.EntityQuery = EntityQuery;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var FrameSyncRandom = /** @class */ (function () {
        function FrameSyncRandom() {
        }
        FrameSyncRandom.prototype.init = function () {
            this.inc = 0;
            return this;
        };
        FrameSyncRandom.prototype.setRandSeed = function (seed) {
            this.seed = seed;
            this.inc = seed;
        };
        // return [0~1)
        FrameSyncRandom.prototype.rand = function () {
            // this.inc++
            // const r = 77
            // let dv = (this.seed + this.inc * this.inc) % r * 2
            // let rand = (dv % r + dv * dv % (r * r) + dv * dv * dv % (r * r * r)) / (r + r * r + r * r * r)
            // return rand
            this.inc = (this.inc * 9301 + 49297) % 233280;
            return this.inc / 233280.0;
        };
        FrameSyncRandom.prototype.mergeFrom = function (rand) {
            this.inc = rand.inc;
            this.seed = rand.seed;
        };
        return FrameSyncRandom;
    }());
    fsync.FrameSyncRandom = FrameSyncRandom;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ECSCommandBuffer = /** @class */ (function () {
        function ECSCommandBuffer() {
        }
        ECSCommandBuffer.prototype.init = function () {
            this.calls = [];
            return this;
        };
        ECSCommandBuffer.prototype.addCommond = function (call) {
            var paras = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                paras[_i - 1] = arguments[_i];
            }
            this.calls.push({
                call: call,
                paras: paras,
            });
        };
        ECSCommandBuffer.prototype.run = function () {
            // console.log("ECSCommandBuffer.run", this.calls.length)
            for (var _i = 0, _a = this.calls
                .concat(); _i < _a.length; _i++) {
                var call = _a[_i];
                call.call.apply(call, call.paras);
            }
        };
        ECSCommandBuffer.prototype.clearCommonds = function () {
            this.calls.length = 0;
        };
        return ECSCommandBuffer;
    }());
    fsync.ECSCommandBuffer = ECSCommandBuffer;
    // 还需要加一个run on main
    var SystemBase = /** @class */ (function () {
        function SystemBase() {
            this.ctype = "unknown";
        }
        Object.defineProperty(SystemBase.prototype, "timer", {
            get: function () {
                return this.world.utils.timer;
            },
            enumerable: false,
            configurable: true
        });
        SystemBase.prototype.init = function () {
            this._commondBuffer = new ECSCommandBuffer().init();
            this._commondBufferAfterUpdate = new ECSCommandBuffer().init();
            this.ctype = this["constructor"].name;
            this.onInit();
            return this;
        };
        SystemBase.prototype.onInit = function () {
        };
        SystemBase.prototype.instantiate = function (prefab) {
            return this.world.prefabEnv.instantiate(prefab);
        };
        SystemBase.prototype.getCommandBuffer = function () {
            return this._commondBuffer;
        };
        SystemBase.prototype.getCommandBufferAfterUpdate = function () {
            return this._commondBufferAfterUpdate;
        };
        Object.defineProperty(SystemBase.prototype, "entityManager", {
            get: function () {
                return this.world.entityManager;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SystemBase.prototype, "dataManager", {
            get: function () {
                return this.world.dataManager;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 所有操作必须一帧内完成，不能有遗留闭包，否则会出现无法彻底覆写世界的问题
         */
        SystemBase.prototype.update = function () {
        };
        SystemBase.prototype.onBeforeUpdate = function () {
            var commondBuffer = this.getCommandBuffer();
            commondBuffer.run();
            commondBuffer.clearCommonds();
        };
        SystemBase.prototype.onAfterUpdate = function () {
            var commondBuffer = this.getCommandBufferAfterUpdate();
            commondBuffer.run();
            commondBuffer.clearCommonds();
        };
        return SystemBase;
    }());
    fsync.SystemBase = SystemBase;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var UpdaterGroup = /** @class */ (function () {
        function UpdaterGroup() {
        }
        UpdaterGroup.prototype.init = function () {
            this.updaters = [];
            return this;
        };
        UpdaterGroup.prototype.clear = function () {
            for (var _i = 0, _a = this.updaters; _i < _a.length; _i++) {
                var updater = _a[_i];
                updater.clear && updater.clear();
            }
        };
        UpdaterGroup.prototype.onset = function () {
            for (var _i = 0, _a = this.updaters; _i < _a.length; _i++) {
                var updater = _a[_i];
                updater.onset && updater.onset();
            }
        };
        UpdaterGroup.prototype.addUpdater = function (update) {
            this.updaters.push(update);
        };
        UpdaterGroup.prototype.onBeforeUpdate = function () {
            for (var _i = 0, _a = this.updaters; _i < _a.length; _i++) {
                var updater = _a[_i];
                updater.onBeforeUpdate();
            }
        };
        UpdaterGroup.prototype.update = function () {
            for (var _i = 0, _a = this.updaters; _i < _a.length; _i++) {
                var updater = _a[_i];
                updater.update();
            }
        };
        UpdaterGroup.prototype.onAfterUpdate = function () {
            for (var _i = 0, _a = this.updaters; _i < _a.length; _i++) {
                var updater = _a[_i];
                updater.onAfterUpdate();
            }
        };
        return UpdaterGroup;
    }());
    fsync.UpdaterGroup = UpdaterGroup;
    // 游戏加载完毕之后，内容就不会改变，避免重写
    var UpdaterGroupManager = /** @class */ (function () {
        function UpdaterGroupManager() {
        }
        UpdaterGroupManager.prototype.init = function () {
            this.updaters = fsync.EmptyTable();
            this.updateOrder = [];
            this._disabledGroup = {};
            return this;
        };
        UpdaterGroupManager.prototype.onset = function () {
            this.foreachByOrder(function (updater) {
                updater.onset();
            });
        };
        UpdaterGroupManager.prototype.clear = function () {
            this.foreachByOrder(function (updater) {
                updater.clear();
            });
        };
        UpdaterGroupManager.prototype.getUpdaterGroup = function (groupName) {
            var group = this.updaters[groupName];
            if (group == null) {
                group = new UpdaterGroup();
                group.init();
                this.updaters[groupName] = group;
            }
            return group;
        };
        UpdaterGroupManager.prototype.addUpdaterGroup = function (groupName, group) {
            this.updaters[groupName] = group;
        };
        UpdaterGroupManager.prototype.setGroupUpdateOrder = function (updateOrder) {
            this.updateOrder.length = 0;
            for (var _i = 0, updateOrder_1 = updateOrder; _i < updateOrder_1.length; _i++) {
                var order = updateOrder_1[_i];
                this.updateOrder.push(order);
            }
        };
        UpdaterGroupManager.prototype.disableGroup = function (key) {
            this._disabledGroup[key] = true;
        };
        UpdaterGroupManager.prototype.enableGroup = function (key) {
            delete this._disabledGroup[key];
        };
        UpdaterGroupManager.prototype.isGroupEnabled = function (key) {
            return !this._disabledGroup[key];
        };
        UpdaterGroupManager.prototype.foreachByOrder = function (call) {
            var updatedMap = fsync.EmptyTable();
            var updaters = this.updaters;
            for (var _i = 0, _a = this.updateOrder; _i < _a.length; _i++) {
                var k = _a[_i];
                if (updaters[k]) {
                    updatedMap[k] = true;
                    if (!this._disabledGroup[k]) {
                        call(updaters[k]);
                    }
                }
            }
            for (var k in this.updaters) {
                if (updatedMap[k] != null) {
                    continue;
                }
                if (!this._disabledGroup[k]) {
                    call(updaters[k]);
                }
            }
        };
        UpdaterGroupManager.prototype.onBeforeUpdate = function () {
            this.foreachByOrder(function (updater) {
                updater.onBeforeUpdate();
            });
        };
        UpdaterGroupManager.prototype.update = function () {
            this.foreachByOrder(function (updater) {
                updater.update();
            });
        };
        UpdaterGroupManager.prototype.onAfterUpdate = function () {
            this.foreachByOrder(function (updater) {
                updater.onAfterUpdate();
            });
        };
        return UpdaterGroupManager;
    }());
    fsync.UpdaterGroupManager = UpdaterGroupManager;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ECSWorld = /** @class */ (function () {
        function ECSWorld() {
            this.name = "normal";
            // 帧计数
            this.frameCount = 0;
        }
        ECSWorld.prototype.clear = function () {
            this.entityManager.clearEntities();
            this.dataManager.clearDatas();
        };
        ECSWorld.prototype.init = function (utils) {
            if (utils === void 0) { utils = null; }
            this.dataMap = fsync.EmptyTable();
            this.utils = utils || new fsync.FrameSyncUtils();
            this.env = new fsync.WorldEnv();
            this.entityManager = new fsync.EntityManager();
            this.entityManager.name = this.name;
            this.entityManager.init(this.utils);
            this.dataManager = new fsync.eds.DataManager().init(this.utils);
            this.dataManager.name = this.name;
            return this;
        };
        ECSWorld.prototype.mergeFrom = function (world) {
            this.frameCount = world.frameCount;
            this.utils.random.mergeFrom(world.utils.random);
            this.utils.uidTool.mergeFrom(world.utils.uidTool);
            this.utils.timer.mergeFrom(world.utils.timer);
        };
        ECSWorld.prototype.getData = function (key) {
            return this.dataMap[key];
        };
        ECSWorld.prototype.setData = function (key, data) {
            this.dataMap[key] = data;
        };
        return ECSWorld;
    }());
    fsync.ECSWorld = ECSWorld;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var WorldEnv = /** @class */ (function () {
        function WorldEnv() {
        }
        WorldEnv.prototype.init = function () {
            return this;
        };
        return WorldEnv;
    }());
    fsync.WorldEnv = WorldEnv;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var NetDelay = /** @class */ (function () {
        function NetDelay() {
            /**
             * 延迟总值
             */
            this.netDelayAcc = 0;
            /**
             * 方差总值
             */
            this.netDelayDeviationAcc = 0;
            this.netDelayQueue = [];
            this.maxSampleCount = 15;
        }
        /**
         * 输入网络延迟样本, 单位 秒
         * @param delay
         */
        NetDelay.prototype.putDelay = function (delay) {
            this.netDelayAcc += delay;
            this.netDelayDeviationAcc += Math.abs(delay - this.netDelayQueue[0] || delay);
            this.netDelayQueue.unshift(delay);
            if (this.netDelayQueue.length > this.maxSampleCount) {
                var d = this.netDelayQueue.pop();
                this.netDelayAcc -= d;
                // 不严格的减法, 但是数值可以保持平衡
                this.netDelayDeviationAcc -= Math.abs(d - this.netDelayQueue[this.netDelayQueue.length - 1] || d);
                if (this.netDelayDeviationAcc < 0) {
                    console.log("klwefjlkj");
                }
            }
        };
        /**
         * 平均网络延迟, 单位 秒
         */
        NetDelay.prototype.getDelayAv = function () {
            if (this.netDelayQueue.length == 0) {
                return 0;
            }
            return this.netDelayAcc / this.netDelayQueue.length;
        };
        /**
         * 网络延迟标准差, 单位 秒
         */
        NetDelay.prototype.getDelayStdDeviationAv = function () {
            if (this.netDelayQueue.length == 0) {
                return 0;
            }
            return this.netDelayDeviationAcc / this.netDelayQueue.length;
        };
        return NetDelay;
    }());
    fsync.NetDelay = NetDelay;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var PrefabHelper = /** @class */ (function () {
        function PrefabHelper() {
        }
        PrefabHelper.prototype.init = function () {
            return this;
        };
        PrefabHelper.prototype.instantiate = function (prefab, depsEnv) {
            return prefab.create(depsEnv);
        };
        return PrefabHelper;
    }());
    fsync.PrefabHelper = PrefabHelper;
    var PrefabHelperWithoutView = /** @class */ (function () {
        function PrefabHelperWithoutView() {
        }
        PrefabHelperWithoutView.prototype.init = function () {
            return this;
        };
        PrefabHelperWithoutView.prototype.instantiate = function (prefab, depsEnv) {
            return prefab.create(depsEnv);
        };
        return PrefabHelperWithoutView;
    }());
    fsync.PrefabHelperWithoutView = PrefabHelperWithoutView;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Timer = /** @class */ (function () {
        function Timer() {
            /**
             * 外界实际当前时间点
             */
            this._curTimeRecord = 0;
            /**
             * 游戏内部当前时间点
             */
            this._curTime = 0;
            /**
             * 当前帧间间隔
             */
            this._deltaTime = 0;
            /**
             * 最大帧间隔,用于提升断点调试体验
             */
            this._maxDeltaTime = Infinity;
            /**
             * 游戏开始时间点
             */
            this._startTime = 0;
            this.oid = 0;
        }
        Timer.prototype.init = function () {
            this.oid = Timer.oidAcc++;
            return this;
        };
        Object.defineProperty(Timer.prototype, "realtime", {
            get: function () {
                return Date.now();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "recordRealtime", {
            get: function () {
                return this._curTimeRecord;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 获取当前游戏时间戳
         * - 和 getGameTime() 的区别在于, getGameTime 的起始时间点为 0, getTime 的起始时间点和游戏开始时的 Date.now() 基本一致
         */
        Timer.prototype.getTime = function () {
            return this._curTime;
        };
        Timer.prototype.updateTime = function (time) {
            var dt = time - this._curTimeRecord;
            this._curTimeRecord = time;
            this._deltaTime = Math.min(dt, this._maxDeltaTime);
            this._curTime = this._curTime + this._deltaTime;
        };
        /**
         * 重设游戏开始时间点
         * @param time
         */
        Timer.prototype.setStartTime = function (time) {
            this._startTime = time;
        };
        /**
         * 游戏已进行时长
         */
        Timer.prototype.getGameTime = function () {
            return this._curTime - this._startTime;
        };
        Timer.prototype.setTime = function (time) {
            this._curTime = time;
            this._deltaTime = 0;
            this.setStartTime(time);
        };
        Object.defineProperty(Timer.prototype, "deltaTime", {
            get: function () {
                return this._deltaTime;
            },
            enumerable: false,
            configurable: true
        });
        Timer.prototype.mergeFrom = function (timer) {
            this._curTime = timer._curTime;
            this._deltaTime = timer._deltaTime;
        };
        Timer.prototype.setMaxDeltaTime = function (dt) {
            this._maxDeltaTime = dt;
        };
        Timer.oidAcc = 1;
        return Timer;
    }());
    fsync.Timer = Timer;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var UniqueIDTool = /** @class */ (function () {
        function UniqueIDTool() {
            this.typeMap = fsync.EmptyTable();
        }
        UniqueIDTool.prototype.init = function () {
            return this;
        };
        UniqueIDTool.prototype.rewrite = function (d) {
            var newMap = fsync.EmptyTable();
            for (var key in d) {
                newMap[key] = d[key];
            }
            this.typeMap = newMap;
            return true;
        };
        UniqueIDTool.prototype.genTypedId = function (t) {
            var typeId = this.typeMap[t];
            if (typeId == null) {
                typeId = 0;
            }
            typeId++;
            this.typeMap[t] = typeId;
            var uid = t + "_#" + typeId;
            return uid;
        };
        UniqueIDTool.prototype.mergeFrom = function (tool) {
            this.typeMap = fsync.EmptyTable();
            var targetTypeMap = tool.typeMap;
            var myTypeMap = this.typeMap;
            for (var key in targetTypeMap) {
                myTypeMap[key] = targetTypeMap[key];
            }
        };
        return UniqueIDTool;
    }());
    fsync.UniqueIDTool = UniqueIDTool;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Updater = /** @class */ (function () {
        function Updater() {
        }
        Updater.prototype.init = function () {
            this.updaters = [];
            return this;
        };
        Updater.prototype.onBeforeUpdate = function () {
        };
        Updater.prototype.update = function () {
        };
        Updater.prototype.onAfterUpdate = function () {
        };
        return Updater;
    }());
    fsync.Updater = Updater;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        /**
         * comp 类装饰器
         * @param target
         */
        function DecoCompProxy(target) {
            ecsproxy.proxyClasses.compProxies.push(target);
        }
        ecsproxy.DecoCompProxy = DecoCompProxy;
        function DoDecoCompProxy(target) {
            if (target['__ecscompproxyproto']) {
                return;
            }
            var demo = new target();
            // 代理类原型
            var proto = Object.create(null);
            var protoRaw = target.prototype;
            var _loop_3 = function (key) {
                if (demo[key] instanceof ecsproxy.CompDecoInfo) {
                    var decoInfo = demo[key];
                    var cls_1 = decoInfo.cls;
                    var clst = decoInfo.t;
                    protoRaw[key] = "";
                    if (clst == ecsproxy.StandEntityProxy) {
                        // 定义从 component 中取 entity
                        Object.defineProperty(proto, key, {
                            get: function () {
                                var self = this;
                                var entityManager = self.__entityManager;
                                var entityId = self.__comp[key];
                                var entity = entityManager.wrapEntityId(entityId);
                                var proxy = ecsproxy.entityProxyHelper.getEntityProxy(cls_1, entityManager, entity);
                                return proxy;
                            },
                            set: function (value) {
                                var self = this;
                                self.__comp[key] = value.entityId;
                            },
                        });
                    }
                    else if (clst == ecsproxy.StandEntityProxyArray) {
                        Object.defineProperty(proto, key, {
                            get: function () {
                                var self = this;
                                var entityManager = self.__entityManager;
                                var entityIds = self.__comp[key];
                                var proxys = entityIds.map(function (entityId) {
                                    var entity = entityManager.wrapEntityId(entityId);
                                    return ecsproxy.entityProxyHelper.getEntityProxy(cls_1, entityManager, entity);
                                });
                                return proxys;
                            },
                            set: function (values) {
                                var self = this;
                                var entityIds = self.__comp[key];
                                entityIds.length = 0;
                                values.forEach(function (value) {
                                    entityIds.push(value.entityId);
                                });
                            },
                        });
                    }
                    else if (clst == ecsproxy.StandCompConfig && decoInfo instanceof ecsproxy.ConfigDecoInfo) {
                        var defaultId = decoInfo.defaultId;
                        var tables_1 = decoInfo.tables;
                        Object.defineProperty(proto, key, {
                            /**
                             * 配表的 get 返回 config
                             */
                            get: function () {
                                var self = this;
                                var id = self.__comp[key];
                                var config = tables_1.find(function (table) { return table.id == id; });
                                return config;
                            },
                            /**
                             * 配表的 set 传入 IConfigBase
                             * @param id
                             */
                            set: function (config) {
                                var self = this;
                                self.__comp[key] = config.id;
                            },
                        });
                        // 默认配置id
                        protoRaw[key] = defaultId;
                    }
                    else if (clst == ecsproxy.StandCustomData && decoInfo instanceof ecsproxy.CustomDataDecoInfo) {
                        var defaultId = decoInfo.defaultId;
                        var accessor = decoInfo.accessor;
                        var toClonable_1 = accessor.toClonable, toTarget_1 = accessor.toTarget;
                        Object.defineProperty(proto, key, {
                            /**
                             * 配表的 get 返回 data id
                             */
                            get: function () {
                                var self = this;
                                var id = self.__comp[key];
                                var data = toTarget_1(id, self.__comp, key);
                                return data;
                            },
                            /**
                             * 配表的 set 传入 data
                             * @param id
                             */
                            set: function (data) {
                                var self = this;
                                self.__comp[key] = toClonable_1(data);
                            },
                        });
                        // 默认配置id
                        protoRaw[key] = defaultId;
                    }
                    else if (clst == ecsproxy.StandCustomDataArray && decoInfo instanceof ecsproxy.CustomDataArrayDecoInfo) {
                        var accessor = decoInfo.accessor;
                        var toClonable_2 = accessor.toClonable, toTarget_2 = accessor.toTarget, toTargetArray_1 = accessor.toTargetArray;
                        Object.defineProperty(proto, key, {
                            /**
                             * 配表的 get 返回 data id
                             */
                            get: function () {
                                var self = this;
                                var ids = self.__comp[key];
                                var datas;
                                if (toTargetArray_1) {
                                    datas = toTargetArray_1(ids, self.__comp, key);
                                }
                                else {
                                    datas = ids.map(function (id) { return toTarget_2(id, self.__comp, key); });
                                    Object.defineProperty(datas, "push", {
                                        value: function (target) {
                                            if (typeof (target) == "string") {
                                                self.__comp[key].push(target);
                                            }
                                            else {
                                                self.__comp[key].push(target.oid);
                                            }
                                        }
                                    });
                                }
                                return datas;
                            },
                            /**
                             * 配表的 set 传入 data
                             * @param id
                             */
                            set: function (datas) {
                                var self = this;
                                self.__comp[key] = datas.map(function (data) { return toClonable_2(data); });
                            },
                        });
                    }
                    else {
                        console.error("unspport type");
                    }
                }
                else {
                    Object.defineProperty(proto, key, {
                        get: function () {
                            return this.__comp[key];
                        },
                        set: function (value) {
                            this.__comp[key] = value;
                        },
                    });
                }
            };
            for (var _i = 0, _a = Object.keys(demo); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_3(key);
            }
            Object.defineProperty(proto, "setComp", {
                value: function (comp) {
                    this.__comp = comp;
                }
            });
            Object.defineProperty(proto, "setCompCls", {
                value: function (compClass) {
                    this.__compClass = compClass;
                }
            });
            Object.defineProperty(proto, "isNull", {
                get: function () {
                    return this.__comp == null;
                }
            });
            Object.defineProperty(proto, "isNotNull", {
                get: function () {
                    return this.__comp != null;
                }
            });
            Object.defineProperty(proto, "getOrAdd", {
                value: function () {
                    var self = this;
                    if (self.__comp == null) {
                        var entityManager = self.__entityManager;
                        var entity = self.__entity;
                        var compCls = self.__compClass;
                        if (!entityManager.existComponent(entity, compCls)) {
                            self.__comp = entityManager.addComponent(entity, compCls);
                        }
                        else {
                            self.__comp = entityManager.getComponent(entity, compCls);
                        }
                    }
                    return this;
                }
            });
            target['__ecscompproxyproto'] = proto;
        }
        ecsproxy.DoDecoCompProxy = DoDecoCompProxy;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        /**
         * 中间数据
         */
        var CompDecoInfo = /** @class */ (function () {
            function CompDecoInfo(t, cls) {
                this.t = t;
                this.cls = cls;
            }
            return CompDecoInfo;
        }());
        ecsproxy.CompDecoInfo = CompDecoInfo;
        var ConfigDecoInfo = /** @class */ (function (_super) {
            __extends(ConfigDecoInfo, _super);
            function ConfigDecoInfo(t, cls, tables, defaultId) {
                var _this = _super.call(this, t, cls) || this;
                _this.t = t;
                _this.cls = cls;
                _this.tables = tables;
                _this.defaultId = defaultId;
                return _this;
            }
            return ConfigDecoInfo;
        }(CompDecoInfo));
        ecsproxy.ConfigDecoInfo = ConfigDecoInfo;
        // export interface ICustomDataArrayAccessor {
        // 	/**
        // 	 * id to target
        // 	 */
        // 	toTarget: (id: (string | number)[]) => any[],
        // 	/**
        // 	 * target to id
        // 	 */
        // 	toClonable: (a: any[]) => (string | number)[],
        // }
        function ToCompConfig(id) {
            return { id: id };
        }
        ecsproxy.ToCompConfig = ToCompConfig;
        /**
         * 配表装饰器
         * @param cls
         * @param clsid
         */
        ecsproxy.StandCompConfig = function (cls, tables, defaultId) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandCompConfigSimple(cls, tables, defaultId);
            }
            return new ConfigDecoInfo(ecsproxy.StandCompConfig, cls, tables, defaultId);
        };
        ecsproxy.StandCompConfigSimple = function (cls, tables, defaultId) {
            return defaultId;
        };
        /**
         * 自定义装饰
         */
        var CustomDataDecoInfo = /** @class */ (function (_super) {
            __extends(CustomDataDecoInfo, _super);
            function CustomDataDecoInfo(t, cls, accessor, defaultId) {
                var _this = _super.call(this, t, cls) || this;
                _this.t = t;
                _this.cls = cls;
                _this.accessor = accessor;
                _this.defaultId = defaultId;
                return _this;
            }
            return CustomDataDecoInfo;
        }(CompDecoInfo));
        ecsproxy.CustomDataDecoInfo = CustomDataDecoInfo;
        /**
         * 配表装饰器
         * @param cls
         * @param clsid
         */
        ecsproxy.StandCustomData = function (cls, accessor, defaultId) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandCustomDataSimple(cls, accessor, defaultId);
            }
            return new CustomDataDecoInfo(ecsproxy.StandCustomData, cls, accessor, defaultId);
        };
        ecsproxy.StandCustomDataSimple = function (cls, accessor, defaultId) {
            return defaultId;
        };
        /**
         * 自定义装饰
         */
        var CustomDataArrayDecoInfo = /** @class */ (function (_super) {
            __extends(CustomDataArrayDecoInfo, _super);
            function CustomDataArrayDecoInfo(t, cls, accessor) {
                var _this = _super.call(this, t, cls) || this;
                _this.t = t;
                _this.cls = cls;
                _this.accessor = accessor;
                return _this;
            }
            return CustomDataArrayDecoInfo;
        }(CompDecoInfo));
        ecsproxy.CustomDataArrayDecoInfo = CustomDataArrayDecoInfo;
        /**
         * 配表装饰器
         * @param cls
         * @param clsid
         */
        ecsproxy.StandCustomDataArray = function (cls, accessor) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandCustomDataArraySimple(cls, accessor);
            }
            return new CustomDataArrayDecoInfo(ecsproxy.StandCustomDataArray, cls, accessor);
        };
        ecsproxy.StandCustomDataArraySimple = function (cls, accessor) {
            return [];
        };
        /**
         * 组件装饰器
         * @param cls
         */
        ecsproxy.StandCompProxy = function (cls) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandCompProxySimple(cls);
            }
            return new CompDecoInfo(ecsproxy.StandCompProxy, cls);
        };
        ecsproxy.StandCompProxySimple = function (cls) {
            return ecsproxy.DeleteMark;
        };
        /**
         * entityId 装饰器
         * @param cls
         */
        ecsproxy.StandEntityProxy = function (cls) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandEntityProxySimple(cls);
            }
            return new CompDecoInfo(ecsproxy.StandEntityProxy, cls);
        };
        ecsproxy.StandEntityProxySimple = function (cls) {
            return "";
        };
        /**
         * entityId[] 装饰器
         * @param cls
         */
        ecsproxy.StandEntityProxyArray = function (cls) {
            if (ecsproxy.proxyClasses.decorated) {
                return ecsproxy.StandEntityProxyArraySimple(cls);
            }
            return new CompDecoInfo(ecsproxy.StandEntityProxyArray, cls);
        };
        ecsproxy.StandEntityProxyArraySimple = function (cls) {
            return [];
        };
        /**
         * 标记为动态增删的组件, 使用代理创建entity时,不会自动新增该组件
         * @param params
         */
        function DecoDynamicComp(target, property) {
            var comps = target['dynamicComps'];
            if (comps == null) {
                comps = target['dynamicComps'] = {};
            }
            comps[property] = true;
        }
        ecsproxy.DecoDynamicComp = DecoDynamicComp;
        // export function DecoArray(params: type) {
        // }
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        /**
         * entityproxy 类装饰器
         * @param target
         */
        function DecoEntityProxy(target) {
            ecsproxy.proxyClasses.entityProxies.push(target);
        }
        ecsproxy.DecoEntityProxy = DecoEntityProxy;
        function DoDecoEntityProxy(target) {
            // 代理类原型
            var demo = new target();
            var protoRaw = Object.getPrototypeOf(demo);
            var Components = target.prototype['Components'];
            if (Components == null) {
                protoRaw['Components'] = Components = [];
            }
            var dynamicComps = protoRaw["dynamicComps"] || {};
            var _loop_4 = function (key) {
                if (demo[key] instanceof ecsproxy.CompDecoInfo) {
                    var decoInfo = demo[key];
                    var cls_2 = decoInfo.cls;
                    var clst = decoInfo.t;
                    if (clst == ecsproxy.StandCompProxy) {
                        Object.defineProperty(protoRaw, key, {
                            get: function () {
                                var self = this;
                                var entityManager = self.entityManager;
                                var entity = self.entity;
                                var proxy = ecsproxy.entityProxyHelper.getComponentProxy(cls_2, entityManager, entity);
                                return proxy;
                            },
                            set: function (value) {
                                if (value != ecsproxy.DeleteMark) {
                                    throw new Error("unsupport set comp function");
                                }
                            },
                        });
                        if (!dynamicComps[key]) {
                            Components.push(cls_2);
                        }
                    }
                    else {
                        console.error("unspport type");
                    }
                }
            };
            for (var _i = 0, _a = Object.keys(demo); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_4(key);
            }
        }
        ecsproxy.DoDecoEntityProxy = DoDecoEntityProxy;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        ecsproxy.DeleteMark = Object.create(null);
        var EntityProxyBase = /** @class */ (function () {
            function EntityProxyBase() {
            }
            EntityProxyBase.prototype.deleteOutdate = function () {
                for (var _i = 0, _a = Object.keys(this); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (this[key] == ecsproxy.DeleteMark) {
                        delete this[key];
                    }
                }
            };
            EntityProxyBase.getComponents = function (proxyClz) {
                var Components = proxyClz.prototype['Components'];
                // let Components = Object.getPrototypeOf(proxyClz)['Components']
                return Components;
            };
            EntityProxyBase.prototype.init = function (entityManager, entity) {
                this.entity = entity;
                this.entityManager = entityManager;
                // this.deleteOutdate()
                return this;
            };
            EntityProxyBase.prototype.getComponent = function (cls) {
                return this.entityManager.getComponent(this.entity, cls);
            };
            EntityProxyBase.prototype.getComponentProxy = function (cls) {
                var proxy = ecsproxy.entityProxyHelper.getComponentProxy(cls, this.entityManager, this.entity);
                return proxy;
            };
            Object.defineProperty(EntityProxyBase.prototype, "entityId", {
                get: function () {
                    return this.entity.identity;
                },
                set: function (entityId) {
                    this.entity = this.entityManager.getEntityById(entityId);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(EntityProxyBase.prototype, "isNull", {
                get: function () {
                    // return this.entity == null
                    return !this.entityManager.existsEntity(this.entity);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(EntityProxyBase.prototype, "isNotNull", {
                get: function () {
                    // return this.entity == null
                    return !this.isNull;
                },
                enumerable: false,
                configurable: true
            });
            EntityProxyBase.prototype.isSame = function (t) {
                return this.entityId == t.entityId;
            };
            EntityProxyBase.prototype.removeSelf = function () {
                this.entityManager.removeEntity(this.entity);
            };
            return EntityProxyBase;
        }());
        ecsproxy.EntityProxyBase = EntityProxyBase;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        var EntityProxyHelper = /** @class */ (function () {
            function EntityProxyHelper() {
            }
            EntityProxyHelper.prototype.init = function () {
                this.clear();
                return this;
            };
            EntityProxyHelper.prototype.clear = function () {
                this.entityProxyMap = fsync.EmptyTable();
                this.compProxyMap = fsync.EmptyTable();
            };
            EntityProxyHelper.prototype.getEntityGUID = function (t, entityManager, entity) {
                return t + "_" + entityManager.identity + "_*_" + entity.identity;
            };
            EntityProxyHelper.prototype.getEntityProxy = function (cls, entityManager, entity) {
                var key = this.getEntityGUID(cls.name, entityManager, entity);
                var proxy = this.entityProxyMap[key];
                if (proxy == null) {
                    this.entityProxyMap[key] = proxy = new cls().init(entityManager, entity);
                }
                return proxy;
            };
            EntityProxyHelper.prototype.getCompGUID = function (t, entityManager, entity) {
                return t + "_" + entityManager.identity + "_*_" + entity.identity;
            };
            EntityProxyHelper.prototype.getComponentProxy = function (cls, entityManager, entity) {
                var key = this.getEntityGUID(cls.name, entityManager, entity);
                var proxy = this.compProxyMap[key];
                if (proxy == null) {
                    this.compProxyMap[key] = proxy = this.createComponentProxy(cls, entityManager, entity);
                }
                return proxy;
            };
            EntityProxyHelper.prototype.createComponentProxy = function (cls, entityManager, entity) {
                var comp = entityManager.getComponent(entity, cls);
                var proxyProto = cls['__ecscompproxyproto'];
                var proxy = Object.create(null);
                Object.setPrototypeOf(proxy, proxyProto);
                proxy.__entityManager = entityManager;
                proxy.setComp(comp);
                proxy.setCompCls(cls);
                proxy.__entity = entity;
                return proxy;
            };
            /**
             * entityproxy -> entity
             * @param entityManager
             * @param proxyClz
             */
            EntityProxyHelper.prototype.createEntityByProxy = function (entityManager, proxyClz) {
                var Components = proxyClz.prototype['Components'];
                // let Components = Object.getPrototypeOf(proxyClz)['Components']
                var entity = entityManager.createEntity(Components);
                return entity;
            };
            /**
             * entityproxy -> entity
             * @param entityManager
             * @param proxy
             */
            EntityProxyHelper.prototype.createEntityProxy = function (entityManager, proxyClz) {
                var Components = proxyClz.prototype['Components'];
                // let Components = Object.getPrototypeOf(proxyClz)['Components']
                var entity = entityManager.createEntity(Components);
                var proxy = this.getEntityProxy(proxyClz, entityManager, entity);
                return proxy;
            };
            EntityProxyHelper.prototype.getEntityProxyComponents = function (proxyClz) {
                var Components = proxyClz.prototype['Components'];
                // let Components = Object.getPrototypeOf(proxyClz)['Components']
                return Components;
            };
            return EntityProxyHelper;
        }());
        ecsproxy.EntityProxyHelper = EntityProxyHelper;
        ecsproxy.entityProxyHelper = new EntityProxyHelper().init();
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        var EntityProxyQuery = /** @class */ (function () {
            function EntityProxyQuery() {
            }
            EntityProxyQuery.prototype.init = function (entityManager, EntityProxyClass) {
                this.entityManager = entityManager;
                this.query = entityManager.createQuery();
                this.EntityProxyClass = EntityProxyClass;
                return this;
            };
            EntityProxyQuery.prototype.with = function (cls) {
                this.query.with(cls);
                return this;
            };
            EntityProxyQuery.prototype.withKey = function (k) {
                return this;
            };
            EntityProxyQuery.prototype.forEach = function (call) {
                var _this = this;
                this.query.forEach(function (entity) {
                    var proxy = ecsproxy.entityProxyHelper.getEntityProxy(_this.EntityProxyClass, _this.entityManager, entity);
                    call(proxy);
                });
            };
            EntityProxyQuery.prototype.toArray = function () {
                var _this = this;
                return this.query.toArray().map(function (entity) {
                    return ecsproxy.entityProxyHelper.getEntityProxy(_this.EntityProxyClass, _this.entityManager, entity);
                });
            };
            EntityProxyQuery.prototype.first = function () {
                return this.toArray()[0];
            };
            return EntityProxyQuery;
        }());
        ecsproxy.EntityProxyQuery = EntityProxyQuery;
        var EntityQueryHelper = /** @class */ (function () {
            function EntityQueryHelper() {
            }
            EntityQueryHelper.prototype.createQuery = function (entityManager, cls) {
                var query = new EntityProxyQuery().init(entityManager, cls);
                return query;
            };
            return EntityQueryHelper;
        }());
        ecsproxy.EntityQueryHelper = EntityQueryHelper;
        ecsproxy.entityQueryHelper = new EntityQueryHelper();
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        var EntityProxyArray = /** @class */ (function (_super) {
            __extends(EntityProxyArray, _super);
            function EntityProxyArray() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EntityProxyArray.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                var host = this.__host;
                var comp = host.__comp;
                var entityManager = host.__entityManager;
                var cls = this.__cls;
                var ids = comp[this.__key];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var id = void 0;
                    if (typeof (item) == "object") {
                        if (item instanceof fsync.Entity) {
                            id = item.identity;
                        }
                        else {
                            id = item.entityId;
                        }
                    }
                    else if (typeof (item) == "string") {
                        id = item;
                    }
                    else {
                        console.error("invalid type");
                    }
                    ids.push(id);
                    var entity = entityManager.wrapEntityId(id);
                    var proxy = ecsproxy.entityProxyHelper.getEntityProxy(cls, entityManager, entity);
                    _super.prototype.push.call(this, proxy);
                }
                return this.length;
            };
            return EntityProxyArray;
        }(Array));
        ecsproxy.EntityProxyArray = EntityProxyArray;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        /**
         * 代理类注册类
         */
        var ProxyClasses = /** @class */ (function () {
            function ProxyClasses() {
                this.compProxies = [];
                this.entityProxies = [];
                this.decorated = false;
                this.autoDecorate = true;
            }
            ProxyClasses.prototype.init = function () {
                /**
                 * 此处自动调用一次 decorateAll()
                 * - 若项目中出现引用依赖问题,那么
                 */
                // setTimeout(() => {
                // 	if (this.autoDecorate) {
                // 		this.decorateAll()
                // 	}
                // }, 1)
                return this;
            };
            /**
             * 为了避免循环依赖导致装饰异常,延迟到全部类注册完之后一起装饰
             */
            ProxyClasses.prototype.decorateAll = function () {
                if (this.decorated) {
                    return;
                }
                for (var _i = 0, _a = this.compProxies; _i < _a.length; _i++) {
                    var proxyClass = _a[_i];
                    ecsproxy.DoDecoCompProxy(proxyClass);
                }
                for (var _b = 0, _c = this.entityProxies; _b < _c.length; _b++) {
                    var proxyClass = _c[_b];
                    ecsproxy.DoDecoEntityProxy(proxyClass);
                }
                ecsproxy.StandCompConfig = ecsproxy.StandCompConfigSimple;
                ecsproxy.StandCompProxy = ecsproxy.StandCompProxySimple;
                ecsproxy.StandEntityProxy = ecsproxy.StandEntityProxySimple;
                ecsproxy.StandEntityProxyArray = ecsproxy.StandEntityProxyArraySimple;
                ecsproxy.StandCustomData = ecsproxy.StandCustomDataSimple;
                ecsproxy.StandCustomDataArray = ecsproxy.StandCustomDataArraySimple;
                this.decorated = true;
            };
            return ProxyClasses;
        }());
        ecsproxy.ProxyClasses = ProxyClasses;
        /**
         * 代理类注册类实例
         */
        ecsproxy.proxyClasses = new ProxyClasses().init();
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        var ProxySystemBase = /** @class */ (function (_super) {
            __extends(ProxySystemBase, _super);
            function ProxySystemBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ProxySystemBase.prototype.createQuery = function (cls) {
                return ecsproxy.entityQueryHelper.createQuery(this.entityManager, cls);
            };
            return ProxySystemBase;
        }(fsync.SystemBase));
        ecsproxy.ProxySystemBase = ProxySystemBase;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var fsync;
(function (fsync) {
    var ecsproxy;
    (function (ecsproxy) {
        var AnyEntityProxy = /** @class */ (function (_super) {
            __extends(AnyEntityProxy, _super);
            function AnyEntityProxy() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AnyEntityProxy = __decorate([
                ecsproxy.DecoEntityProxy
            ], AnyEntityProxy);
            return AnyEntityProxy;
        }(ecsproxy.EntityProxyBase));
        ecsproxy.AnyEntityProxy = AnyEntityProxy;
    })(ecsproxy = fsync.ecsproxy || (fsync.ecsproxy = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Translation = /** @class */ (function () {
        function Translation() {
            this.value = new fsync.Vector3();
        }
        Translation = __decorate([
            fsync.cname("Translation"),
            fsync.ecsproxy.DecoCompProxy
        ], Translation);
        return Translation;
    }());
    fsync.Translation = Translation;
    var Scale = /** @class */ (function () {
        function Scale() {
            this.value = new fsync.Vector3(1);
        }
        Scale = __decorate([
            fsync.cname("Scale"),
            fsync.ecsproxy.DecoCompProxy
        ], Scale);
        return Scale;
    }());
    fsync.Scale = Scale;
    var Rotation = /** @class */ (function () {
        function Rotation() {
            this.value = fsync.Vector4.fromNumArray([0, 0, 0, 1]);
        }
        Rotation = __decorate([
            fsync.cname("Rotation"),
            fsync.ecsproxy.DecoCompProxy
        ], Rotation);
        return Rotation;
    }());
    fsync.Rotation = Rotation;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Device = /** @class */ (function () {
        function Device() {
        }
        Object.defineProperty(Device.prototype, "pixelRatio", {
            get: function () {
                return window.devicePixelRatio;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Device.prototype, "clientRect", {
            get: function () {
                return {
                    x: 0,
                    y: 0,
                    width: this.clientSize.x,
                    height: this.clientSize.y,
                };
            },
            enumerable: false,
            configurable: true
        });
        Device.prototype.init = function () {
            this.userEventHandlers = [];
            this.clientSize = new fsync.Vector3();
            return this;
        };
        return Device;
    }());
    fsync.Device = Device;
    fsync.device = new Device().init();
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Platform = /** @class */ (function () {
        function Platform() {
            this.isBrowser = false;
        }
        Platform.prototype.init = function () {
            this.isBrowser = (document != null);
            return this;
        };
        return Platform;
    }());
    fsync.Platform = Platform;
    fsync.platform = new Platform().init();
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var _a;
    var keyCodeMap = (_a = {},
        _a[65] = 'a',
        _a[87] = 'w',
        _a[83] = 's',
        _a[68] = 'd',
        _a[32] = 'space',
        _a[66] = 'b',
        _a);
    var UserInput = /** @class */ (function () {
        function UserInput() {
            this.enable = true;
        }
        Object.defineProperty(UserInput.prototype, "clientSize", {
            get: function () {
                return fsync.device.clientSize;
            },
            enumerable: false,
            configurable: true
        });
        UserInput.prototype.init = function () {
            var _this = this;
            this.eventHandlerMap = fsync.EmptyTable();
            this.eventHandler = function (sdata) {
                var data = JSON.parse(sdata);
                if (!_this.enable) {
                    return;
                }
                if (data.action == "updateclientsize") {
                    _this.clientSize.x = data.clientSize.width;
                    _this.clientSize.y = data.clientSize.height;
                }
                if (data.event.keyCode != null) {
                    data.event.key = keyCodeMap[data.event.keyCode];
                }
                data.event.key = keyCodeMap[data.event.keyCode];
                for (var _i = 0, _a = Object.values(_this.eventHandlerMap); _i < _a.length; _i++) {
                    var handler = _a[_i];
                    try {
                        handler(data);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            };
            fsync.device.userEventHandlers.push(this.eventHandler);
            return this;
        };
        UserInput.prototype.addHandler = function (name, handler) {
            this.eventHandlerMap[name] = handler;
        };
        UserInput.inst = new UserInput().init();
        return UserInput;
    }());
    fsync.UserInput = UserInput;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ColliderCastInput = /** @class */ (function () {
        function ColliderCastInput() {
        }
        return ColliderCastInput;
    }());
    fsync.ColliderCastInput = ColliderCastInput;
    var RayCastInput = /** @class */ (function () {
        function RayCastInput() {
        }
        return RayCastInput;
    }());
    fsync.RayCastInput = RayCastInput;
    var CollisionHelper = /** @class */ (function () {
        function CollisionHelper() {
        }
        CollisionHelper.prototype.castTargetColliders2D = function (input, call) {
            var entityManager = input.entityManager, query = input.query, entity1 = input.target;
            var entities = query.toArray();
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity2 = entities_1[_i];
                if (entity1 == entity2) {
                    continue;
                }
                var trans1 = entityManager.getComponent(entity1, fsync.Translation);
                var shape1 = entityManager.getComponent(entity1, fsync.Shape);
                var trans2 = entityManager.getComponent(entity2, fsync.Translation);
                var shape2 = entityManager.getComponent(entity2, fsync.Shape);
                var dist = fsync.Vector.distance(trans1.value, trans2.value);
                if (dist <= (shape1.radius + shape2.radius)) {
                    if (!!call(entity1, entity2)) {
                        break;
                    }
                }
            }
        };
        CollisionHelper.prototype.castTargetWithRay = function (input, call) {
            var entityManager = input.entityManager, beginPoint = input.beginPoint, endPoint = input.endPoint, query = input.query, entity1 = input.target;
            var entities = query.toArray();
            // 射线检测参数
            var p1 = beginPoint;
            var p2 = endPoint;
            var dirVec = fsync.Vector.normalizeSelf(fsync.Vector.subDown(p1.clone(), p2));
            // 计算点到直线距离
            var calcPLD = function (pt) {
                var tv = fsync.Vector.subDown(p1.clone(), pt);
                return Math.abs(fsync.Vector.dot(dirVec, tv));
            };
            // 计算三点角度
            var calcTh = function (p0, p1, p2) {
                var th = fsync.Vector.dot(fsync.Vector.subDown(p0.clone(), p1), fsync.Vector.subDown(p0.clone(), p2));
                return th;
            };
            for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                var entity2 = entities_2[_i];
                if (entity1 == entity2) {
                    continue;
                }
                var trans1 = entityManager.getComponent(entity1, fsync.Translation);
                var shape1 = entityManager.getComponent(entity1, fsync.Shape);
                var trans2 = entityManager.getComponent(entity2, fsync.Translation);
                var shape2 = entityManager.getComponent(entity2, fsync.Shape);
                var distanceMin = shape1.radius + shape2.radius;
                // let dist = Vector.distance(trans1.value, trans2.value)
                // if (dist <= (shape1.radius + shape2.radius)) {
                // 	if (call(entity1, entity2)) {
                // 	break
                // }
                // }
                var p3 = trans2.value;
                var th1 = calcTh(p1, p2, p3);
                if (th1 < 0) {
                    // 在起点外侧
                    var distance = fsync.Vector.distance(p1, p3);
                    if (distance < distanceMin) {
                        if (!!call(entity1, entity2)) {
                            break;
                        }
                    }
                }
                else {
                    var th2 = calcTh(p2, p1, p3);
                    if (th2 < 0) {
                        // 终点外侧
                        var distance = fsync.Vector.distance(p2, p3);
                        if (distance < distanceMin) {
                            if (!!call(entity1, entity2)) {
                                break;
                            }
                        }
                    }
                    else {
                        // 线段内侧
                        var D = calcPLD(trans2.value);
                        if (D < distanceMin) {
                            if (!!call(entity1, entity2)) {
                                break;
                            }
                        }
                    }
                }
            }
        };
        return CollisionHelper;
    }());
    fsync.CollisionHelper = CollisionHelper;
    fsync.collisionHelper = new CollisionHelper();
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Shape = /** @class */ (function () {
        function Shape() {
        }
        Shape = __decorate([
            fsync.cname("Shape"),
            fsync.ecsproxy.DecoCompProxy
        ], Shape);
        return Shape;
    }());
    fsync.Shape = Shape;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var PrefabMeta = /** @class */ (function () {
        function PrefabMeta() {
        }
        PrefabMeta.prototype.init = function (prefabId) {
            this.prefabId = prefabId;
            return this;
        };
        return PrefabMeta;
    }());
    fsync.PrefabMeta = PrefabMeta;
    /**
     * prefab实例化环境
     */
    var ViewPrefabEnv = /** @class */ (function () {
        function ViewPrefabEnv() {
        }
        ViewPrefabEnv.prototype.init = function (world, viewBinder, prefabHelper) {
            this.utils = world.utils;
            this.entityManager = world.entityManager;
            this.viewBinder = viewBinder;
            this.prefabHelper = prefabHelper;
            return this;
        };
        ViewPrefabEnv.prototype.instantiate = function (prefab) {
            return this.prefabHelper.instantiate(prefab, this);
        };
        return ViewPrefabEnv;
    }());
    fsync.ViewPrefabEnv = ViewPrefabEnv;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var PrefabBase = /** @class */ (function () {
        function PrefabBase() {
        }
        PrefabBase.prototype.init = function () {
            return this;
        };
        PrefabBase.prototype.load = function () {
            return this;
        };
        PrefabBase.prototype.create = function (depsEnv) {
            var entity = this.createEntity(depsEnv);
            var meta = this.getPrefabMeta();
            depsEnv.entityManager.attachComponent(entity, meta);
            // let view = this.createView(depsEnv)
            // depsEnv.viewBinder.bindEntityView(entity, view)
            return entity;
        };
        PrefabBase.prototype.getPrefabMeta = function () {
            throw new Error("Method not implemented.");
        };
        PrefabBase.prototype.createEntity = function (depsEnv) {
            throw new Error("Method not implemented.");
        };
        return PrefabBase;
    }());
    fsync.PrefabBase = PrefabBase;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var PrefabManager = /** @class */ (function () {
        function PrefabManager() {
            this.prefabViewMap = fsync.EmptyTable();
        }
        PrefabManager.prototype.init = function () {
            this.prefabMap = fsync.EmptyTable();
            return this;
        };
        PrefabManager.prototype.loadPrefab = function (prefabClz) {
            if (this.prefabMap[prefabClz.name]) {
                return this.prefabMap[prefabClz.name];
            }
            var prefab = new prefabClz().init();
            prefab.load();
            this.prefabMap[prefabClz.name] = prefab;
            return prefab;
        };
        PrefabManager.prototype.registerPrefabView = function (key, view) {
            this.prefabViewMap[key] = view;
        };
        PrefabManager.prototype.getPrefabView = function (key) {
            return this.prefabViewMap[key];
        };
        PrefabManager.inst = new PrefabManager().init();
        return PrefabManager;
    }());
    fsync.PrefabManager = PrefabManager;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ScenePrefab = /** @class */ (function (_super) {
        __extends(ScenePrefab, _super);
        function ScenePrefab() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ScenePrefab.prototype, "prefabMananger", {
            get: function () {
                return fsync.PrefabManager.inst;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ScenePrefab.prototype, "entityManager", {
            get: function () {
                return this.depsEnv.entityManager;
            },
            enumerable: false,
            configurable: true
        });
        ScenePrefab.prototype.setEnv = function (depsEnv) {
            this.depsEnv = depsEnv;
        };
        ScenePrefab.prototype.instantiate = function (prefab) {
            return prefab.create(this.depsEnv);
        };
        ScenePrefab.prototype.instantiateEntity = function (prefab) {
            return prefab.createEntity(this.depsEnv);
        };
        ScenePrefab.prototype.createEntity = function (depsEnv) {
            return null;
        };
        return ScenePrefab;
    }(fsync.PrefabBase));
    fsync.ScenePrefab = ScenePrefab;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    window["fsync"] = fsync;
    window["lang"] = lang;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var app;
    (function (app) {
        var GameSceneBase = /** @class */ (function () {
            function GameSceneBase() {
            }
            GameSceneBase.prototype.clear = function () {
                this.subScenes.forEach(function (scene) { return scene.clear(); });
            };
            GameSceneBase.prototype.start = function () {
                this.subScenes.forEach(function (scene) { return scene.start(); });
            };
            GameSceneBase.prototype.update = function () {
                this.subScenes.forEach(function (scene) { return scene.update(); });
            };
            GameSceneBase.prototype.init = function (fightWorld, sharedSlots) {
                this.sharedSlots = sharedSlots;
                this.fightWorld = fightWorld;
                this.subScenes = [];
                return this;
            };
            GameSceneBase.prototype.loadSubScenes = function (cls) {
                var fightWorld = this.fightWorld;
                var sharedSlots = this.sharedSlots;
                var mainScene = new cls().init(fightWorld.mainWorld, sharedSlots);
                this.subScenes.push(mainScene);
                var predictScene = new cls().init(fightWorld.predictWorld, sharedSlots);
                this.subScenes.push(predictScene);
                for (var _i = 0, _a = this.subScenes; _i < _a.length; _i++) {
                    var scene = _a[_i];
                    scene.initScene();
                }
            };
            return GameSceneBase;
        }());
        app.GameSceneBase = GameSceneBase;
    })(app = fsync.app || (fsync.app = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var app;
    (function (app) {
        /**
         * 用于构建游戏世界运作规则
         */
        var GameWorld = /** @class */ (function () {
            function GameWorld() {
                /**
                 * 是否准备完毕可以调度
                 */
                this.isWorldReady = false;
            }
            /**
             * 清空重置世界
             */
            GameWorld.prototype.clear = function () {
                this.isWorldReady = false;
                this.mainWorld.clear();
                this.predictWorld.clear();
                this.mainProcess.clear();
            };
            /**
             * 开始运转
             */
            GameWorld.prototype.start = function () {
                this.mainWorld.start();
                this.predictWorld.start();
                this.isWorldReady = true;
            };
            /**
             * 加载子世界
             * @param clsMain
             * @param clsPredict
             * @param slots
             */
            GameWorld.prototype.loadSubWorlds = function (clsMain, clsPredict, slots) {
                var mainWorld = new clsMain().init({
                    mainProcess: this.mainProcess,
                    updater: this.mainProcess.mainUpdater,
                    world: this.mainProcess.worldMain,
                });
                var predictWorld = new clsPredict().init({
                    mainProcess: this.mainProcess,
                    updater: this.mainProcess.predictUpdater,
                    world: this.mainProcess.worldPredict,
                });
                this.mainWorld = mainWorld;
                this.predictWorld = predictWorld;
                mainWorld.initSystems(slots);
                predictWorld.initSystems(slots);
            };
            GameWorld.prototype.init = function () {
                this.mainProcess = new fsync.WorldMainProcess().init();
                return this;
            };
            /**
             * 世界调度
             */
            GameWorld.prototype.update = function () {
                if (!this.isWorldReady) {
                    return;
                }
                this.mainWorld.update();
                this.predictWorld.update();
                this.mainProcess.update();
            };
            return GameWorld;
        }());
        app.GameWorld = GameWorld;
    })(app = fsync.app || (fsync.app = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var app;
    (function (app) {
        /**
         * 构建管理游戏玩法场景
         */
        var SubScene = /** @class */ (function () {
            function SubScene() {
            }
            /**
             * 清除场景
             */
            SubScene.prototype.clear = function () {
            };
            /**
             * 开始新场景运作
             */
            SubScene.prototype.start = function () {
            };
            SubScene.prototype.init = function (world, sharedSlots) {
                this.world = world;
                this.sharedSlots = sharedSlots;
                this.initScene();
                return this;
            };
            SubScene.prototype.initScene = function () {
            };
            SubScene.prototype.update = function () {
            };
            return SubScene;
        }());
        app.SubScene = SubScene;
    })(app = fsync.app || (fsync.app = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var app;
    (function (app) {
        /**
         * 用于构建游戏世界规则
         */
        var SubWorld = /** @class */ (function () {
            function SubWorld() {
                this.name = "unkown_SubWorld";
            }
            Object.defineProperty(SubWorld.prototype, "entityManager", {
                get: function () {
                    return this.world.entityManager;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SubWorld.prototype, "dataManager", {
                get: function () {
                    return this.world.dataManager;
                },
                enumerable: false,
                configurable: true
            });
            SubWorld.prototype.clear = function () {
                // this.world.entityManager.clearEntities()
            };
            SubWorld.prototype.start = function () {
                this.timer.setTime(Date.now());
            };
            /**
             * 创建子系统并加入调度组
             * @param groupName
             * @param tsys
             */
            SubWorld.prototype.addSystem = function (tsys, groupName) {
                var sys = new tsys();
                sys.world = this.world;
                sys.init();
                this.updater.getUpdaterGroup(groupName).addUpdater(sys);
                return sys;
            };
            /**
             * 初始化各种子系统实例设置
             * @param sharedSlots
             */
            SubWorld.prototype.initSystems = function (sharedSlots) {
            };
            SubWorld.prototype.init = function (input) {
                this.world = input.world;
                this.updater = input.updater;
                this.mainProcess = input.mainProcess;
                this.timer = this.world.utils.timer;
                this.timer.setMaxDeltaTime(100);
                return this;
            };
            SubWorld.prototype.update = function () {
                // this.timer.updateTime(Date.now())
            };
            return SubWorld;
        }());
        app.SubWorld = SubWorld;
    })(app = fsync.app || (fsync.app = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var sortCmds = function (cmds) {
        cmds.sort(function (a, b) { return a.cmdIndex - b.cmdIndex; });
    };
    /**
     * 针对单个角色的命令缓冲管理
     */
    var SinglePortCmdBuffer = /** @class */ (function () {
        function SinglePortCmdBuffer() {
            this.name = "unknown";
            this.latestNetCmd = null;
            this.latestOrderedCmdIndex = 0;
            this.latestLocalCmd = null;
            this.needSync = false;
            /**
             * 处理网络波动造成的挤帧，避免因此造成的跳帧
             * - 没有特殊情况，每帧都只发送一个帧命令包
             * - pops 已按 cmdIndex 递增排序，如果出现 (cmdIndex0 < cmdIndex1 && frameCount0 >= frameCount1)，则判定 cmdIndex1 对应的 cmd 为重叠帧
             * - 如果出现了挤帧，那么客户端代替服务端进行丢帧（仅仅标记为重合帧，但是不直接删除，由业务处理）
             */
            this.curNetFrameCount = -1;
            /**
             * 粘帧次数
             */
            this.surgeTimes = 0;
            /**
             * 允许最大粘帧次数
             */
            this.allowSurgeTimesMax = 1;
        }
        SinglePortCmdBuffer.prototype.init = function (roleId) {
            this.roleId = roleId;
            this.cmds = [];
            this.cmdReorderQueue = new fsync.CmdReorderQueue().init();
            this.curCmdIndex = 0;
            this.curFrameCount = 0;
            this.curOutdateCmdIndex = 0;
            return this;
        };
        SinglePortCmdBuffer.prototype.getLatestNetCmd = function () {
            return this.latestNetCmd;
        };
        /**
         * 获取连续cmdIndex下,最新的net cmd
         */
        SinglePortCmdBuffer.prototype.getOrderedNetCmd = function () {
            sortCmds(this.cmds);
            var cmdIndex = this.latestOrderedCmdIndex;
            this.cmds.forEach(function (cmd) {
                if (cmd.cmdIndex == cmdIndex + 1) {
                    cmdIndex += 1;
                }
            });
            this.latestOrderedCmdIndex = cmdIndex;
            return this.cmds.find(function (cmd) { return cmd.cmdIndex == cmdIndex; });
        };
        /**
         * 按cmdIndex排序, 获取最新的本地命令
         */
        SinglePortCmdBuffer.prototype.getLatestLocalCmd = function () {
            return this.latestLocalCmd;
        };
        SinglePortCmdBuffer.prototype.putCmd = function (cmd) {
            if (cmd.route == "local") {
                this._putCmd(cmd);
            }
            else {
                this.cmdReorderQueue.put(cmd);
                this.flushNetCmds();
                this.adjustSurgedCmds(cmd);
            }
        };
        // 重新整理接收到的网络命令顺序
        SinglePortCmdBuffer.prototype.flushNetCmds = function () {
            var cmdReorderQueue = this.cmdReorderQueue;
            while (true) {
                var cmd = cmdReorderQueue.pop();
                if (cmd == null) {
                    break;
                }
                this._putCmd(cmd);
            }
        };
        SinglePortCmdBuffer.prototype._putCmd = function (cmd) {
            if (cmd.route == "net") {
                if (this.latestNetCmd == null || this.latestNetCmd.cmdIndex < cmd.cmdIndex) {
                    this.latestNetCmd = cmd;
                }
            }
            var c = this.cmds.find(function (c) { return c.cmdId == cmd.cmdId; });
            if (c != null) {
                if (c.route == "net") {
                    //pass
                }
                else if (c.route == "local") {
                    // 优先使用net替换local
                    if (cmd.route == "net") {
                        this.needSync = true;
                        // console.log("replace", c.cmdIndex, '->', cmd.cmdIndex)
                        var index = this.cmds.indexOf(c);
                        this.cmds[index] = cmd;
                    }
                }
            }
            else {
                if (cmd.route == "net") {
                    this.needSync = true;
                }
                // 没有net，则暂时使用local
                this.cmds.push(cmd);
            }
        };
        SinglePortCmdBuffer.prototype.adjustSurgedCmds = function (triggerCmd) {
            var surLastCmd = this.surLastCmd;
            //#region 
            // 辅助前置条件, 仅帮助优化性能
            if (surLastCmd != null
                && triggerCmd != null
                && (surLastCmd.cmdIndex + 1 != triggerCmd.cmdIndex)) {
                return;
            }
            //#endregion
            var cmds = this.cmds.filter(function (cmd) { return cmd.route == "net"; });
            if (cmds.length > 0) {
                if (surLastCmd == null) {
                    surLastCmd = cmds[0];
                    cmds = cmds.slice(1);
                }
                cmds.forEach(function (cmd, index) {
                    if (surLastCmd.cmdIndex + 1 == cmd.cmdIndex) {
                        var localDiff = cmd.createFrameCount - surLastCmd.createFrameCount;
                        var netDiff = cmd.frameCount - surLastCmd.frameCount;
                        var diff = netDiff - localDiff;
                        if (0 < diff
                        // && diff < 5
                        ) {
                            if (!cmd.isAdjustedForSurge) {
                                cmd.isAdjustedForSurge = true;
                                cmd.netFrameCount = cmd.frameCount;
                                // let predictFrameCount = surLastCmd.frameCount + localDiff
                                var maxDiff = 3;
                                if (diff > 5) {
                                    maxDiff = 2;
                                }
                                var predictFrameCount = cmd.frameCount - Math.min(diff, maxDiff);
                                if (false) {
                                    console.log("adjustSurgedCmds:(" + surLastCmd.cmdIndex + "," + surLastCmd.createFrameCount + "," + surLastCmd.frameCount + ")"
                                        + (",(" + cmd.cmdIndex + "," + cmd.createFrameCount + "," + cmd.frameCount + ")")
                                        + ("|" + cmd.frameCount + " -> " + predictFrameCount));
                                }
                                cmd.frameCount = predictFrameCount;
                                if (cmd.frameCount < 0) {
                                    console.error("lkjwefklj");
                                }
                            }
                        }
                        surLastCmd = cmd;
                    }
                });
            }
            this.surLastCmd = surLastCmd;
        };
        SinglePortCmdBuffer.prototype.popFrameCmds = function (frameCount, pops) {
            sortCmds(this.cmds);
            // const outdateFrameCount = this.curFrameCount
            var outdateCmdIndex = this.curCmdIndex;
            var curCmdIndex = this.curCmdIndex;
            for (var _i = 0, _a = this.cmds; _i < _a.length; _i++) {
                var cmd = _a[_i];
                if (curCmdIndex + 1 == cmd.cmdIndex && cmd.frameCount <= frameCount) {
                    this.processFrameCmdsSurge(cmd);
                    pops.push(cmd);
                    if (curCmdIndex != cmd.cmdIndex - 1) {
                        console.warn("invalid cmdIndex");
                    }
                    curCmdIndex = Math.max(curCmdIndex, cmd.cmdIndex);
                }
            }
            this.curCmdIndex = curCmdIndex;
            this.curFrameCount = frameCount;
            this.cleanOutdateCmds();
            return pops;
        };
        SinglePortCmdBuffer.prototype.processFrameCmdsSurge = function (cmd) {
            // sortCmds(pops)
            var allowSurgeTimesMax = this.allowSurgeTimesMax;
            var frameCount = this.curNetFrameCount;
            // for (let cmd of pops) 
            {
                if (cmd.route == "net") {
                    if (cmd.frameCount <= frameCount) {
                        var isSurge = true;
                        if (cmd.frameCount > frameCount - 2) {
                            if (this.surgeTimes <= allowSurgeTimesMax) {
                                this.surgeTimes++;
                                isSurge = false;
                            }
                        }
                        if (isSurge) {
                            cmd.isSurge = true;
                            console.warn("marksurge:", this.name, this.roleId, cmd.cmdIndex, "for", frameCount, ">=", cmd.frameCount);
                        }
                    }
                    else {
                        // 帧数增大
                        frameCount = cmd.frameCount;
                        this.surgeTimes = 0;
                    }
                    this.curNetFrameCount = frameCount;
                }
            }
        };
        /**
         * 清理过期的指令
         */
        SinglePortCmdBuffer.prototype.cleanOutdateCmds = function () {
            var cmds = this.cmds;
            sortCmds(cmds);
            var outdateIndex = this.curOutdateCmdIndex;
            var delIndex = 0;
            for (var _i = 0, cmds_1 = cmds; _i < cmds_1.length; _i++) {
                var cmd = cmds_1[_i];
                if (cmd.cmdIndex == outdateIndex + 1 && cmd.frameCount <= this.curFrameCount && cmd.route == "net") {
                    // delete
                    delIndex++;
                    outdateIndex++;
                }
            }
            this.curOutdateCmdIndex = outdateIndex;
            // this.cmds = cmds.slice(delIndex)
            this.cmds = cmds.filter(function (c) { return c.cmdIndex >= outdateIndex - 8; });
        };
        // /**
        //  * 清理过期的指令
        //  */
        // cleanOutdateLocalCmdsForce() {
        // 	let cmds = this.cmds
        // 	sortCmds(cmds)
        // 	let outdateIndex = this.curOutdateCmdIndex + 1
        // 	let delIndex = 0
        // 	for (let cmd of cmds) {
        // 		if (cmd.cmdIndex <= outdateIndex && cmd.frameCount <= this.curFrameCount) {
        // 			// delete
        // 			delIndex++
        // 			outdateIndex++
        // 		}
        // 	}
        // 	this.curOutdateCmdIndex = outdateIndex - 1
        // 	this.cmds = cmds.slice(delIndex - 12)
        // }
        SinglePortCmdBuffer.prototype.mergeFrom = function (cmdBuffer) {
            cmdBuffer.flushNetCmds();
            this.flushNetCmds();
            var tCmds = this.cmds;
            var sCmds = cmdBuffer.cmds;
            var cmdIdMap = fsync.EmptyTable();
            for (var _i = 0, tCmds_1 = tCmds; _i < tCmds_1.length; _i++) {
                var cmd = tCmds_1[_i];
                cmdIdMap[cmd.cmdId] = true;
            }
            for (var i = sCmds.length - 1; i > -1; i--) {
                var cmd = sCmds[i];
                if (!cmdIdMap[cmd.cmdId]) {
                    // 深度克隆, 避免共享数据bug
                    tCmds.unshift(JSON.parse(JSON.stringify(cmd)));
                }
            }
            this.syncLocalCmd();
            if (cmdBuffer.surLastCmd == null) {
                this.surLastCmd = null;
            }
            else {
                this.surLastCmd = this.cmds.find(function (cmd) { return cmd.cmdIndex == cmdBuffer.surLastCmd.cmdIndex; });
            }
            this.adjustSurgedCmds(null);
            this.curCmdIndex = cmdBuffer.curCmdIndex;
            this.curFrameCount = cmdBuffer.curFrameCount;
            this.curOutdateCmdIndex = cmdBuffer.curOutdateCmdIndex;
            this.cleanOutdateCmds();
            console.log("mergex");
        };
        SinglePortCmdBuffer.prototype.syncLocalCmd = function () {
            // 适配本地指令
            var latestNetCmd = this.getLatestNetCmd();
            if (latestNetCmd != null) {
                var diff = latestNetCmd.frameCount - latestNetCmd.createFrameCount;
                if (diff < 0) {
                    diff = 0;
                }
                for (var _i = 0, _a = this.cmds; _i < _a.length; _i++) {
                    var cmd = _a[_i];
                    if (cmd.route == "local") {
                        cmd.frameCount = cmd.createFrameCount + diff + 1;
                    }
                }
            }
        };
        return SinglePortCmdBuffer;
    }());
    fsync.SinglePortCmdBuffer = SinglePortCmdBuffer;
    /**
     * 命令缓冲
     * - 对收到的网络命令和本地命令执行合并
     * - 同时对收到的网络命令执行排序合帧, 应对丢帧/补帧等情况
     */
    var InputCmdBuffer = /** @class */ (function () {
        function InputCmdBuffer() {
            this.orderid = ++InputCmdBuffer.orderid;
            // constructor() {
            // 	console.error("lkwjeflk")
            // }
            this.route = "net";
            this.cmdBuffers = fsync.EmptyTable();
            this.latestLocalCmd = null;
            this.latestUserCmd = null;
            this.latestNetCmd = null;
            /**
             * 标记是否有同步需求
             */
            this.needSync = false;
            /**
             * 标记是否需要立即同步
             */
            this.needSyncRightNow = false;
            this.surgeTimes = 0;
        }
        InputCmdBuffer.prototype.getLatestLocalCmd = function () {
            return this.latestLocalCmd;
        };
        InputCmdBuffer.prototype.getLatestUserCmd = function () {
            return this.latestUserCmd;
        };
        InputCmdBuffer.prototype.getLatestNetCmd = function () {
            return this.latestNetCmd;
        };
        InputCmdBuffer.prototype.getCmdBuffer = function (roleId) {
            var cmdBuffer = this.cmdBuffers[roleId];
            if (cmdBuffer == null) {
                cmdBuffer = new SinglePortCmdBuffer().init(roleId);
                cmdBuffer.name = this.name;
                this.cmdBuffers[roleId] = cmdBuffer;
            }
            return cmdBuffer;
        };
        // protected netCmds: IGameInputCmd[] = []
        // /**
        //  * 将网络指令存入缓存, 等待下一帧
        //  * @param cmd 
        //  */
        // putNetCmd(cmd: IGameInputCmd) {
        // 	this.netCmds.push(cmd)
        // }
        // update() {
        // 	this.netCmds.forEach(cmd => {
        // 		this.putCmd(cmd)
        // 	})
        // 	this.netCmds.length = 0
        // }
        InputCmdBuffer.prototype.putCmd = function (cmd) {
            if (cmd.cmdType != "Pass") {
                if (this.latestUserCmd == null || this.latestUserCmd.cmdIndex < cmd.cmdIndex) {
                    this.latestUserCmd = cmd;
                }
            }
            if (cmd.route == "net") {
                if (this.latestNetCmd == null || this.latestNetCmd.cmdIndex == null || cmd.cmdIndex == null || this.latestNetCmd.cmdIndex < cmd.cmdIndex) {
                    this.latestNetCmd = cmd;
                }
            }
            else if (cmd.route == "local") {
                if (this.latestLocalCmd == null || this.latestLocalCmd.cmdIndex < cmd.cmdIndex) {
                    this.latestLocalCmd = cmd;
                }
            }
            if (cmd.cmdType == "Pass") {
                return;
            }
            // if (this.name == "predict") {
            // 	// if (cmd.route == "net") {
            // 	console.log("receivecmd:", cmd.route, cmd.cmdIndex, cmd)
            // 	// }
            // }
            var cmdBuffer = this.getCmdBuffer(cmd.roleId);
            cmdBuffer.needSync = false;
            cmdBuffer.putCmd(cmd);
            if (cmdBuffer.needSync) {
                cmdBuffer.needSync = false;
                this.needSync = true;
            }
        };
        InputCmdBuffer.prototype.popFrameCmds = function (frameCount) {
            var pops = [];
            for (var _i = 0, _a = Object.values(this.cmdBuffers); _i < _a.length; _i++) {
                var cmdBuffer = _a[_i];
                cmdBuffer.popFrameCmds(frameCount, pops);
            }
            // 输出必须严格唯一排序，否则不同客户端有可能因为网络波动，结果不同
            pops.sort(function (a, b) {
                var n = 0;
                if (a.roleId > b.roleId) {
                    n += 10;
                }
                else if (a.roleId < b.roleId) {
                    n -= 10;
                }
                if (a.cmdIndex > b.cmdIndex) {
                    n += 1;
                }
                else if (a.cmdIndex < b.cmdIndex) {
                    n -= 1;
                }
                return n;
            });
            // this.needSync = false
            // for (let cmd of pops) {
            // 	if (cmd.route == "local" && cmd.needSync) {
            // 		this.needSync = true
            // 		break
            // 	}
            // }
            // if (this.name == "predict") {
            // 	pops.forEach(cmd => {
            // 		// if (cmd.route == "net") {
            // 		console.log("popcmd:", cmd.route, cmd.cmdIndex, cmd)
            // 		// }
            // 	})
            // }
            return pops;
        };
        InputCmdBuffer.prototype.mergeFrom = function (cmdBuffer) {
            for (var roleId in cmdBuffer.cmdBuffers) {
                var sCmdBuffer = cmdBuffer.cmdBuffers[roleId];
                var tCmdBuffer = this.cmdBuffers[roleId];
                tCmdBuffer.mergeFrom(sCmdBuffer);
            }
        };
        InputCmdBuffer.prototype.syncLocalCmd = function () {
            for (var _i = 0, _a = Object.values(this.cmdBuffers); _i < _a.length; _i++) {
                var cmdBuffer = _a[_i];
                cmdBuffer.syncLocalCmd();
            }
        };
        // clearOutdateCmdsForce() {
        // 	let cmdBuffers = this.cmdBuffers
        // 	for (let roleId in cmdBuffers) {
        // 		let tCmdBuffer = cmdBuffers[roleId]
        // 		tCmdBuffer.cleanOutdateLocalCmdsForce()
        // 	}
        // }
        /**
         * 为了在udp模式下, 通过cmdIndex 确保前一帧数据都已经全部接收
         */
        InputCmdBuffer.prototype.getOrderedNetCmd = function () {
            var cmdBuffers = fsync.ObjectUtils.values(this.cmdBuffers);
            var cmds = cmdBuffers.map(function (buf) { return buf.getOrderedNetCmd(); }).filter(function (buf) { return !!buf; });
            var minCmd = fsync.ArrayHelper.min(cmds, function (cmd) { return cmd.frameCount; });
            return minCmd;
        };
        InputCmdBuffer.orderid = 0;
        return InputCmdBuffer;
    }());
    fsync.InputCmdBuffer = InputCmdBuffer;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var LocalInputPost = /** @class */ (function () {
        function LocalInputPost() {
            this.needSync = false;
            this.inMorePredict = false;
            this.morePredictTime = 0;
            this.curMPFC = -1;
            this.lastPFC = -1;
            this.netDelayAcc = 0;
            this.netDelayCount = 0;
        }
        LocalInputPost.prototype.post = function (cmd) {
            /*
            let latestNetCmd = this.localCmdBuffer.getLatestNetCmd()
            if (cmd.route == "local" && latestNetCmd) {
                let netDelay = latestNetCmd.receivedTime - latestNetCmd.createTime
                this.netDelayAcc += netDelay
                this.netDelayCount++
                let netDelayAv = this.netDelayAcc / this.netDelayCount
                let PFC = latestNetCmd.frameCount + (cmd.createTime - latestNetCmd.createTime + netDelay) / 1000 * GameConfig.inst.fps
    
                // 拟合会导致子弹发射等伴随动作时间线拉长，可能会导致预测线产生更多伴随动作，比如子弹数量莫名增多
                if (this.curMPFC < 0) {
                    this.curMPFC = latestNetCmd.frameCount
                }
                if (cmd.lastCmdId == null) {
                    if (this.curMPFC < latestNetCmd.frameCount - 0) {
                        this.curMPFC = latestNetCmd.frameCount
                    }
                }
                let MPFC = this.curMPFC
                if (this.lastPFC != PFC) {
                    if (PFC > this.curMPFC + 1) {
                        MPFC += 2
                        this.localCmdBuffer.enableLocalPredict = true
                    } else {
                        // console.log("stop merge")
                        // 达到拟合点
                        MPFC++
                        this.localCmdBuffer.enableLocalPredict = false
                        if (!this.inMorePredict) {
                            this.needSync = true
                            this.morePredictTime = Date.now()
                        }
                        this.inMorePredict = true
                    }
                }
                // if (cmd.lastCmdId != null) {
                // 	this.morePredictTime = Date.now()
                // }
                cmd.frameCount = MPFC
                this.curMPFC = MPFC
                this.lastPFC = PFC
                // console.log("cmdframe:", cmd.frameCount)
    
                // cmd.frameCount += 0.3 * GameConfig.inst.fps
    
            }
            */
            cmd.frameCount = cmd.createFrameCount + 1;
            var _ = this.handler && this.handler(cmd);
        };
        return LocalInputPost;
    }());
    fsync.LocalInputPost = LocalInputPost;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var CmdReorderQueue = /** @class */ (function () {
        function CmdReorderQueue() {
            this.curCmdIndex = 0;
            this.dirty = false;
        }
        CmdReorderQueue.prototype.init = function () {
            this.cmds = [];
            return this;
        };
        CmdReorderQueue.prototype.put = function (cmd) {
            this.dirty = true;
            this.cmds.push(cmd);
        };
        CmdReorderQueue.prototype.sort = function () {
            this.cmds.sort(function (a, b) { return a.cmdIndex - b.cmdIndex; });
        };
        CmdReorderQueue.prototype.pop = function () {
            if (this.dirty) {
                this.dirty = false;
                this.sort();
            }
            if (this.cmds.length > 0) {
                var cmd = this.cmds[0];
                if (cmd.cmdIndex == this.curCmdIndex + 1) {
                    this.curCmdIndex++;
                    this.cmds.shift();
                    return cmd;
                }
            }
            return null;
        };
        return CmdReorderQueue;
    }());
    fsync.CmdReorderQueue = CmdReorderQueue;
    var NetworkCmdTranslator = /** @class */ (function () {
        function NetworkCmdTranslator() {
            this.textDecorder = new TextDecoder("utf-8");
        }
        NetworkCmdTranslator.prototype.translate = function (message) {
            var sdata = this.textDecorder.decode(message.msgBytes);
            var data = JSON.parse(sdata);
            // console.log(`received net cmd: ${JSON.stringify(data)}`)
            data.route = "net";
            data.frameCount = fsync.LongHelper.toNumber(message.syncInfo.serverFrameCount);
            data.receivedTime = Date.now();
            return data;
        };
        return NetworkCmdTranslator;
    }());
    fsync.NetworkCmdTranslator = NetworkCmdTranslator;
})(fsync || (fsync = {}));
/**
 * 客户端UI工具
 */
var kitten;
(function (kitten) {
    window["kitten"] = kitten;
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        var Vector3 = fsync.Vector3;
        var UserInput = fsync.UserInput;
        var Vector = fsync.Vector;
        var BLRect = fsync.BLRect;
        /**
         * 环状摇杆
         */
        var CircleStick = /** @class */ (function () {
            function CircleStick() {
                /**
                 * 是否启用
                 */
                this.enable = true;
                /**
                 * 控制器id
                 */
                this.identity = "unkown";
                /**
                 * 触控半径
                 */
                this.circleRadius = 10;
                /**
                 * 触摸状态map
                 */
                this.multiTouchMap = fsync.EmptyTable();
            }
            /**
             * 获取输入端口列表
             */
            CircleStick.prototype.getInputPorts = function () {
                return this.inputPorts;
            };
            CircleStick.prototype.updateInputPorts = function () {
                var _this = this;
                this.inputPorts = Object.keys(this.multiTouchMap).filter(function (key) {
                    return _this.multiTouchMap[key] == _this.identity;
                });
            };
            Object.defineProperty(CircleStick.prototype, "ctrlStatus", {
                get: function () {
                    return this.ctrlStatusRaw;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * 获取触控范围中心店
             */
            CircleStick.prototype.getCtrlCenterPos = function () {
                return this.ctrlStatus.ctrlPos;
            };
            /**
             * 控制器对外状态
             */
            // ctrlStatus: StickCtrlState
            // resetExportStatus() {
            // 	this.ctrlStatus.pressed = false
            // 	this.ctrlStatus.touchAction = "loosed"
            // 	this.ctrlStatus.strength = 0
            // 	Vector.merge(this.ctrlStatus.ctrlPos, this.ctrlPosOrigin)
            // 	Vector.merge(this.ctrlStatus.touchPoint, this.ctrlPosOrigin)
            // 	Vector.resetValues(this.ctrlStatus.dir, 0)
            // }
            // /**
            //  * 导出状态
            //  */
            // exportTouchStatus() {
            // 	this.ctrlStatus.pressed = this.ctrlStatusRaw.pressed
            // 	Vector.merge(this.ctrlStatus.dir, this.ctrlStatusRaw.dir)
            // 	this.ctrlStatus.strength = this.ctrlStatusRaw.strength
            // 	this.ctrlStatus.touchAction = this.ctrlStatusRaw.touchAction
            // 	Vector.merge(this.ctrlStatus.touchPoint, this.ctrlStatusRaw.touchPoint)
            // 	Vector.merge(this.ctrlStatus.ctrlPos, this.ctrlStatusRaw.ctrlPos)
            // }
            CircleStick.prototype.updateStatus = function () {
                this.updateTouchAction();
                this.calcTouchVector();
                // this.exportTouchStatus()
            };
            CircleStick.prototype.updateTouchAction = function () {
                if (this.lastCtrlStatus.pressed) {
                    if (this.ctrlStatusRaw.pressed) {
                        // press -> press
                        this.ctrlStatusRaw.touchAction = "move";
                    }
                    else {
                        // press -> loosed
                        this.ctrlStatusRaw.touchAction = "end";
                    }
                }
                else {
                    if (this.ctrlStatusRaw.pressed) {
                        // loosed -> press
                        this.ctrlStatusRaw.touchAction = "begin";
                    }
                    else {
                        // loosed -> loosed
                        this.ctrlStatusRaw.touchAction = "loosed";
                    }
                }
                this.lastCtrlStatus.pressed = this.ctrlStatusRaw.pressed;
            };
            /**
             * 计算触摸矢量数据
             */
            CircleStick.prototype.calcTouchVector = function () {
                var ctrlPos = this.ctrlStatusRaw.ctrlPos;
                var pos = this.ctrlStatusRaw.touchPoint;
                this.ctrlStatusRaw.dir.x = pos.x - ctrlPos.x;
                this.ctrlStatusRaw.dir.y = pos.y - ctrlPos.y;
                this.ctrlStatusRaw.strength = Vector.len(this.ctrlStatusRaw.dir);
            };
            CircleStick.prototype.init = function (id, sharedState) {
                this.identity = id;
                this.ctrlPosOrigin = new Vector3();
                this.touchRange = { height: 0, width: 0, x: 0, y: 0 };
                // this.ctrlStatus = new StickCtrlState()
                this.ctrlStatusRaw = new gamepad.StickCtrlState();
                this.lastCtrlStatus = new gamepad.StickLastCtrlState();
                this.inputPorts = [];
                this.sharedState = sharedState;
                return this;
            };
            /**
             * 动态设置当前摇杆中心点
             * @param pos
             */
            CircleStick.prototype.setStartPos = function (pos) {
                Vector.merge(this.ctrlStatusRaw.ctrlPos, pos);
            };
            /**
             * 重置当前摇杆中心为原始中心点
             */
            CircleStick.prototype.resetStartPos = function () {
                this.setStartPos(this.ctrlPosOrigin);
            };
            CircleStick.prototype.resetTouchPoint = function () {
                fsync.Vector.merge(this.ctrlStatusRaw.touchPoint, this.ctrlStatusRaw.ctrlPos);
            };
            /**
             * 设置主视图
             * @param pos
             */
            CircleStick.prototype.setStartPosOrigin = function (pos) {
                Vector.merge(this.ctrlPosOrigin, pos);
                Vector.merge(this.ctrlStatusRaw.ctrlPos, pos);
            };
            /**
             * 设置触控半径
             * @param radius
             */
            CircleStick.prototype.setCircleRadius = function (radius) {
                this.circleRadius = radius;
            };
            /**
             * 获取触控半径
             * @param radius
             */
            CircleStick.prototype.getCircleRadius = function () {
                return this.circleRadius;
            };
            /**
             * 设置触控范围
             * @param rect
             */
            CircleStick.prototype.setTouchRange = function (rect) {
                this.touchRange.height = rect.height;
                this.touchRange.width = rect.width;
                this.touchRange.x = rect.x;
                this.touchRange.y = rect.y;
            };
            /**
             * 获取触控范围
             */
            CircleStick.prototype.getTouchRange = function () {
                // let width = this.circleRadius
                // let height = this.circleRadius
                // return {
                // 	x: this.ctrlPos.x - width / 2,
                // 	y: this.ctrlPos.y - height / 2,
                // 	width: width,
                // 	height: height,
                // }
                return this.touchRange;
            };
            /**
             * 处理触控输入
             * @param data
             */
            CircleStick.prototype.handlerInput = function (data) {
                if (!this.enable) {
                    this.cleanTouchMap();
                    return false;
                }
                if (this.detectVirtualCirleInput(data)) {
                    // pass
                }
                else {
                    return false;
                }
                return true;
            };
            CircleStick.prototype.cleanTouchMap = function () {
                for (var key in this.multiTouchMap) {
                    delete this.sharedState.multiTouchMap[key];
                }
            };
            /**
             * 检测虚拟手柄输入
             * @param data
             */
            CircleStick.prototype.detectVirtualCirleInput = function (data) {
                if (data.action == "ontouchstart") {
                    for (var _i = 0, _a = data.event.touches; _i < _a.length; _i++) {
                        var t = _a[_i];
                        if (this.sharedState.multiTouchMap[t.identifier]) {
                            continue;
                        }
                        var pos = Vector3.fromNumArray([t.clientX, t.clientY]);
                        if (BLRect.containPoint(this.getTouchRange(), pos)) {
                            this.sharedState.multiTouchMap[t.identifier] = this.identity;
                            this.multiTouchMap[t.identifier] = this.identity;
                            this.ctrlStatusRaw.pressed = true;
                            this.ctrlStatusRaw.touchPoint.x = pos.x;
                            this.ctrlStatusRaw.touchPoint.y = pos.y;
                            Vector.normalizeSelf(this.ctrlStatusRaw.dir);
                        }
                    }
                }
                else if (data.action == "ontouchend") {
                    for (var _b = 0, _c = data.event.touches; _b < _c.length; _b++) {
                        var t = _c[_b];
                        if (this.multiTouchMap[t.identifier] == this.identity) {
                            var pos = Vector3.fromNumArray([t.clientX, t.clientY]);
                            this.ctrlStatusRaw.pressed = false;
                            this.ctrlStatusRaw.touchPoint.x = pos.x;
                            this.ctrlStatusRaw.touchPoint.y = pos.y;
                            delete this.sharedState.multiTouchMap[t.identifier];
                            delete this.multiTouchMap[t.identifier];
                        }
                    }
                }
                else if (data.action == "ontouchmove") {
                    for (var _d = 0, _e = data.event.touches; _d < _e.length; _d++) {
                        var t = _e[_d];
                        if (this.multiTouchMap[t.identifier] == this.identity) {
                            var pos = Vector3.fromNumArray([t.clientX, t.clientY]);
                            this.ctrlStatusRaw.touchPoint.x = pos.x;
                            this.ctrlStatusRaw.touchPoint.y = pos.y;
                            // this.ctrlStatus.dir.x = pos.x - this.ctrlPos.x
                            // this.ctrlStatus.dir.y = pos.y - this.ctrlPos.y
                            // this.ctrlStatus.strength = Vector.len(this.ctrlStatus.dir)
                            Vector.normalizeSelf(this.ctrlStatusRaw.dir);
                        }
                    }
                }
                else {
                    return false;
                }
                return true;
            };
            return CircleStick;
        }());
        gamepad.CircleStick = CircleStick;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        var Vector3 = fsync.Vector3;
        var UserInput = fsync.UserInput;
        var Vector = fsync.Vector;
        /**
         * 基础控制器视图
         */
        var CircleStickView = /** @class */ (function () {
            function CircleStickView() {
            }
            CircleStickView.prototype.init = function () {
                return this;
            };
            CircleStickView.prototype.setupView = function (ctrl, color) {
                var length = Vector.len(UserInput.inst.clientSize);
                this.ctrlId = ctrl.identity;
                this.circleView = graph.createSprite();
                this.circleView.setColor(color);
                this.circleView.setRadius(ctrl.getCircleRadius());
                var center = ctrl.getCtrlCenterPos();
                this.circleView.setPos(center.x, center.y);
            };
            return CircleStickView;
        }());
        gamepad.CircleStickView = CircleStickView;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        /**
         * 自动重定位的摇杆
         */
        var GameStick = /** @class */ (function (_super) {
            __extends(GameStick, _super);
            function GameStick() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            GameStick.prototype.init = function (id, sharedState) {
                this.needResetAfterLoose = false;
                return _super.prototype.init.call(this, id, sharedState);
            };
            GameStick.prototype.updateStatus = function () {
                this.updateTouchAction();
                /**
                * 游戏摇杆的特性:
                * - 当玩家第一次触摸摇杆时,摇杆的触摸起点要设置为当前触摸点
                * - 玩家放开触摸摇杆时,摇杆中心点和当前触摸点复位
                */
                if (this.ctrlStatusRaw.touchAction == "begin") {
                    this.needResetAfterLoose = false;
                    this.setStartPos(this.ctrlStatusRaw.touchPoint);
                    this.calcTouchVector();
                }
                else if (this.ctrlStatusRaw.touchAction == "end") {
                    this.needResetAfterLoose = true;
                    this.calcTouchVector();
                }
                else {
                    if (this.needResetAfterLoose) {
                        this.needResetAfterLoose = false;
                        this.resetStartPos();
                        this.resetTouchPoint();
                    }
                    this.calcTouchVector();
                }
                // this.exportTouchStatus()
            };
            return GameStick;
        }(gamepad.CircleStick));
        gamepad.GameStick = GameStick;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        /**
         * 主技能摇杆
         */
        var MainSkillStick = /** @class */ (function (_super) {
            __extends(MainSkillStick, _super);
            function MainSkillStick() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainSkillStick.prototype.handlerInput = function (data) {
                if (_super.prototype.handlerInput.call(this, data)) {
                    // pass
                }
                else if (this.detectSkillRollInput(data)) {
                    // pass
                }
                else {
                    return false;
                }
                return true;
            };
            /**
             * 检测鼠标控制技能方向
             * @param data
             */
            MainSkillStick.prototype.detectSkillRollInput = function (data) {
                if (data.action == "onmousedown") {
                    this.ctrlStatusRaw.pressed = true;
                }
                else if (data.action == "onmouseup") {
                    this.ctrlStatusRaw.pressed = false;
                }
                else if (data.action == "onmousemove") {
                    var ctrlPos = this.ctrlStatusRaw.ctrlPos;
                    var offset = [data.event.clientX - ctrlPos.x, data.event.clientY - ctrlPos.y];
                    var strength = Math.sqrt(offset[0] * offset[0] + offset[1] * offset[1]);
                    this.ctrlStatusRaw.dir.x = offset[0] / strength;
                    this.ctrlStatusRaw.dir.y = offset[1] / strength;
                    this.ctrlStatusRaw.strength = strength;
                }
                else {
                    return false;
                }
                return true;
            };
            return MainSkillStick;
        }(gamepad.GameStick));
        gamepad.MainSkillStick = MainSkillStick;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        var Vector3 = fsync.Vector3;
        var UserInput = fsync.UserInput;
        var Vector = fsync.Vector;
        /**
         * 移动摇杆
         */
        var MoveStick = /** @class */ (function (_super) {
            __extends(MoveStick, _super);
            function MoveStick() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.pressingKeys = {};
                _this.isKeyPressing = false;
                return _this;
            }
            MoveStick.prototype.handlerInput = function (data) {
                if (_super.prototype.handlerInput.call(this, data)) {
                    // pass
                }
                else if (this.detectKeyboardMoveInput(data)) {
                    // pass
                }
                else {
                    return false;
                }
                return true;
            };
            /**
            * 获取输入端口列表
            */
            MoveStick.prototype.getInputPorts = function () {
                var keys = _super.prototype.getInputPorts.call(this);
                if (this.isKeyPressing) {
                    keys.push("keyboard1");
                }
                return keys;
            };
            MoveStick.prototype.updateKeyboardInputStatus = function () {
                var _this = this;
                var k = ["a", "d", "w", "s"].filter(function (kx) { return _this.pressingKeys[kx]; });
                if (k.length <= 0) {
                    this.ctrlStatusRaw.pressed = false;
                    this.ctrlStatusRaw.strength = 0;
                }
                else {
                    this.ctrlStatusRaw.pressed = true;
                    this.ctrlStatusRaw.strength = 1;
                }
                this.isKeyPressing = this.ctrlStatusRaw.pressed;
            };
            /**
             * 检测键盘输入控制
             * @param data
             */
            MoveStick.prototype.detectKeyboardMoveInput = function (data) {
                if (data.action == "onkeydown") {
                    var key = data.event.key;
                    this.pressingKeys[key] = true;
                    this.updateKeyboardInputStatus();
                    this.updateStatus();
                    if (key == "a") {
                        this.ctrlStatusRaw.dir.x = -1;
                        this.ctrlStatusRaw.dir.y = 0;
                    }
                    else if (key == "d") {
                        this.ctrlStatusRaw.dir.x = 1;
                        this.ctrlStatusRaw.dir.y = 0;
                    }
                    else if (key == "w") {
                        this.ctrlStatusRaw.dir.x = 0;
                        this.ctrlStatusRaw.dir.y = 1;
                    }
                    else if (key == "s") {
                        this.ctrlStatusRaw.dir.x = 0;
                        this.ctrlStatusRaw.dir.y = -1;
                    }
                    Vector.addUp(Vector.merge(this.ctrlStatusRaw.touchPoint, this.ctrlStatusRaw.dir), this.ctrlStatusRaw.ctrlPos);
                    this.updateKeyboardInputStatus();
                }
                else if (data.action == "onkeyup") {
                    var key = data.event.key;
                    this.pressingKeys[key] = false;
                    this.updateKeyboardInputStatus();
                }
                else {
                    return false;
                }
                return true;
            };
            return MoveStick;
        }(gamepad.GameStick));
        gamepad.MoveStick = MoveStick;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        var Vector3 = fsync.Vector3;
        var UserInput = fsync.UserInput;
        /**
         * 虚拟游戏手柄
         * - 虚拟设备
         */
        var NormalGamepad = /** @class */ (function () {
            function NormalGamepad() {
                this.enable = true;
            }
            Object.defineProperty(NormalGamepad.prototype, "inputEnabled", {
                /**
                 * 控制输入是否可用
                 */
                get: function () {
                    return this.enable;
                },
                set: function (value) {
                    this.enable = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NormalGamepad.prototype, "leftStick", {
                /**
                 * 左手控制器
                 */
                get: function () {
                    return this.virutalCtrls[0];
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NormalGamepad.prototype, "leftStickStatus", {
                /**
                 * 左手控制器状态
                 */
                get: function () {
                    return this.leftStick.ctrlStatus;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NormalGamepad.prototype, "rightStick", {
                /**
                 * 右手控制器
                 */
                get: function () {
                    return this.virutalCtrls[1];
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NormalGamepad.prototype, "rightStickStatus", {
                /**
                 * 右手控制器状态
                 */
                get: function () {
                    return this.rightStick.ctrlStatus;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * 更新手柄状态,包含:
             * - 延迟状态
             */
            NormalGamepad.prototype.updateVirtualCtrls = function () {
                this.virutalCtrls.forEach(function (ctrl) { return ctrl.updateStatus(); });
                // let inputMap: { [key: string]: CircleStick } = {}
                // let overwriteMap: { [key: string]: CircleStick } = {}
                // this.virutalCtrls.forEach((ctrl) => {
                // 	ctrl.getInputPorts().forEach((id) => {
                // 		overwriteMap[id] = ctrl
                // 		inputMap[ctrl.identity] = ctrl
                // 	})
                // })
                // let validMap = {}
                // Object.values(overwriteMap).forEach((ctrl) => {
                // 	validMap[ctrl.identity] = ctrl
                // })
                // // 排除掉被覆盖的输入摇杆
                // Object.values(inputMap).forEach((ctrl) => {
                // 	if (!validMap[ctrl.identity]) {
                // 		ctrl.resetExportStatus()
                // 	}
                // })
            };
            NormalGamepad.prototype.init = function () {
                var _this = this;
                this.sharedState = new gamepad.StickSharedState();
                this.virutalCtrls = [];
                {
                    var ctrl = new gamepad.MoveStick().init("movestick", this.sharedState);
                    this.virutalCtrls[0] = ctrl;
                    var pos = new Vector3();
                    pos.x = UserInput.inst.clientSize.x * 0.2;
                    pos.y = UserInput.inst.clientSize.y * 0.8;
                    // 默认设置在左边
                    ctrl.setStartPosOrigin(pos);
                }
                {
                    var ctrl = new gamepad.MainSkillStick().init("skillstick", this.sharedState);
                    this.virutalCtrls[1] = ctrl;
                    var pos = new Vector3();
                    pos.x = UserInput.inst.clientSize.x * 0.8;
                    pos.y = UserInput.inst.clientSize.y * 0.8;
                    // 默认设置在右边
                    ctrl.setStartPosOrigin(pos);
                }
                this.virtualCtrlViews = [];
                UserInput.inst.addHandler("gamecontroller", function (data) {
                    _this.handlerInput(data);
                });
                return this;
            };
            /**
             * 创建调试视图
             */
            NormalGamepad.prototype.setupSimpleView = function () {
                {
                    // 左
                    var view = new gamepad.CircleStickView().init();
                    view.setupView(this.virutalCtrls[0], 'rgba(200, 255, 255, 1.0)');
                    this.virtualCtrlViews[0] = view;
                }
                {
                    // 右
                    var view = new gamepad.CircleStickView().init();
                    view.setupView(this.virutalCtrls[1], 'rgba(255, 200, 255, 1.0)');
                    this.virtualCtrlViews[1] = view;
                }
                for (var _i = 0, _a = this.virutalCtrls.slice(2); _i < _a.length; _i++) {
                    var ctrl = _a[_i];
                    // 右
                    var view = new gamepad.CircleStickView().init();
                    view.setupView(ctrl, 'rgba(255, 255, 200, 1.0)');
                    this.virtualCtrlViews.push(view);
                }
            };
            /**
             * 处理各类输入
             * @param data
             */
            NormalGamepad.prototype.handlerInput = function (data) {
                if (!this.enable) {
                    return false;
                }
                // if (data.action == "onsetup") {
                // 	this.setupSimpleView()
                // } else 
                {
                    var b = false;
                    // for (let ctrl of this.virutalCtrls) {
                    // for (let ctrl of this.virutalCtrls.reverse()) {
                    for (var i = this.virutalCtrls.length - 1; i >= 0; i--) {
                        var ctrl = this.virutalCtrls[i];
                        var b2_1 = ctrl.handlerInput(data);
                        b = b || b2_1;
                    }
                    return b;
                }
                return true;
            };
            return NormalGamepad;
        }());
        gamepad.NormalGamepad = NormalGamepad;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        var Vector3 = fsync.Vector3;
        var UserInput = fsync.UserInput;
        /**
         * 前一次摇杆状态
         */
        var StickLastCtrlState = /** @class */ (function () {
            function StickLastCtrlState() {
                this.pressed = false;
            }
            return StickLastCtrlState;
        }());
        gamepad.StickLastCtrlState = StickLastCtrlState;
        /**
         * 摇杆状态
         */
        var StickCtrlState = /** @class */ (function () {
            function StickCtrlState() {
                /**
                 * 当前触摸位置
                 */
                this.touchPoint = new Vector3();
                /**
                 * 操控方向
                 */
                this.dir = new Vector3();
                /**
                 * 操作强度
                 */
                this.strength = 0;
                /**
                 * 是否处于按下状态
                 */
                this.pressed = false;
                /**
                 * 触摸操控状态
                 */
                this.touchAction = "loosed";
                /**
                 * 控制器轴心位置
                 */
                this.ctrlPos = new Vector3();
            }
            return StickCtrlState;
        }());
        gamepad.StickCtrlState = StickCtrlState;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var gamepad;
    (function (gamepad) {
        /**
         * 摇杆共享状态
         */
        var StickSharedState = /** @class */ (function () {
            function StickSharedState() {
                this.multiTouchMap = fsync.EmptyTable();
            }
            return StickSharedState;
        }());
        gamepad.StickSharedState = StickSharedState;
    })(gamepad = kitten.gamepad || (kitten.gamepad = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var guesture;
    (function (guesture) {
        guesture.TouchPoint = fsync.Vector3;
        var ContinuoursIdTool = /** @class */ (function () {
            function ContinuoursIdTool() {
                this._idAcc = 0;
                this._idMap = {};
            }
            /**
             * 转化为可连续的id
             * @param id
             */
            ContinuoursIdTool.prototype.mapToContinuousId = function (id) {
                var cid = this._idMap[id];
                if (cid == null) {
                    cid = this._idMap[id] = this._idAcc++;
                }
                return cid;
            };
            return ContinuoursIdTool;
        }());
        guesture.ContinuoursIdTool = ContinuoursIdTool;
        var idTool = new ContinuoursIdTool();
        var TouchPointQueue = /** @class */ (function () {
            function TouchPointQueue() {
                /**
                 * 是否处于触摸状态
                 */
                this.touching = false;
                /**
                 * 触摸点ID
                 */
                this.touchId = -1;
            }
            TouchPointQueue.prototype.clearPoints = function () {
                this.points.length = 0;
            };
            TouchPointQueue.prototype.init = function () {
                this.points = [];
                return this;
            };
            /**
             * 存入最新的触摸点
             * @param point
             */
            TouchPointQueue.prototype.unshift = function (point) {
                this.points.unshift(point);
            };
            /**
             * 触摸点列表，[0]表示最新存入的点
             * @param num
             */
            TouchPointQueue.prototype.getTopPoints = function (num) {
                if (num === void 0) { num = 2; }
                return this.points.slice(0, num);
            };
            /**
             * 获取当前触摸点滑动方向
             */
            TouchPointQueue.prototype.getMoveVector = function () {
                var vec = new guesture.TouchPoint(0);
                if (this.points.length > 1) {
                    fsync.Vector.subDown(fsync.Vector.addUp(vec, this.points[0]), this.points[1]);
                }
                return vec;
            };
            /**
             * 获取当前触摸点整体位移方向
             */
            TouchPointQueue.prototype.getMaxMoveVector = function () {
                var vec = new guesture.TouchPoint(0);
                if (this.points.length > 1) {
                    fsync.Vector.subDown(fsync.Vector.addUp(vec, this.points[0]), this.points[this.points.length - 1]);
                }
                return vec;
            };
            /**
             * 获取
             */
            TouchPointQueue.prototype.getPoints = function () {
                return this.points;
            };
            /**
             * 获取最新的点
             * @param index
             */
            TouchPointQueue.prototype.getPoint = function (index) {
                if (index === void 0) { index = 0; }
                return this.points[index];
            };
            /**
             * 获取最老的点
             * @param index
             */
            TouchPointQueue.prototype.getOldPoint = function (index) {
                if (index === void 0) { index = 0; }
                return this.points[this.points.length - 1 - index];
            };
            return TouchPointQueue;
        }());
        guesture.TouchPointQueue = TouchPointQueue;
        /**
         * 手势类型
         */
        var GuestureTypes;
        (function (GuestureTypes) {
            /**
             * 开始触摸
             */
            GuestureTypes["touch"] = "touch";
            /**
             * 点击
             */
            GuestureTypes["loose"] = "loose";
            /**
             * 拖拽
             */
            GuestureTypes["drag"] = "drag";
            /**
             * 双击
             */
            GuestureTypes["doubleClick"] = "doubleClick";
            /**
             * 缩放
             */
            GuestureTypes["scale"] = "scale";
            /**
             * 旋转
             */
            GuestureTypes["rotate"] = "rotate";
        })(GuestureTypes = guesture.GuestureTypes || (guesture.GuestureTypes = {}));
        var GuestureInfo = /** @class */ (function () {
            function GuestureInfo() {
            }
            return GuestureInfo;
        }());
        guesture.GuestureInfo = GuestureInfo;
        /**
         * 点触信息
         */
        var ClickGuestureInfo = /** @class */ (function (_super) {
            __extends(ClickGuestureInfo, _super);
            function ClickGuestureInfo() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gtype = GuestureTypes.touch;
                return _this;
            }
            ClickGuestureInfo.prototype.init = function (pointQueues) {
                this.pointQueues = pointQueues;
                return this;
            };
            return ClickGuestureInfo;
        }(GuestureInfo));
        guesture.ClickGuestureInfo = ClickGuestureInfo;
        /**
         * 拖拽信息
         */
        var DragGuestureInfo = /** @class */ (function (_super) {
            __extends(DragGuestureInfo, _super);
            function DragGuestureInfo() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gtype = GuestureTypes.drag;
                return _this;
            }
            DragGuestureInfo.prototype.init = function (pointQueues) {
                this.pointQueues = pointQueues;
                return this;
            };
            DragGuestureInfo.prototype.getMoveVector = function (index) {
                if (index === void 0) { index = 0; }
                var points = this.pointQueues[index].getPoints();
                var vec = new guesture.TouchPoint();
                if (points.length > 1) {
                    fsync.Vector.subDown(fsync.Vector.addUp(vec, points[0]), points[1]);
                }
                return vec;
            };
            DragGuestureInfo.prototype.getMaxMoveVector = function (index) {
                if (index === void 0) { index = 0; }
                var points = this.pointQueues[index].getPoints();
                var vec = new guesture.TouchPoint(0);
                if (points.length > 1) {
                    fsync.Vector.subDown(fsync.Vector.addUp(vec, points[0]), points[points.length - 1]);
                }
                return vec;
            };
            DragGuestureInfo.prototype.getOldPoint = function (index) {
                if (index === void 0) { index = 0; }
                return this.pointQueues[this.pointQueues.length - 1].getOldPoint(index);
            };
            DragGuestureInfo.prototype.getPoint = function (index) {
                if (index === void 0) { index = 0; }
                return this.pointQueues[this.pointQueues.length - 1].getPoint(index);
            };
            DragGuestureInfo.prototype.getPoints = function (index) {
                if (index === void 0) { index = 0; }
                return this.pointQueues.map(function (pq) { return pq.getPoint(index); });
            };
            DragGuestureInfo.prototype.getOldPoints = function (index) {
                if (index === void 0) { index = 0; }
                return this.pointQueues.map(function (pq) { return pq.getOldPoint(index); });
            };
            return DragGuestureInfo;
        }(GuestureInfo));
        guesture.DragGuestureInfo = DragGuestureInfo;
        /**
         * 双击信息
         */
        var DoubleClickGuestureInfo = /** @class */ (function (_super) {
            __extends(DoubleClickGuestureInfo, _super);
            function DoubleClickGuestureInfo() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gtype = GuestureTypes.doubleClick;
                return _this;
            }
            DoubleClickGuestureInfo.prototype.init = function (pointQueues) {
                this.pointQueues = pointQueues;
                return this;
            };
            return DoubleClickGuestureInfo;
        }(GuestureInfo));
        guesture.DoubleClickGuestureInfo = DoubleClickGuestureInfo;
        /**
         * 缩放信息
         */
        var ScaleGuestureInfo = /** @class */ (function (_super) {
            __extends(ScaleGuestureInfo, _super);
            function ScaleGuestureInfo() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gtype = GuestureTypes.scale;
                return _this;
            }
            ScaleGuestureInfo.prototype.init = function (pointQueues) {
                this.pointQueues = pointQueues;
                return this;
            };
            ScaleGuestureInfo.prototype.getScaleInfo = function () {
                var pq1 = this.pointQueues[0];
                var pq2 = this.pointQueues[1];
                var vec1 = pq1.getMaxMoveVector();
                var vec2 = pq2.getMaxMoveVector();
                var pt1_1 = pq1.getPoint();
                var pt1_2 = pq1.getOldPoint();
                var pt2_1 = pq2.getPoint();
                var pt2_2 = pq2.getOldPoint();
                var scaleN = fsync.Vector.distance(pt1_1, pt2_1) - fsync.Vector.distance(pt1_2, pt2_2);
                var dir = fsync.Vector.subDown(vec1.clone(), vec2);
                var center = fsync.Vector.addUp(pt1_2.clone(), pt2_2);
                var info = {
                    center: center,
                    dir: dir,
                    scaleN: scaleN,
                };
                return info;
            };
            return ScaleGuestureInfo;
        }(GuestureInfo));
        guesture.ScaleGuestureInfo = ScaleGuestureInfo;
        /**
         * 旋转信息
         */
        var RotateGuestureInfo = /** @class */ (function (_super) {
            __extends(RotateGuestureInfo, _super);
            function RotateGuestureInfo() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gtype = GuestureTypes.rotate;
                return _this;
            }
            RotateGuestureInfo.prototype.init = function (pointQueues) {
                this.pointQueues = pointQueues;
                return this;
            };
            RotateGuestureInfo.prototype.getRotateDirection = function () {
                var pq1 = this.pointQueues[0];
                var pq2 = this.pointQueues[1];
                var pt1 = pq1.getOldPoint();
                var pt2 = pq2.getOldPoint();
                var distanceY = fsync.Vector.len(fsync.Vector.subDown(pt1.clone(), pt2));
                var vec1 = pq1.getMaxMoveVector();
                var vec2 = pq2.getMaxMoveVector();
                var distanceX = fsync.Vector.len(fsync.Vector.subDown(vec1.clone(), vec2));
                var th = Math.atan2(distanceX, distanceY);
                var center = fsync.Vector.addUp(pt1.clone(), pt2);
                var info = {
                    th: th,
                    rotation: th / Math.PI * 180,
                    center: center,
                };
                return info;
            };
            return RotateGuestureInfo;
        }(GuestureInfo));
        guesture.RotateGuestureInfo = RotateGuestureInfo;
        var GuestureConfig = /** @class */ (function () {
            function GuestureConfig() {
                /**
                 * 最小移动距离
                 */
                this.dragDistanceMin = 1;
                /**
                 *
                 */
                this.rotateRadius = 170;
            }
            return GuestureConfig;
        }());
        guesture.GuestureConfig = GuestureConfig;
        /**
         * 手势分析
         */
        var GuestureAnalyzer = /** @class */ (function () {
            function GuestureAnalyzer() {
            }
            GuestureAnalyzer.prototype.getActivedPointQueues = function () {
                return this.pointQueues.filter(function (queue) {
                    return queue.touching;
                });
            };
            GuestureAnalyzer.prototype.init = function () {
                this.pointQueues = [];
                this.config = new GuestureConfig();
                return this;
            };
            GuestureAnalyzer.prototype.findTouchPointQueueById = function (id) {
                // 基本能完全预测准
                {
                    var predictV = this.pointQueues[id];
                    if (predictV && predictV.touchId == id) {
                        return predictV;
                    }
                }
                for (var i in this.pointQueues) {
                    var v = this.pointQueues[i];
                    if (v.touchId == id) {
                        // console.warn("missmatch", id, i)
                        return v;
                    }
                }
                return null;
            };
            /**
             * 输入点触信息
             * @param points
             */
            GuestureAnalyzer.prototype.inputTouchPoints = function (touching, points) {
                var pointQueues = this.pointQueues;
                for (var i in points) {
                    if (points[i] != null) {
                        // let pq = pointQueues[i]
                        var pqid = idTool.mapToContinuousId(i);
                        var pq = this.findTouchPointQueueById(pqid);
                        if (pq == null) {
                            pq = new TouchPointQueue().init();
                            pq.touchId = pqid;
                            // pointQueues[i] = pq
                            pointQueues[pqid] = pq;
                        }
                        if (!pq.touching) {
                            pq.clearPoints();
                        }
                        pq.touching = touching;
                        pq.unshift(points[i]);
                    }
                }
            };
            /**
             * 单点手势
             */
            GuestureAnalyzer.prototype.getSinglePointGuesture = function () {
                var config = this.config;
                var pointQueues = this.getActivedPointQueues();
                var info = null;
                if (pointQueues.length >= 1) {
                    var pointQueue = pointQueues[0];
                    if (fsync.Vector.len(pointQueue.getMaxMoveVector()) > config.dragDistanceMin) {
                        var tinfo = new DragGuestureInfo();
                        tinfo.init(pointQueues);
                        info = tinfo;
                    }
                    else {
                        var tinfo = new ClickGuestureInfo();
                        tinfo.gtype = GuestureTypes.touch;
                        tinfo.init(pointQueues);
                        info = tinfo;
                    }
                }
                else {
                    // 未触摸
                    var tinfo = new ClickGuestureInfo();
                    tinfo.gtype = GuestureTypes.loose;
                    tinfo.init(pointQueues);
                    info = tinfo;
                }
                return info;
            };
            GuestureAnalyzer.prototype.getTowPointGuesture = function () {
                var config = this.config;
                var pointQueues = this.getActivedPointQueues();
                var info = null;
                if (pointQueues.length == 2) {
                    var pq1 = pointQueues[0];
                    var pq2 = pointQueues[1];
                    var moveVec1 = pq1.getMaxMoveVector();
                    var moveVec2 = pq2.getMaxMoveVector();
                    /**
                     * 计算点到直线距离
                     * @param index1
                     * @param pt2
                     */
                    var calcDistance = function (index1, pt2) {
                        var pq = pointQueues[index1];
                        var moveVec = pq.getMaxMoveVector();
                        var pt = pq.getPoint(0);
                        if (moveVec.x == 0) {
                            return fsync.Vector.distance(pt, pt2);
                        }
                        var k = moveVec.y / moveVec.x;
                        var A = -k;
                        var B = 1;
                        var C = -pt.y + k * pt.x;
                        var d = Math.abs((A * pt2.x + B * pt2.y + C) / (Math.pow((A * A + B * B), 0.5)));
                        return d;
                    };
                    if (fsync.Vector.len(moveVec1) > config.dragDistanceMin || fsync.Vector.len(moveVec2) > config.dragDistanceMin) {
                        // 计算点到直线距离
                        var d1 = calcDistance(0, pq2.getPoint(0));
                        var d2 = calcDistance(1, pq1.getPoint(0));
                        if (d1 < config.rotateRadius || d2 < config.rotateRadius) {
                            // 缩放操作
                            var tinfo = new ScaleGuestureInfo();
                            tinfo.init(pointQueues);
                            info = tinfo;
                        }
                        else {
                            // 旋转力矩足够，旋转操作
                            var tinfo = new RotateGuestureInfo();
                            tinfo.init(pointQueues);
                            info = tinfo;
                        }
                    }
                }
                else {
                    // 非双指操作
                }
                return info;
            };
            /**
             * 获取手势信息
             */
            GuestureAnalyzer.prototype.getCurrentGuesture = function () {
                var info = null;
                var pointQueues = this.getActivedPointQueues();
                if (pointQueues.length >= 2) {
                    info = this.getTowPointGuesture();
                    if (info == null) {
                        info = this.getSinglePointGuesture();
                    }
                }
                else {
                    info = this.getSinglePointGuesture();
                }
                return info;
            };
            return GuestureAnalyzer;
        }());
        guesture.GuestureAnalyzer = GuestureAnalyzer;
    })(guesture = kitten.guesture || (kitten.guesture = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var rpg;
    (function (rpg) {
        /**
         * 缓存指定角色行为的命令
         */
        var SingleActorCmdBuffer = /** @class */ (function () {
            function SingleActorCmdBuffer() {
            }
            SingleActorCmdBuffer.prototype.init = function () {
                this.cmds = [];
                return this;
            };
            SingleActorCmdBuffer.prototype.putCmd = function (cmd) {
                this.cmds.push(cmd);
            };
            SingleActorCmdBuffer.prototype.popCmd = function () {
                return this.cmds.shift();
            };
            SingleActorCmdBuffer.prototype.getLatestCmd = function () {
                return this.cmds[this.cmds.length - 1];
            };
            return SingleActorCmdBuffer;
        }());
        rpg.SingleActorCmdBuffer = SingleActorCmdBuffer;
        /**
         * 管理所有角色命令缓冲
         */
        var ActorCmdBuffer = /** @class */ (function () {
            function ActorCmdBuffer() {
            }
            ActorCmdBuffer.prototype.init = function () {
                this.cmdBuffers = {};
                return this;
            };
            ActorCmdBuffer.prototype.addCmdBuffer = function (actorId) {
                var cmdBuffer = this.getCmdBuffer(actorId);
                if (cmdBuffer == null) {
                    cmdBuffer = this.cmdBuffers[actorId] = new SingleActorCmdBuffer().init();
                }
                return cmdBuffer;
            };
            ActorCmdBuffer.prototype.putCmd = function (cmd) {
                this.addCmdBuffer(cmd.actorId).putCmd(cmd);
            };
            ActorCmdBuffer.prototype.getCmdBuffer = function (actorId) {
                return this.cmdBuffers[actorId];
            };
            ActorCmdBuffer.prototype.getLatestCmd = function (actorId) {
                return this.addCmdBuffer(actorId).getLatestCmd();
            };
            ActorCmdBuffer.prototype.getOrPutLatestCmd = function (actorId) {
                var cmdBuffer = this.addCmdBuffer(actorId);
                var cmd = cmdBuffer.getLatestCmd();
                if (cmd == null) {
                    cmd = {
                        actorId: actorId,
                    };
                    cmdBuffer.putCmd(cmd);
                }
                return cmd;
            };
            ActorCmdBuffer.prototype.getActors = function () {
                return Object.keys(this.cmdBuffers);
            };
            ActorCmdBuffer.prototype.clear = function () {
                this.init();
            };
            return ActorCmdBuffer;
        }());
        rpg.ActorCmdBuffer = ActorCmdBuffer;
    })(rpg = kitten.rpg || (kitten.rpg = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var rpg;
    (function (rpg) {
        var RPGPlayerCmd = /** @class */ (function () {
            function RPGPlayerCmd() {
            }
            return RPGPlayerCmd;
        }());
        rpg.RPGPlayerCmd = RPGPlayerCmd;
    })(rpg = kitten.rpg || (kitten.rpg = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var rpg;
    (function (rpg) {
        var uidTool = new fsync.UniqueIDTool().init();
        /**
         * 将玩家操作转译成统一指令
         */
        var RPGPlayerCmdTranslator = /** @class */ (function () {
            function RPGPlayerCmdTranslator() {
                this.curCmdIndex = 1;
                this.cmdCopy = fsync.EmptyTable();
            }
            RPGPlayerCmdTranslator.prototype.init = function () {
                return this;
            };
            RPGPlayerCmdTranslator.prototype.setRoleData = function (roleData) {
                this.roleData = roleData;
            };
            RPGPlayerCmdTranslator.prototype.initGameCtrl = function () {
                var cmd = this.curGameCmd;
                if (cmd == null) {
                    var now = Date.now();
                    cmd = {
                        cmdIndex: -1,
                        needSync: true,
                        route: "local",
                        cmdType: "RoleCmd",
                        cmdId: null,
                        roleId: this.roleData.roleId,
                        createTime: now,
                        skills: [],
                    };
                    this.curGameCmd = cmd;
                }
            };
            RPGPlayerCmdTranslator.prototype.getGameCmd = function () {
                this.initGameCtrl();
                var cmd = this.curGameCmd;
                return cmd;
            };
            RPGPlayerCmdTranslator.prototype.setGameInput = function (gamepad) {
                this.gamepad = gamepad;
            };
            /**
             * 简单的转义出：df []
             * - 左按下->平移{方向，正在移动}
             * - 右按下->技能方向{技能索引，方向，正在释放}
             */
            RPGPlayerCmdTranslator.prototype.translate = function (gamepad) {
                if (gamepad == null) {
                    return;
                }
                gamepad.updateVirtualCtrls();
                if (gamepad.leftStickStatus.pressed) {
                    var cmd = this.getGameCmd();
                    cmd.move = {
                        actorId: undefined,
                        times: 1,
                        dir: gamepad.leftStickStatus.dir.getBinData(),
                    };
                }
                else {
                    var cmd = this.getGameCmd();
                    cmd.move = null;
                }
                this.getGameCmd().skills.length = 0;
                var skillSticks = gamepad.virutalCtrls.slice(1);
                for (var i = 0; i < skillSticks.length; i++) {
                    var status_1 = skillSticks[i].ctrlStatus;
                    if (status_1.touchAction != "loosed") {
                        var cmd = this.getGameCmd();
                        cmd.skills.push({
                            skillIndex: i,
                            actorId: undefined,
                            skillName: undefined,
                            skillId: undefined,
                            targets: [],
                            touchAction: status_1.touchAction,
                            dir: status_1.dir.getBinData(),
                        });
                    }
                }
                {
                    var cmd = this.curGameCmd;
                    if (cmd.skills.length == 0
                        && cmd.move == null) {
                        this.curGameCmd = null;
                    }
                }
            };
            RPGPlayerCmdTranslator.prototype.clearCurGameCmd = function () {
                this.curGameCmd = null;
            };
            RPGPlayerCmdTranslator.prototype.getCurGameCmd = function () {
                this.translate(this.gamepad);
                var cmd = fsync.ObjectUtils.copyDataDeep({}, this.curGameCmd);
                if (cmd != null) {
                    cmd.cmdId = uidTool.genTypedId("icmd_" + this.roleData.roleId);
                    cmd.cmdIndex = this.curCmdIndex++;
                }
                return cmd;
            };
            /**
             * 创建一个空指令, 提示一帧结束
             */
            RPGPlayerCmdTranslator.prototype.getNopCmd = function () {
                var cmd = {
                    /**
                     * 命令类型
                     */
                    cmdType: "RoleCmd",
                    cmdId: uidTool.genTypedId("icmd_" + this.roleData.roleId),
                    /**
                     * 创建顺序，保证命令执行顺序
                     */
                    cmdIndex: this.curCmdIndex++,
                    /**
                     * 该命令是否需要触发同步
                     * - 默认false
                     */
                    needSync: true,
                    // 来源
                    route: "local",
                    // 输入端id，通常可使用roleId代替
                    roleId: this.roleData.roleId,
                    // 创建时间（发送时间）
                    createTime: Date.now(),
                    skills: [],
                };
                return cmd;
            };
            return RPGPlayerCmdTranslator;
        }());
        rpg.RPGPlayerCmdTranslator = RPGPlayerCmdTranslator;
    })(rpg = kitten.rpg || (kitten.rpg = {}));
})(kitten || (kitten = {}));
var kitten;
(function (kitten) {
    var rpg;
    (function (rpg) {
        var RPGRoleDataBase = /** @class */ (function () {
            function RPGRoleDataBase() {
                this.userId = 0;
                this.roleId = "";
                this.roomId = 0;
                this.level = 0;
                this.battleCount = 0;
                this.score = 0;
                this.winRate = 0;
            }
            return RPGRoleDataBase;
        }());
        rpg.RPGRoleDataBase = RPGRoleDataBase;
    })(rpg = kitten.rpg || (kitten.rpg = {}));
})(kitten || (kitten = {}));
/**
 * 手势分析
 */
var kitten;
(function (kitten) {
    var uievent;
    (function (uievent) {
        var UIEventHandler = /** @class */ (function () {
            function UIEventHandler() {
                this._initOnce = false;
            }
            UIEventHandler.prototype.handlerEvent = function (data) {
                data.event.clientX = this.convertDesignX(data.event.clientX);
                data.event.clientY = this.convertDesignY(data.event.clientY);
                for (var _i = 0, _a = data.event.touches || []; _i < _a.length; _i++) {
                    var t = _a[_i];
                    t.clientX = this.convertDesignX(t.clientX);
                    t.clientY = this.convertDesignY(t.clientY);
                }
                // console.log(data)
                for (var _b = 0, _c = fsync.device.userEventHandlers; _b < _c.length; _b++) {
                    var handler = _c[_b];
                    handler(JSON.stringify(data));
                }
            };
            UIEventHandler.prototype.bindUIEvents = function (force) {
                var _this = this;
                if (force === void 0) { force = false; }
                if (this._initOnce && (!force)) {
                    return;
                }
                this._initOnce = true;
                var clientSize = fsync.device.clientSize;
                var convertDesignX;
                var convertDesignY;
                function _initGraph() {
                    // const screenWidth = document.body.clientWidth
                    // const screenHeight = document.body.clientHeight
                    var designWidth = clientSize.x;
                    var designHeight = clientSize.y;
                    var screenWidth = window.innerWidth;
                    var screenHeight = window.innerHeight;
                    console.log(screenWidth, screenHeight);
                    var scaleX = screenWidth / designWidth;
                    var scaleY = screenHeight / designHeight;
                    var scaleMin = Math.min(scaleX, scaleY);
                    var width = designWidth * scaleMin;
                    var height = designHeight * scaleMin;
                    console.log("screenSize:", screenWidth, screenHeight);
                    console.log("deviceSize:", width, height);
                    convertDesignX = function (x) {
                        return (x - (screenWidth - width) / 2) / scaleMin;
                    };
                    convertDesignY = function (y) {
                        return (y - (screenHeight - height) / 2) / scaleMin;
                    };
                }
                _initGraph();
                this.convertDesignX = convertDesignX;
                this.convertDesignY = convertDesignY;
                var handlerEvent = function (data) {
                    return _this.handlerEvent(data);
                };
                try {
                    document.onkeydown = function (ev) {
                        var data = {
                            action: "onkeydown",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                keyCode: ev.keyCode,
                                key: ev.key,
                            }
                        };
                        handlerEvent(data);
                    };
                    document.onkeyup = function (ev) {
                        var data = {
                            action: "onkeyup",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                keyCode: ev.keyCode,
                                key: ev.key,
                            }
                        };
                        handlerEvent(data);
                    };
                }
                catch (e) {
                    console.warn("document.onkeyXXX not support");
                }
                try {
                    document.onmousedown = function (ev) {
                        var data = {
                            action: "onmousedown",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                clientX: ev.clientX,
                                clientY: ev.clientY,
                            }
                        };
                        handlerEvent(data);
                    };
                    document.onmouseup = function (ev) {
                        var data = {
                            action: "onmouseup",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                clientX: ev.clientX,
                                clientY: ev.clientY,
                            }
                        };
                        handlerEvent(data);
                    };
                    document.onmousemove = function (ev) {
                        var data = {
                            action: "onmousemove",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                clientX: ev.clientX,
                                clientY: ev.clientY,
                            }
                        };
                        handlerEvent(data);
                    };
                }
                catch (e) {
                    console.warn("document.onmouseXXX not support");
                }
                try {
                    document.ontouchstart = function (ev) {
                        var data = {
                            action: "ontouchstart",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                touches: []
                            }
                        };
                        for (var i = 0; i < ev.changedTouches.length; i++) {
                            var t = ev.changedTouches[i];
                            data.event.touches.push({
                                identifier: t.identifier,
                                clientX: t.clientX,
                                clientY: t.clientY,
                            });
                        }
                        handlerEvent(data);
                    };
                    document.ontouchend = function (ev) {
                        var data = {
                            action: "ontouchend",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                touches: []
                            }
                        };
                        for (var i = 0; i < ev.changedTouches.length; i++) {
                            var t = ev.changedTouches[i];
                            data.event.touches.push({
                                identifier: t.identifier,
                                clientX: t.clientX,
                                clientY: t.clientY,
                            });
                        }
                        handlerEvent(data);
                    };
                    document.ontouchmove = function (ev) {
                        var data = {
                            action: "ontouchmove",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {
                                touches: []
                            }
                        };
                        for (var i = 0; i < ev.changedTouches.length; i++) {
                            var t = ev.changedTouches[i];
                            data.event.touches.push({
                                identifier: t.identifier,
                                clientX: t.clientX,
                                clientY: t.clientY,
                            });
                        }
                        handlerEvent(data);
                    };
                }
                catch (e) {
                    console.warn("document.ontouchXXX not support");
                }
                try {
                    document.body.onresize = function (ev) {
                        var data = {
                            action: "updateclientsize",
                            clientSize: {
                                width: clientSize.x,
                                height: clientSize.y,
                            },
                            event: {}
                        };
                        handlerEvent(data);
                    };
                }
                catch (e) {
                    console.warn("document.body.onresize not support");
                }
            };
            UIEventHandler.prototype.postInitEvent = function (size) {
                var _this = this;
                var clientSize = fsync.device.clientSize;
                clientSize.x = size.x;
                clientSize.y = size.y;
                var handlerEvent = function (data) {
                    return _this.handlerEvent(data);
                };
                {
                    var data = {
                        action: "updateclientsize",
                        clientSize: {
                            width: clientSize.x,
                            height: clientSize.y,
                        },
                        event: {}
                    };
                    handlerEvent(data);
                }
                {
                    var data = {
                        action: "onsetup",
                        clientSize: {
                            width: clientSize.x,
                            height: clientSize.y,
                        },
                        event: {}
                    };
                    handlerEvent(data);
                }
            };
            return UIEventHandler;
        }());
        uievent.UIEventHandler = UIEventHandler;
        uievent.uiEventHandler = new UIEventHandler();
    })(uievent = kitten.uievent || (kitten.uievent = {}));
})(kitten || (kitten = {}));
var lang;
(function (lang) {
    var libs;
    (function (libs) {
        var Log = /** @class */ (function () {
            function Log(x) {
                if (x === void 0) { x = {}; }
                this.setLogParams(x);
            }
            Object.defineProperty(Log, "enablePlainLog", {
                get: function () {
                    return Log._enablePlainLog;
                },
                set: function (value) {
                    Log._enablePlainLog = value;
                    if (value) {
                        var logOld_1 = console.log;
                        var warnOld_1 = console.warn;
                        var errorOld_1 = console.error;
                        console['logOld'] = console['logOld'] || logOld_1;
                        console['warnOld'] = console['warnOld'] || warnOld_1;
                        console['errorOld'] = console['errorOld'] || errorOld_1;
                        console.log = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var plainTexts = Log.toPlainLog(args);
                            logOld_1.apply(console, plainTexts);
                        };
                        console.warn = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var plainTexts = Log.toPlainLog(args);
                            warnOld_1.apply(console, plainTexts);
                        };
                        console.error = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var plainTexts = Log.toPlainLog(args);
                            errorOld_1.apply(console, plainTexts);
                        };
                    }
                    else {
                        if (console['logOld']) {
                            console.log = console['logOld'];
                        }
                        if (console['warnOld']) {
                            console.warn = console['warnOld'];
                        }
                        if (console['errorOld']) {
                            console.error = console['errorOld'];
                        }
                    }
                },
                enumerable: false,
                configurable: true
            });
            Log.toPlainLog = function (args) {
                var plainTexts = [];
                for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                    var info = args_1[_i];
                    var ret = '';
                    if (info instanceof Error) {
                        ret = "Error content: " + JSON.stringify(info) + "\n" + info.stack;
                    }
                    else if (info instanceof Object) {
                        ret = JSON.stringify(info);
                    }
                    else {
                        ret = info;
                    }
                    plainTexts.push(ret);
                }
                return plainTexts;
            };
            Object.defineProperty(Log, "instance", {
                get: function () {
                    if (!this._instance)
                        this._instance = new Log();
                    return this._instance;
                },
                enumerable: false,
                configurable: true
            });
            Log.prototype.setLogParams = function (_a) {
                var _b = _a === void 0 ? {} : _a, time = _b.time, tags = _b.tags;
                this.time = time;
                if (tags) {
                    this.tags = tags.concat();
                }
            };
            Log.prototype.getTagsStamp = function () {
                var tag = "[" + this.tags.join('][') + "]";
                if (this.time) {
                    tag = tag + ("[t/" + Date.now() + "]");
                }
                return tag;
            };
            /**
             * 将消息打印到控制台，不存储至日志文件
             */
            Log.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // if (this.tags) {
                //     args = this.tags.concat(args)
                // }
                // if (this.time) {
                //     args.push(new Date().getTime())
                // }
                console.log.apply(console, __spreadArray([' -', this.getTagsStamp()], args));
            };
            /**
             * 将消息打印到控制台，并储至日志文件
             */
            Log.prototype.warn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // if (this.tags) {
                //     args = this.tags.concat(args)
                // }
                // if (this.time) {
                //     args.push(new Date().getTime())
                // }
                console.warn.apply(console, __spreadArray([' -', this.getTagsStamp()], args));
            };
            /**
             * 将消息打印到控制台，并储至日志文件
             */
            Log.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // if (this.tags) {
                //     args = this.tags.concat(args)
                // }
                // if (this.time) {
                //     args.push(new Date().getTime())
                // }
                console.error.apply(console, __spreadArray([' -', this.getTagsStamp()], args));
                for (var _a = 0, args_2 = args; _a < args_2.length; _a++) {
                    var p = args_2[_a];
                    if (p instanceof Error) {
                        console.log(p.stack);
                    }
                }
                console.log('>>>error');
                console.log(new Error().stack);
            };
            Log._enablePlainLog = false;
            return Log;
        }());
        libs.Log = Log;
        libs.log = Log.instance;
    })(libs = lang.libs || (lang.libs = {}));
})(lang || (lang = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fsync;
(function (fsync) {
    /**
     * client base on websocket on browser platform
     */
    var BWebSocketClient = /** @class */ (function () {
        function BWebSocketClient() {
            this.onerror = null;
            this.onclose = null;
            this.isConnected = false;
        }
        BWebSocketClient.prototype.init = function () {
            this.sessionId = 0;
            this.isConnected = false;
            this.sessionCallbacks = fsync.EmptyTable();
            this.subHandlers = fsync.EmptyTable();
            return this;
        };
        BWebSocketClient.prototype.sendRaw = function (data) {
            this.client.send(data);
        };
        BWebSocketClient.prototype.send = function (reqId, data, call) {
            if (call === void 0) { call = null; }
            if (this.sessionId == 0) {
                this.sessionId++;
            }
            var sessionId = this.sessionId++;
            var sessionInfo = [
                // sessionId
                sessionId,
                // reqId
                reqId,
                0,
                0,
            ];
            var sessionData = new Uint8Array(Uint32Array.from(sessionInfo).buffer);
            var headInfo = [
                // headSize
                fsync.TCPReqHeadSize,
                // dataSize
                fsync.SessionInfoHeadSize + data.length,
                // TransOptions
                0,
            ];
            var headData = new Uint8Array(Uint32Array.from(headInfo).buffer);
            var sendData = fsync.BufferHelper.concatUint8Array([headData, sessionData, data]);
            if (!!call) {
                fsync.assert_true(!this.sessionCallbacks[sessionId]);
                this.sessionCallbacks[sessionId] = call;
            }
            try {
                this.sendRaw(sendData);
            }
            catch (e) {
                delete this.sessionCallbacks[sessionId];
            }
        };
        BWebSocketClient.prototype.listen = function (reqId, call) {
            var handlers = this.subHandlers[reqId];
            if (handlers == null) {
                handlers = [];
                this.subHandlers[reqId] = handlers;
            }
            handlers.push(call);
        };
        BWebSocketClient.prototype.onProcessData = function (data) {
            /**
             *	type HeadInfo struct {
             *		// 头部大小
             *		HeadSize uint32
             *		// 数据段总大小（不包含头部大小）
             *		DataSize uint32
             *		TransOptions TTCPTransOptions(uint32)
             *	}
             * 头部 3 个 uint32 大小
             */
            /**
            *	type SessionInfoHead struct {
            *		SessionId TSessionId
            *		ReqId     TReqId
            *		Time      TTimeStamp
            *	}
            * 	SessionHead 4 个 uint32 大小
            */
            var sessionData = data.slice(fsync.TCPReqHeadSize, fsync.TCPReqHeadSize + fsync.SessionInfoHeadSize);
            var sessionUint32 = new Uint32Array(sessionData);
            var sessionId = sessionUint32[0];
            var reqId = sessionUint32[1];
            var body = data.slice(fsync.TCPReqHeadSize + fsync.SessionInfoHeadSize);
            var time = sessionUint32[2] * (Math.pow(3, 32)) + sessionUint32[3];
            var sessionInfo = {
                data: new Uint8Array(body),
                reqId: reqId,
                rawData: data,
                sessionId: sessionId,
                time: 0,
            };
            var call = this.sessionCallbacks[sessionId];
            if (!!call) {
                delete this.sessionCallbacks[sessionId];
                call(sessionInfo);
            }
            var handlers = this.subHandlers[reqId];
            if (!!handlers) {
                for (var _i = 0, _a = handlers.concat(); _i < _a.length; _i++) {
                    var handler = _a[_i];
                    handler(sessionInfo);
                }
            }
        };
        BWebSocketClient.prototype.connect = function (url) {
            var _this = this;
            if (!url.startsWith("ws://")) {
                console.error("add 'ws://' to url please");
            }
            var ret = new fsync.RPromise();
            var client = new WebSocket(url);
            client.onerror = function (ev) {
                ret.fail(ev);
            };
            client.close = function (code, reason) {
                _this.isConnected = false;
                var _ = _this.onclose && _this.onclose({ code: code, reason: reason });
            };
            client.onopen = function (ev) {
                client.binaryType = "arraybuffer";
                _this.isConnected = true;
                client.onerror = function (ev) {
                    var _ = _this.onerror && _this.onerror(new Error("" + ev));
                };
                ret.success(undefined);
            };
            client.onmessage = function (e) { return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    data = e.data;
                    this.onProcessData(data);
                    return [2 /*return*/];
                });
            }); };
            this.client = client;
            return ret.promise;
        };
        BWebSocketClient.prototype.close = function () {
            if (this.client != null) {
                this.client.close();
            }
        };
        return BWebSocketClient;
    }());
    fsync.BWebSocketClient = BWebSocketClient;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    // import { WebSocketClient } from "./WebSocketClient";
    var ClientFactory = /** @class */ (function () {
        function ClientFactory() {
        }
        ClientFactory.createClient = function (proto) {
            var client;
            if (document == null) {
                // client = new WebSocketClient()
            }
            else {
                client = new fsync.BWebSocketClient();
            }
            client.init();
            return client;
        };
        return ClientFactory;
    }());
    fsync.ClientFactory = ClientFactory;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var PBClient = /** @class */ (function () {
        function PBClient() {
        }
        PBClient.prototype.init = function (client) {
            this.client = client;
            return this;
        };
        PBClient.prototype.SendReqPB = function (reqId, message, cls, call) {
            if (call === void 0) { call = null; }
            var bdata = this.proto.encode(message, cls);
            return this.send(reqId, bdata, call);
        };
        PBClient.prototype.SubEvent = function (respId, call) {
            this.client.listen(respId, call);
        };
        PBClient.prototype.close = function () {
            this.client && this.client.close();
        };
        PBClient.prototype.connect = function (url) {
            return this.client.connect(url);
        };
        PBClient.prototype.listen = function (reqId, call) {
            return this.client.listen(reqId, call);
        };
        PBClient.prototype.sendRaw = function (data) {
            return this.client.sendRaw(data);
        };
        PBClient.prototype.send = function (reqId, data, call) {
            if (call === void 0) { call = null; }
            return this.client.send(reqId, data, call);
        };
        Object.defineProperty(PBClient.prototype, "onerror", {
            get: function () {
                return this.client.onerror;
            },
            set: function (value) {
                this.client.onerror = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PBClient.prototype, "onclose", {
            get: function () {
                return this.client.onclose;
            },
            set: function (value) {
                this.client.onclose = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PBClient.prototype, "isConnected", {
            get: function () {
                return this.client.isConnected;
            },
            enumerable: false,
            configurable: true
        });
        return PBClient;
    }());
    fsync.PBClient = PBClient;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ProtoPool = /** @class */ (function () {
        function ProtoPool() {
        }
        ProtoPool.prototype.init = function () {
            this.protos = fsync.EmptyTable();
            return this;
        };
        ProtoPool.prototype.put = function (key, content) {
            this.protos[key] = content;
        };
        ProtoPool.prototype.get = function (key) {
            return this.protos[key];
        };
        return ProtoPool;
    }());
    fsync.ProtoPool = ProtoPool;
    fsync.protoPool = new ProtoPool().init();
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ProtoTool = /** @class */ (function () {
        function ProtoTool() {
            this.root = null;
            this.protoVersion = 0;
        }
        ProtoTool.prototype.init = function (pkg) {
            this.package = pkg;
            return this;
        };
        ProtoTool.prototype.parseProto = function (content, call) {
            var result = protobuf.parse(content);
            this.root = result.root;
            var _ = call && call();
        };
        ProtoTool.prototype.loadProto = function (srcFile, call) {
            var _this = this;
            var content = fsync.protoPool.get(srcFile);
            if (content != null) {
                this.parseProto(content, call);
            }
            else {
                protobuf.load(srcFile, function (err, root) {
                    if (err) {
                        throw err;
                    }
                    _this.root = root;
                    var _ = call && call();
                });
            }
        };
        ProtoTool.prototype.decode = function (buffer, cls) {
            var MessageProto = this.root.lookupType(this.package + "." + cls.name);
            var message = MessageProto.decode(buffer);
            var object = MessageProto.toObject(message, {
            // longs: String,
            // enums: String,
            // bytes: String,
            // see ConversionOptions
            });
            return object;
        };
        ProtoTool.prototype.encode = function (obj, cls) {
            if (cls === void 0) { cls = null; }
            var clsName = cls == null ? obj.constructor.name : cls.name;
            var MessageProto = this.root.lookupType(this.package + "." + clsName);
            var errMsg = MessageProto.verify(obj);
            if (errMsg)
                throw Error(errMsg);
            // Create a new message
            var message = MessageProto.create(obj); // or use .fromObject if conversion is necessary
            // Encode a message to an Uint8Array (browser) or Buffer (node)
            var buffer = MessageProto.encode(message).finish();
            return buffer;
        };
        return ProtoTool;
    }());
    fsync.ProtoTool = ProtoTool;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Reason = /** @class */ (function () {
        function Reason() {
        }
        return Reason;
    }());
    fsync.Reason = Reason;
    fsync.TCPReqHeadSize = 12;
    fsync.SessionInfoHeadSize = 16;
    fsync.UintSize = 4;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    /**
     * 分析有差异的entity，从而支持平行世界收束覆写
     */
    var EntityMergeSystem = /** @class */ (function () {
        function EntityMergeSystem() {
            // 仅在需要的时候开启，避免每帧都执行合并
            this.needMerge = false;
        }
        EntityMergeSystem.prototype.init = function () {
            this.needMerge = false;
            return this;
        };
        // mg1 -> mg2
        EntityMergeSystem.prototype.mergeDiffEntities = function (mg1, mg2) {
            mg1.dirtyManager.sortDirtyEntities(mg1);
            mg2.dirtyManager.sortDirtyEntities(mg2);
            var applyMap = fsync.EmptyTable();
            var newMap = fsync.EmptyTable();
            var removeMap = fsync.EmptyTable();
            var modifyMap = fsync.EmptyTable();
            mg1.dirtyManager.forEachDirtyEntities(function (entity) {
                if (applyMap[entity.identity]) {
                    return;
                }
                applyMap[entity.identity] = true;
                if (mg2.existsEntity(entity)) {
                    if (mg1.existsEntity(entity)) {
                        // this.onEntityUpdate(entity)
                        modifyMap[entity.identity] = entity;
                    }
                    else {
                        // this.onRemoveEntity(entity)
                        removeMap[entity.identity] = entity;
                    }
                }
                else {
                    if (mg1.existsEntity(entity)) {
                        // this.onNewEntity(entity)
                        newMap[entity.identity] = entity;
                    }
                }
            });
            mg2.dirtyManager.forEachDirtyEntities(function (entity) {
                if (applyMap[entity.identity]) {
                    return;
                }
                applyMap[entity.identity] = true;
                if (mg1.existsEntity(entity)) {
                    if (mg2.existsEntity(entity)) {
                        // this.onEntityUpdate(entity)
                        modifyMap[entity.identity] = entity;
                    }
                    else {
                        // this.onNewEntity(entity)
                        newMap[entity.identity] = entity;
                    }
                }
                else {
                    if (mg2.existsEntity(entity)) {
                        // this.onRemoveEntity(entity)
                        removeMap[entity.identity] = entity;
                    }
                }
            });
            // for (let entity of Object.values(removeMap)) {
            // 	if (newMap[entity.identity]) {
            // 		console.log("lkjwel")
            // 	}
            // }
            for (var _i = 0, _a = Object.values(removeMap); _i < _a.length; _i++) {
                var entity = _a[_i];
                this.onRemoveEntity(entity);
            }
            for (var _b = 0, _c = Object.values(newMap); _b < _c.length; _b++) {
                var entity = _c[_b];
                this.onNewEntity(entity);
            }
            for (var _d = 0, _e = Object.values(modifyMap); _d < _e.length; _d++) {
                var entity = _e[_d];
                this.onUpdateEntity(entity);
            }
            mg1.dirtyManager.clearFlags();
            mg2.dirtyManager.clearFlags();
        };
        // entity新建
        EntityMergeSystem.prototype.onNewEntity = function (entity) {
        };
        // entity移除
        EntityMergeSystem.prototype.onRemoveEntity = function (entity) {
        };
        // entity内容有变更
        EntityMergeSystem.prototype.onUpdateEntity = function (entity) {
        };
        EntityMergeSystem.prototype.onBeforeUpdate = function () {
            try {
                if (this.needMerge) {
                    this.mergeDiffEntities(this.source.entityManager, this.target.entityManager);
                    this.target.mergeFrom(this.source);
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        EntityMergeSystem.prototype.onAfterUpdate = function () {
        };
        EntityMergeSystem.prototype.update = function () {
        };
        return EntityMergeSystem;
    }());
    fsync.EntityMergeSystem = EntityMergeSystem;
})(fsync || (fsync = {}));
/// <reference path="./EntityMergeSystem.ts" />
var fsync;
(function (fsync) {
    var ForceMergeSystem = /** @class */ (function (_super) {
        __extends(ForceMergeSystem, _super);
        function ForceMergeSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // entity新建
        ForceMergeSystem.prototype.onNewEntity = function (entity) {
            this.target.entityManager.cloneEntity(entity, this.source.entityManager);
        };
        // entity移除
        ForceMergeSystem.prototype.onRemoveEntity = function (entity) {
            this.target.entityManager.removeEntity(entity);
        };
        // entity内容有变更
        ForceMergeSystem.prototype.onUpdateEntity = function (entity) {
            // this.target.entityManager.removeEntity(entity)
            // this.target.entityManager.cloneEntity(entity, this.source.entityManager)
            this.target.entityManager.overwriteEntity(entity, this.source.entityManager);
        };
        return ForceMergeSystem;
    }(fsync.EntityMergeSystem));
    fsync.ForceMergeSystem = ForceMergeSystem;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    /**
     * 帧同步策略
     */
    var FrameSyncStrategy = /** @class */ (function () {
        function FrameSyncStrategy() {
            this.waitSyncTimes = 0;
            this.waitSyncTimeline = 0;
            this.lastUpdateTime = 0;
            this.netDelayUtil = new fsync.NetDelay();
            this.lastSyncTime = 0;
        }
        FrameSyncStrategy.prototype.init = function (mainProcess) {
            this.mainProcess = mainProcess;
            return this;
        };
        FrameSyncStrategy.prototype.update = function () {
            var predictCmdBuffer = this.mainProcess.predictCmdBuffer;
            var mainCmdBuffer = this.mainProcess.mainCmdBuffer;
            var netCmd = predictCmdBuffer.getLatestNetCmd();
            if (netCmd != null && this.lastCmd != netCmd) {
                this.lastCmd = netCmd;
                var netDelay = 0;
                netDelay = (netCmd.receivedTime - netCmd.createTime) / 1e3;
                this.netDelayUtil.putDelay(netDelay);
            }
            // 以下单位秒
            var littleDelay = 0.08;
            var middleDelay = 1.0;
            var middleWaitTime = 3;
            var delayAv = this.netDelayUtil.getDelayAv();
            var syncDuration = 5000;
            if (delayAv < 0.100) {
                syncDuration = 2500;
            }
            else if (delayAv < 0.300) {
                syncDuration = 2000;
            }
            else if (delayAv < 0.500) {
                syncDuration = 1700;
            }
            else if (delayAv < 0.750) {
                syncDuration = 3000;
            }
            else if (delayAv < 1.100) {
                syncDuration = 3000;
            }
            else {
                syncDuration = delayAv * 10;
            }
            // 回滚重演流程
            var syncDt = (Date.now() - this.lastSyncTime);
            var needSyncRightNow = false;
            if (predictCmdBuffer.needSyncRightNow && syncDt > 800) {
                predictCmdBuffer.needSyncRightNow = false;
                needSyncRightNow = true;
            }
            if (mainCmdBuffer.needSyncRightNow && syncDt > 800) {
                mainCmdBuffer.needSyncRightNow = false;
                needSyncRightNow = true;
            }
            if (predictCmdBuffer.needSync
                && (Date.now() - this.lastSyncTime) > Math.max(500, syncDuration - mainCmdBuffer.surgeTimes * 500)) {
                predictCmdBuffer.needSync = false;
                needSyncRightNow = true;
            }
            if (needSyncRightNow) {
                mainCmdBuffer.surgeTimes = 0;
                predictCmdBuffer.surgeTimes = 0;
            }
            // if (false) {
            if (needSyncRightNow) {
                console.log("syncmmm");
                var t1 = Date.now();
                // 回滚重演流程需要禁用输入流程
                // 同时也尽量避免代入视图流程, 减少性能消耗
                var predictUpdater = this.mainProcess.predictUpdater;
                var isInputEnabled = predictUpdater.isGroupEnabled(fsync.Refers.InputSystem);
                if (isInputEnabled) {
                    predictUpdater.disableGroup(fsync.Refers.InputSystem);
                }
                this.lastSyncTime = Date.now();
                var curPredictFrameCount = this.mainProcess.worldPredict.frameCount;
                // this.mainProcess.syncPredictToCurFrame()
                this.mainProcess.syncMain(true);
                var latestLocalCmd = predictCmdBuffer.getLatestLocalCmd();
                // if (latestLocalCmd != null) {
                // this.mainProcess.updatePredictToTheFrame(latestLocalCmd.frameCount)
                // } else {
                this.mainProcess.updatePredictToTheFrame(curPredictFrameCount);
                // }
                if (isInputEnabled) {
                    predictUpdater.enableGroup(fsync.Refers.InputSystem);
                }
                var t2 = Date.now();
                console.log("merge all done", t2 - t1);
            }
            // 正常的推进流程
            {
                // let latestCmd = this.mainProcess.mainCmdBuffer.getOrderedNetCmd()
                // let serverMainFrameCount = latestCmd ? latestCmd.frameCount : 0
                // console.log("framexx:", this.mainProcess.worldPredict.frameCount, this.mainProcess.worldMain.frameCount, serverMainFrameCount, Date.now())
                var curPredictFrameCount = this.mainProcess.worldPredict.frameCount;
                // console.log("CPC:", curPredictFrameCount)
                predictCmdBuffer.syncLocalCmd();
                var localCmd = predictCmdBuffer.getLatestLocalCmd();
                if (localCmd != null) {
                    this.mainProcess.updatePredictToTheFrame(Math.max(localCmd.frameCount, curPredictFrameCount + 1));
                }
                else {
                    this.mainProcess.updatePredict();
                }
                // console.log("updateto", this.mainProcess.worldPredict.frameCount)
                // this.mainProcess.updateMain()
                this.mainProcess.syncMain(false);
            }
        };
        return FrameSyncStrategy;
    }());
    fsync.FrameSyncStrategy = FrameSyncStrategy;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var Refers = /** @class */ (function () {
        function Refers() {
        }
        Refers.NormalSystem = "NormalSystem";
        Refers.MergeSystem = "MergeSystem";
        Refers.InputSystem = "InputSystem";
        Refers.SyncViewSystem = "SyncViewSystem";
        return Refers;
    }());
    fsync.Refers = Refers;
    var WorldMainProcess = /** @class */ (function () {
        function WorldMainProcess() {
            // 主线帧计数
            this.serverMainFrameCount = 0;
            // 主线时间
            this.serverMainTime = 0;
            this.lastTT = 0;
        }
        WorldMainProcess.prototype.clear = function () {
            this.mainUpdater.clear();
            this.predictUpdater.clear();
            // this.worldMain.clear()
            // this.worldPredict.clear()
        };
        WorldMainProcess.prototype.init = function () {
            this.frameSyncStrategy = new fsync.FrameSyncStrategy().init(this);
            {
                var updateManager = new fsync.UpdaterGroupManager();
                updateManager.init();
                updateManager.setGroupUpdateOrder([
                    Refers.NormalSystem,
                    Refers.MergeSystem,
                ]);
                this.mainUpdater = updateManager;
            }
            {
                var updateManager = new fsync.UpdaterGroupManager();
                updateManager.init();
                updateManager.setGroupUpdateOrder([
                    Refers.NormalSystem,
                    Refers.MergeSystem,
                ]);
                this.predictUpdater = updateManager;
            }
            this.worldMain = new fsync.ECSWorld();
            this.worldMain.name = "main";
            this.worldMain.init(new fsync.FrameSyncUtils().init());
            this.worldPredict = new fsync.ECSWorld();
            this.worldPredict.name = "predict";
            this.worldPredict.init(new fsync.FrameSyncUtils().init());
            this.worlds = [this.worldMain, this.worldPredict];
            this.mergeSystem = this.createMergeSystem(this.worldMain, this.worldPredict);
            this.mainUpdater.getUpdaterGroup(Refers.MergeSystem).addUpdater(this.mergeSystem);
            this.ecsDataMergeSystem = this.createMergeSystem2(this.worldMain, this.worldPredict);
            this.mainUpdater.getUpdaterGroup(Refers.MergeSystem).addUpdater(this.ecsDataMergeSystem);
            // 默认禁用合并系统
            this.mainUpdater.disableGroup(Refers.MergeSystem);
            {
                var inputCmdBuffer = new fsync.InputCmdBuffer();
                inputCmdBuffer.name = this.worldMain.name;
                this.mainCmdBuffer = inputCmdBuffer;
            }
            {
                var inputCmdBuffer = new fsync.InputCmdBuffer();
                inputCmdBuffer.name = this.worldPredict.name;
                inputCmdBuffer.route = "local";
                this.predictCmdBuffer = inputCmdBuffer;
            }
            return this;
        };
        Object.defineProperty(WorldMainProcess.prototype, "netDelayUtil", {
            get: function () {
                return this.frameSyncStrategy.netDelayUtil;
            },
            enumerable: false,
            configurable: true
        });
        WorldMainProcess.prototype.createMergeSystem = function (source, target) {
            var mergeSystem = new fsync.ForceMergeSystem().init();
            mergeSystem.source = source;
            mergeSystem.target = target;
            return mergeSystem;
        };
        WorldMainProcess.prototype.createMergeSystem2 = function (source, target) {
            var mergeSystem = new fsync.eds.ECSDataForceMergeSystem().init();
            mergeSystem.source = source;
            mergeSystem.target = target;
            return mergeSystem;
        };
        WorldMainProcess.prototype.update = function () {
            this.frameSyncStrategy.update();
            this.worldPredict.entityManager.cleanEntityProtoMap();
            this.worldMain.entityManager.cleanEntityProtoMap();
        };
        WorldMainProcess.prototype.updatePredict = function () {
            this.worldPredict.frameCount++;
            this.predictUpdater.onBeforeUpdate();
            this.predictUpdater.update();
            this.predictUpdater.onAfterUpdate();
        };
        WorldMainProcess.prototype.syncMain = function (needMerge) {
            if (needMerge === void 0) { needMerge = false; }
            var latestNetCmd = this.mainCmdBuffer.getOrderedNetCmd();
            var serverMainFrameCount = latestNetCmd ? latestNetCmd.frameCount : 0;
            // 主线按照服务器节奏追赶进度
            while (this.worldMain.frameCount < serverMainFrameCount - 2) {
                this.updateMain();
            }
            if (needMerge) {
                console.log("serverMainFrameCount:", serverMainFrameCount);
                // this.mergeSystem.needMerge = true
                // this.mainUpdater.enableGroup(Refers.MergeSystem)
                /**
                 * 之所以维持 -1 而不是 -0 是为了确保每次执行的一帧内所有 cmdIndex 都已经接收到了
                 */
                if (this.worldMain.frameCount < serverMainFrameCount - 1) {
                    this.updateMain();
                    this.ecsDataMergeSystem.onBeforeUpdate();
                    this.predictCmdBuffer.mergeFrom(this.mainCmdBuffer);
                    // 需要定位出 latestNetCmd 附近的 localCmd, 从而定位出时间点相当的localCmd
                    // test
                    this.worldPredict.frameCount = latestNetCmd.createFrameCount;
                }
                // this.mergeSystem.onBeforeUpdate()
                // this.mainUpdater.disableGroup(Refers.MergeSystem)
                // this.mergeSystem.needMerge = false
            }
        };
        WorldMainProcess.prototype.syncPredictToMain = function () {
            // console.log("syncx")
            this.syncMain(true);
        };
        /**
         * 回滚到最新的主线，并重新依赖本地指令演进到最新预测线
         */
        WorldMainProcess.prototype.syncPredictToCurFrame = function () {
            var curPredictFrameCount = this.worldPredict.frameCount;
            this.syncMain(true);
            while (this.worldPredict.frameCount < curPredictFrameCount) {
                this.updatePredict();
            }
        };
        WorldMainProcess.prototype.updatePredictToTheFrame = function (frameCount) {
            while (this.worldPredict.frameCount < frameCount) {
                this.updatePredict();
            }
        };
        WorldMainProcess.prototype.updateMain = function () {
            var latestCmd = this.mainCmdBuffer.getOrderedNetCmd();
            var serverMainFrameCount = latestCmd ? latestCmd.frameCount : 0;
            if (this.worldMain.frameCount < serverMainFrameCount - 1) {
                // let xx = Date.now()
                // console.log("update time:", xx - this.lastTT)
                // this.lastTT = xx
                this.worldMain.frameCount++;
                this.mainUpdater.onBeforeUpdate();
                this.mainUpdater.update();
                this.mainUpdater.onAfterUpdate();
            }
        };
        return WorldMainProcess;
    }());
    fsync.WorldMainProcess = WorldMainProcess;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        /**
         * 分析有差异的entity，从而支持平行世界收束覆写
         */
        var ECSDataMergeSystem = /** @class */ (function () {
            function ECSDataMergeSystem() {
            }
            ECSDataMergeSystem.prototype.init = function () {
                return this;
            };
            // mg1 -> mg2
            ECSDataMergeSystem.prototype.mergeDiffEntities = function (mg1, mg2) {
                mg1.buildReferRelationMap();
                mg2.buildReferRelationMap();
                var applyMap = fsync.EmptyTable();
                var newMap = fsync.EmptyTable();
                var removeMap = fsync.EmptyTable();
                var modifyMap = fsync.EmptyTable();
                mg1.dirtyManager.forEachDirtyEntities(function (ecsdata) {
                    if (applyMap[ecsdata.oid]) {
                        return;
                    }
                    applyMap[ecsdata.oid] = true;
                    if (mg2.existsData(ecsdata)) {
                        if (mg1.existsData(ecsdata)) {
                            // this.onEntityUpdate(entity)
                            modifyMap[ecsdata.oid] = ecsdata;
                        }
                        else {
                            // this.onRemoveEntity(entity)
                            removeMap[ecsdata.oid] = ecsdata;
                        }
                    }
                    else {
                        if (mg1.existsData(ecsdata)) {
                            // this.onNewEntity(entity)
                            newMap[ecsdata.oid] = ecsdata;
                        }
                    }
                });
                mg2.dirtyManager.forEachDirtyEntities(function (ecsdata) {
                    if (applyMap[ecsdata.oid]) {
                        return;
                    }
                    applyMap[ecsdata.oid] = true;
                    if (mg1.existsData(ecsdata)) {
                        if (mg2.existsData(ecsdata)) {
                            // this.onEntityUpdate(entity)
                            modifyMap[ecsdata.oid] = ecsdata;
                        }
                        else {
                            // this.onNewEntity(entity)
                            newMap[ecsdata.oid] = ecsdata;
                        }
                    }
                    else {
                        if (mg2.existsData(ecsdata)) {
                            // this.onRemoveEntity(entity)
                            removeMap[ecsdata.oid] = ecsdata;
                        }
                    }
                });
                for (var _i = 0, _a = Object.values(removeMap); _i < _a.length; _i++) {
                    var entity = _a[_i];
                    this.onRemoveEntity(entity);
                }
                for (var _b = 0, _c = Object.values(newMap); _b < _c.length; _b++) {
                    var entity = _c[_b];
                    this.onNewEntity(entity);
                }
                for (var _d = 0, _e = Object.values(modifyMap); _d < _e.length; _d++) {
                    var entity = _e[_d];
                    this.onUpdateEntity(entity);
                }
                mg1.dirtyManager.clearFlags();
                mg2.dirtyManager.clearFlags();
            };
            // entity新建
            ECSDataMergeSystem.prototype.onNewEntity = function (entity) {
            };
            // entity移除
            ECSDataMergeSystem.prototype.onRemoveEntity = function (entity) {
            };
            // entity内容有变更
            ECSDataMergeSystem.prototype.onUpdateEntity = function (entity) {
            };
            ECSDataMergeSystem.prototype.onBeforeUpdate = function () {
                try {
                    this.mergeDiffEntities(this.source.dataManager, this.target.dataManager);
                    this.target.mergeFrom(this.source);
                }
                catch (e) {
                    console.error(e);
                }
            };
            ECSDataMergeSystem.prototype.onAfterUpdate = function () {
            };
            ECSDataMergeSystem.prototype.update = function () {
            };
            return ECSDataMergeSystem;
        }());
        eds.ECSDataMergeSystem = ECSDataMergeSystem;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
/// <reference path="./ECSDataMergeSystem.ts" />
var fsync;
(function (fsync) {
    var eds;
    (function (eds) {
        var ECSDataForceMergeSystem = /** @class */ (function (_super) {
            __extends(ECSDataForceMergeSystem, _super);
            function ECSDataForceMergeSystem() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            // entity新建
            ECSDataForceMergeSystem.prototype.onNewEntity = function (entity) {
                this.target.dataManager['cloneData'](entity, this.source.dataManager);
            };
            // entity移除
            ECSDataForceMergeSystem.prototype.onRemoveEntity = function (entity) {
                this.target.dataManager['removeData'](entity);
            };
            // entity内容有变更
            ECSDataForceMergeSystem.prototype.onUpdateEntity = function (entity) {
                this.target.dataManager['overwriteData'](entity, this.source.dataManager);
            };
            return ECSDataForceMergeSystem;
        }(eds.ECSDataMergeSystem));
        eds.ECSDataForceMergeSystem = ECSDataForceMergeSystem;
    })(eds = fsync.eds || (fsync.eds = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var network;
    (function (network) {
        var roomclient;
        (function (roomclient) {
            /**
             * 房间客户端工厂
             */
            var RoomClientFactory = /** @class */ (function () {
                function RoomClientFactory() {
                }
                /**
                 * 创建房间客户端
                 * - mgobe 腾讯
                 * @param techSource 所使用的技术来源
                 */
                RoomClientFactory.createClient = function (techSource) {
                    switch (techSource) {
                        case "mgobe": {
                            var client = new roomclient.mgobe.RoomClient().init();
                            return client;
                        }
                        case "glee": {
                            var client = new roomclient.glee.v1.RoomClient().init();
                            return client;
                        }
                        default: {
                            throw new Error("invalid techSource");
                        }
                    }
                };
                return RoomClientFactory;
            }());
            roomclient.RoomClientFactory = RoomClientFactory;
        })(roomclient = network.roomclient || (network.roomclient = {}));
    })(network = fsync.network || (fsync.network = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var roomserver;
    (function (roomserver) {
        /** TRolePlayState enum. */
        var TRolePlayState;
        (function (TRolePlayState) {
            TRolePlayState[TRolePlayState["PENDING"] = 0] = "PENDING";
            TRolePlayState[TRolePlayState["READY"] = 1] = "READY";
            TRolePlayState[TRolePlayState["PLAYING"] = 2] = "PLAYING";
        })(TRolePlayState = roomserver.TRolePlayState || (roomserver.TRolePlayState = {}));
    })(roomserver = fsync.roomserver || (fsync.roomserver = {}));
})(fsync || (fsync = {}));
/**
 * 基于腾讯云游戏的房间服务器
 */
(function (fsync) {
    var network;
    (function (network) {
        var roomclient;
        (function (roomclient) {
            var TRoomClientConnectInfo = /** @class */ (function () {
                function TRoomClientConnectInfo() {
                }
                return TRoomClientConnectInfo;
            }());
            roomclient.TRoomClientConnectInfo = TRoomClientConnectInfo;
            var TRoomServerInfo = /** @class */ (function () {
                function TRoomServerInfo() {
                }
                return TRoomServerInfo;
            }());
            roomclient.TRoomServerInfo = TRoomServerInfo;
            var TRoomClientConnectResult = /** @class */ (function () {
                function TRoomClientConnectResult() {
                }
                return TRoomClientConnectResult;
            }());
            roomclient.TRoomClientConnectResult = TRoomClientConnectResult;
        })(roomclient = network.roomclient || (network.roomclient = {}));
    })(network = fsync.network || (fsync.network = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    function TRoomModel_GetRoomInfo(roomInfo) {
        return {
            basicInfo: roomInfo.basicInfo,
            roomSettings: roomInfo.roomSettings,
            gameInfo: roomInfo.gameInfo,
        };
    }
    fsync.TRoomModel_GetRoomInfo = TRoomModel_GetRoomInfo;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    fsync.InvalidSessionId = 0;
    fsync.ReqId = {
        InvalidReqId: 0,
        //100000~100000 特殊请求
        BasicAllReq: 100000,
        //101000~102000 基础请求
        BasicHeartBeat: 101000,
        BasicCheckoutProto: 101001,
        //200000~202000 房间服务器基础请求
        RoomEnterRoom: 201000,
        RoomExitRoom: 201001,
        RoomDestroyRoomForce: 201002,
        //帧同步请求
        RoomFrameSync: 201003,
        RoomIsRoomValid: 201004,
        RoomSetRoomInfo: 201005,
        RoomBanishMember: 201006,
        RoomSetSelfRoomChairNo: 201007,
        RoomFilterMembers: 201008,
        RoomStartGame: 201009,
        RoomPrepareRoomStartGame: 201013,
        RoomFetchGameOpRecords: 201014,
        RoomGetRoomInfo: 201015,
        RoomNotifyCreateRoom: 201010,
        RoomNotifyRemoveRoom: 201011,
        //广播客户端消息
        RoomBroadCastClientMessage: 201012,
        //202000~203000房间匹配服
        RoomRegisterRoomServer: 202001,
        RoomUnregisterRoomServer: 202002,
        RoomMatchUsersWithDefaultRule: 203001,
        RoomSearchRoomById: 203002,
        RoomGetRecommendRooms: 203003,
        //房间其他业务ID
        //扔鸡蛋
        RoomThrowEgg: 211001,
    };
    //回复ID偏移段位
    var RespIdStageOffset = 100000000;
    var RespIdStageOffset2 = 200000000;
    fsync.RespId = {
        //帧同步通知
        RoomNotifyFrameSync: fsync.ReqId.RoomFrameSync + RespIdStageOffset2,
        RoomNotifyClientMessage: fsync.ReqId.RoomBroadCastClientMessage + RespIdStageOffset2,
    };
    function toRespId(reqId) {
        return reqId + RespIdStageOffset;
    }
    fsync.toRespId = toRespId;
})(fsync || (fsync = {}));
var serverprotoSource = "\nsyntax = \"proto3\";\npackage roomserver;\n\n// type int64 int64\n// type string string\n// type int64 int64\n// type string string\n// type string string\n\n//\u623F\u95F4id\u751F\u6210\u89C4\u5219: id:int64=parseInt64(timestamp+incr(0~99999))\n//type string string\n//type int64 int64\n\n// type int64 int64\n// type int32 int32\n// type float float\n// type string string\n// type string string\n// type string string\n// type int64 int64\n\nmessage TErrorInfo {\n  int32 code = 1;\n  string reason = 2;\n  string message = 3;\n}\nmessage TResultIndicate {\n  bool ok = 1;\n  TErrorInfo err = 2;\n}\nmessage TNormalResult {\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n}\n\nmessage TRoomBasic {\n  //\u623F\u95F4\u53F7\n  string room_id = 1;\n  //\u623F\u95F4\u521B\u5EFA\u65F6\u95F4\n  int64 create_time = 2;\n  // uuid \u7528\u4E8E\u65E5\u5FD7\u67E5\u8BE2\u7B49\u529F\u80FD\n  string uuid = 3;\n  //\u623F\u95F4\u8FDE\u63A5\u5730\u5740\u914D\u7F6E\n  string conn_addr = 4;\n  // \u521B\u5EFA\u623F\u95F4\u7684\u65B9\u5F0F\n  int64 create_type = 5;\n}\n\nmessage TRoomSettings {\n  string room_type = 1;\n  string name = 2;\n  string password = 3;\n  // \u623F\u4E3B\n  string owner_id = 4;\n  // \u662F\u5426\u7981\u6B62\u52A0\u5165\u623F\u95F4\n  bool is_forbid_join = 5;\n  // \u662F\u5426\u79C1\u6709, \u5C5E\u6027\u4E3A true \u8868\u793A\u8BE5\u623F\u95F4\u4E3A\u79C1\u6709\u623F\u95F4\uFF0C\u4E0D\u80FD\u88AB matchRoom \u63A5\u53E3\u5339\u914D\u5230\u3002\n  bool is_private = 6;\n}\n\nmessage TRoomGameInfo {\n  //  \u6E38\u620F\u6A21\u5F0F/\u7C7B\u578B\n  int32 game_mode = 1;\n  //  \u56FA\u5B9A\u5E27\u95F4\u9694\n  int64 frame_duration = 2;\n  //\u9700\u8981\u591A\u5C11\u89D2\u8272\u6765\u5339\u914D\n  int32 role_count = 3;\n  //\u5339\u914D\u65F6\u957F\n  float match_timeout = 4;\n}\n\nmessage TRoomGameState {\n  int64 game_session_id = 1;\n  int64 start_time = 2;\n  int32 random_seed = 3;\n  bool is_playing = 4;\n}\n\nmessage TServerInfo {\n  string address = 1;\n  string server_id = 2;\n}\n\nmessage TRoomInfo {\n  TRoomBasic basic_info = 1;\n  TRoomSettings room_settings = 2;\n  TRoomGameInfo game_info = 3;\n  TServerInfo server_info = 4;\n}\n\nmessage TRoomModel {\n  TRoomBasic basic_info = 1;\n  TRoomSettings room_settings = 2;\n  TRoomGameInfo game_info = 3;\n  TServerInfo server_info = 4;\n  TRoomGameState game_state = 5;\n  repeated TRoleModel role_models = 6;\n}\n\nmessage TReqGetRoomInfo { TRoomUserOpInfo op_info = 1; }\n\nmessage TGetRoomInfoResult {\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  TRoomModel room_model = 3;\n}\n\nmessage TQueryRoomsResult {\n  TResultIndicate indicate = 1;\n  TRoomsInfo rooms_info = 2;\n}\n\nmessage TRoomsInfo {\n  int32 count = 1;\n  repeated TRoomModel room_models = 2;\n}\n\nmessage TRoomUserOpInfo {\n  string room_id = 1;\n  string role_id = 2;\n  // \u7528\u4E8E\u5339\u914D\u81EA\u5E26\u89D2\u8272id\u751F\u6210\u529F\u80FD\u7684\u670D\u52A1\u5668\n  string role_token = 3;\n}\n\nmessage TMatchJobResult {\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  TRoomsInfo rooms_info = 3;\n}\n\nmessage TUserInfo { int64 user_id = 1; }\n\nmessage TRoleBasic {\n  // \u89D2\u8272id\n  string role_id = 1;\n  // \u89D2\u8272\u6027\u522B\n  int32 sex = 2;\n  // \u89D2\u8272\u540D\n  string role_name = 3;\n  // \u89D2\u8272\u5934\u50CFuri\n  string role_head_uri = 4;\n  // \u670D\u52A1\u5668\u751F\u6210\u7684roleId\n  string server_role_id = 5;\n  // \u662F\u5426\u4E3A\u4EBA\u673A\n  bool is_robot = 6;\n}\n\nmessage TRoleGameInfo {\n  //\u5206\u6570\n  int32 score = 1;\n  //\u7B49\u7EA7\n  int32 level = 2;\n  //\u5BF9\u6218\u5C40\u6570\n  int32 battle_count = 3;\n  //\u80DC\u7387\n  float win_rate = 4;\n}\n\nmessage TRoleRoomState {\n  string room_id = 1;\n  int64 chair_no = 2;\n  //\u89D2\u8272\u5BA2\u6237\u7AEF\u548C\u670D\u52A1\u5668\u662F\u5426\u8FDE\u63A5\n  bool is_conn_active = 3;\n  bool is_master = 4;\n}\n\nenum TRolePlayState {\n  PENDING = 0;\n  READY = 1;\n  PLAYING = 2;\n}\n\nmessage TRoleGameState { TRolePlayState state = 1; }\n\nmessage TRoleInfo {\n  TRoleBasic basic_info = 1;\n  TUserInfo user_info = 2;\n  TRoleGameInfo game_info = 3;\n  TRoleRoomState room_state = 4;\n}\n\nmessage TRoleModel {\n  TRoleBasic basic_info = 1;\n  TUserInfo user_info = 2;\n  TRoleGameInfo game_info = 3;\n  TRoleRoomState room_state = 4;\n  TRoleGameState game_state = 5;\n  TRoleNetworkInfo netwok_info = 6;\n}\n\nmessage TRoomMemberFilterInfo {}\n\nmessage THandleResult { TResultIndicate indicate = 1; }\n\nmessage TRoomPlayerMessageOptions {}\nmessage TRoomPlayerMessage { TRoomPlayerMessageOptions options = 1; }\n\nmessage TReqEnterRoom {\n  TRoomUserOpInfo op_info = 1;\n  TRoleInfo role_info = 2;\n  TRoomModel room_info = 3;\n}\n\nmessage TReqExitRoom { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqDestroyRoomForce { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqRoleBroadOptions { string role_id = 1; }\nmessage TFrameSyncInfo {\n  //  \u670D\u52A1\u5668\u5F53\u524D\u6E38\u620F\u65F6\u95F4\n  int64 server_time = 1;\n  //  \u670D\u52A1\u5668\u5F53\u524D\u6E38\u620F\u5DF2\u8FDB\u884C\u5E27\u6570\n  int64 server_frame_count = 2;\n  //\u5BA2\u6237\u7AEF\u5F53\u524D\u6E38\u620F\u65F6\u95F4\n  int64 client_time = 3;\n  // \u5BA2\u6237\u7AEF\u62DF\u5408\u65F6\u95F4, \u5206\u5E03\u5C3D\u91CF\u5747\u5300\n  int64 client_lerp_time = 4;\n  // \u968F\u673A\u6570\u79CD\u5B50\n  int32 random_seed = 5;\n  // \u662F\u5426\u8865\u5E27\n  bool is_replay = 6;\n}\n\nmessage TReqBroadCastFrameSyncReq {\n  //  \u6807\u8BB0\u53D1\u9001\u65B9\n  TRoomUserOpInfo op_info = 1;\n  TFrameSyncInfo sync_info = 2;\n  bytes msg_bytes = 4;\n}\n\nmessage TReqBroadCastClientMessage {\n  //  \u6807\u8BB0\u53D1\u9001\u65B9\n  TRoomUserOpInfo op_info = 1;\n  TFrameSyncInfo sync_info = 2;\n  //  \u6807\u8BB0\u63A5\u6536\u65B9\n  repeated TReqRoleBroadOptions targets = 3;\n  bytes msg_bytes = 4;\n  string msg_str = 5;\n}\n\nmessage TReqValidateRoom { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqSetRoomInfo {\n  TRoomUserOpInfo op_info = 1;\n  TRoomSettings room_info = 2;\n}\n\nmessage TReqBanishMember {\n  TRoomUserOpInfo op_info = 1;\n  repeated string roles = 2;\n}\n\nmessage TReqSetSelfRoomChairNo {\n  TRoomUserOpInfo op_info = 1;\n  int64 chair_no = 2;\n}\n\nmessage TReqFilterMembers {\n  TRoomUserOpInfo op_info = 1;\n  TRoomMemberFilterInfo filter_info = 2;\n}\n\nmessage TStartGameOptions {}\n\nmessage TReqStartGame {\n  TRoomUserOpInfo op_info = 1;\n  TStartGameOptions start_options = 2;\n}\n\nmessage TFrameSyncInitConfig { int32 random_seed = 1; }\nmessage TRespStartGameResult {\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  TFrameSyncInitConfig frame_sync_init_config = 3;\n}\n\nmessage TReqSearchRoomById { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqGetRecommendRooms { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqMatchUsersWithDefaultRule {\n  TRoomUserOpInfo op_info = 1;\n  TRoleInfo role_info = 2;\n  TRoomInfo room_info = 3;\n}\n\nmessage TReqNotifyCreateRoom { TRoomModel room_model = 1; }\n\nmessage TReqNotifyRemoveRoom { TRoomUserOpInfo op_info = 1; }\n\nmessage TReqFetchGameOpRecords { TRoomUserOpInfo op_info = 1; }\n\nmessage TFetchGameOpRecordsResult {\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  repeated TReqBroadCastFrameSyncReq sync_op_records = 3;\n}\n\nmessage TReqHeartBeat { TRoomUserOpInfo op_info = 1; }\n\nmessage THeartBeatResult { TRoomUserOpInfo op_info = 1; }\n\nmessage TRoomServerRegisterForMatcherServerInfo {\n  //\u670D\u52A1\u5668ID\n  string server_id = 1;\n  //\u623F\u95F4\u670D\u52A1\u5668\u8FDE\u63A5ID\n  string conn_id = 2;\n  //\u623F\u95F4\u670D\u8FDE\u63A5\u5730\u5740\uFF08\u7ED9\u5BA2\u6237\u7AEF\u7528\uFF09\n  string client_conn_addr = 3;\n  //\u5F53\u524D\u623F\u95F4\u6570\u91CF\n  int64 room_count = 4;\n}\n\nmessage TRoomServerRegisterForMatcherServerResult {\n  TResultIndicate indicate = 1;\n}\n\nmessage TRoomServerUnregisterForMatcherServerInfo {\n  //\u670D\u52A1\u5668ID\n  string server_id = 1;\n  //\u623F\u95F4\u670D\u52A1\u5668\u8FDE\u63A5ID\n  string conn_id = 2;\n  //\u623F\u95F4\u670D\u8FDE\u63A5\u5730\u5740\uFF08\u7ED9\u5BA2\u6237\u7AEF\u7528\uFF09\n  string client_conn_addr = 3;\n}\n\nmessage TRoomServerUnregisterForMatcherServerResult {\n  TResultIndicate indicate = 1;\n}\n\n// string \u957F\u5EA6\u9700\u8981\u5C0F\u4E8E64MB\nmessage TReqDownloadProto {\n  //  \u5BA2\u6237\u7AEFproto\u7248\u672C\n  int32 proto_version = 1;\n  // \u662F\u5426\u5F3A\u5236\u66F4\u65B0\n  bool force = 2;\n}\n\nmessage TProtoInfo {\n  //  \u670D\u52A1\u7AEF\u4F20\u56DE\u7684proto\u7248\u672C\n  int32 version = 1;\n  //  \u5982\u679C\u5BA2\u6237\u7AEF\u7F13\u5B58\u7684\u534F\u8BAE\u7248\u672C\u548C\u670D\u52A1\u7AEF\u7684\u76F8\u540C\uFF0C\u5219\u4E0D\u9700\u8981\u91CD\u65B0\u4E0B\u8F7D proto_content\n  string content = 2;\n}\n\nmessage TDownloadProtoResult {\n  TResultIndicate indicate = 1;\n  TProtoInfo proto_info = 2;\n}\n\nmessage TRoleNetworkInfo{\n  int32 room_network_state = 1;\n  int32 relay_network_state = 2;\n}\n\nmessage TChangeMemberNetworkStateResult{\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  TRoleNetworkInfo network_info = 3;\n}\n\nmessage TChangeCustomPlayerStatus{\n\n}\n\nmessage TReqFrameRecordsInfo{\n  int32 begin_frame = 1;\n  int32 end_frame = 2;\n}\n\nmessage TReqFrameRecordsResult{\n  TResultIndicate indicate = 1;\n  TRoomUserOpInfo op_info = 2;\n  repeated TReqBroadCastFrameSyncReq messages = 3;\n}\n\n// \u79FB\u52A8\u65B9\u5411\u4FE1\u606F\nmessage TActorMoveInfo{\n  int32 x = 1;\n  int32 y = 2;\n  string actor_id = 3;\n}\n\n// RPG\u63A7\u5236\u547D\u4EE4\u4FE1\u606F\nmessage TRPGPlayerCmd {\n  // \u89D2\u8272id\n  int32 role_id = 1;\n  // \u547D\u4EE4\u552F\u4E00Id\n  int32 cmd_id = 2;\n  // \u547D\u4EE4\u521B\u5EFA\u65F6\u95F4\n  int64 create_time = 3;\n  // \u547D\u4EE4\u521B\u5EFA\u6240\u5728\u5E27\n  int32 create_frame_count = 4;\n  // \u547D\u4EE4\u5B9E\u9645\u9700\u8981\u5728\u90A3\u4E00\u5E27\u6267\u884C\n  int32 frame_count = 5;\n  // \u547D\u4EE4\u5E8F\u53F7\n  int32 cmd_index = 6;\n  // // \u547D\u4EE4\u7C7B\u578B,false \u8868\u793A\u7A7A\u547D\u4EE4,true \u8868\u793A\u89D2\u8272\u547D\u4EE4\n  // bool cmd_type = 7;\n  // // \u8BE5\u547D\u4EE4\u662F\u5426\u53EF\u89E6\u53D1\u540C\u6B65\n  // bool need_sync = 8;\n  // // \u662F\u5426\u89E6\u53D1\u4F7F\u7528\u6280\u80FD\n  // bool use_skill = 9;\n  // \u5E03\u5C14\u503C\u6570\u636E\u96C6\u5408\n  int64 cmd_flags = 7;\n  // \u89D2\u8272\u79FB\u52A8\u4FE1\u606F\n  TActorMoveInfo move = 8;\n}\n\n";
var fileBaseName = 'serverproto';
var srcFile = "./src/protos/" + fileBaseName + ".proto";
fsync.protoPool.put(srcFile, serverprotoSource);
var fsync;
(function (fsync) {
    //import * as $protobuf from "protobufjs";
    /** Namespace  */
    var roomserver;
    (function (roomserver) {
        /** Represents a TErrorInfo. */
        var TErrorInfo = /** @class */ (function () {
            function TErrorInfo() {
            }
            return TErrorInfo;
        }());
        roomserver.TErrorInfo = TErrorInfo;
        /** Represents a TResultIndicate. */
        var TResultIndicate = /** @class */ (function () {
            function TResultIndicate() {
            }
            return TResultIndicate;
        }());
        roomserver.TResultIndicate = TResultIndicate;
        /** Represents a TNormalResult. */
        var TNormalResult = /** @class */ (function () {
            function TNormalResult() {
            }
            return TNormalResult;
        }());
        roomserver.TNormalResult = TNormalResult;
        /** Represents a TRoomBasic. */
        var TRoomBasic = /** @class */ (function () {
            function TRoomBasic() {
            }
            return TRoomBasic;
        }());
        roomserver.TRoomBasic = TRoomBasic;
        /** Represents a TRoomSettings. */
        var TRoomSettings = /** @class */ (function () {
            function TRoomSettings() {
            }
            return TRoomSettings;
        }());
        roomserver.TRoomSettings = TRoomSettings;
        /** Represents a TRoomGameInfo. */
        var TRoomGameInfo = /** @class */ (function () {
            function TRoomGameInfo() {
            }
            return TRoomGameInfo;
        }());
        roomserver.TRoomGameInfo = TRoomGameInfo;
        /** Represents a TRoomGameState. */
        var TRoomGameState = /** @class */ (function () {
            function TRoomGameState() {
            }
            return TRoomGameState;
        }());
        roomserver.TRoomGameState = TRoomGameState;
        /** Represents a TServerInfo. */
        var TServerInfo = /** @class */ (function () {
            function TServerInfo() {
            }
            return TServerInfo;
        }());
        roomserver.TServerInfo = TServerInfo;
        /** Represents a TRoomInfo. */
        var TRoomInfo = /** @class */ (function () {
            function TRoomInfo() {
            }
            return TRoomInfo;
        }());
        roomserver.TRoomInfo = TRoomInfo;
        /** Represents a TRoomModel. */
        var TRoomModel = /** @class */ (function () {
            function TRoomModel() {
            }
            return TRoomModel;
        }());
        roomserver.TRoomModel = TRoomModel;
        /** Represents a TReqGetRoomInfo. */
        var TReqGetRoomInfo = /** @class */ (function () {
            function TReqGetRoomInfo() {
            }
            return TReqGetRoomInfo;
        }());
        roomserver.TReqGetRoomInfo = TReqGetRoomInfo;
        /** Represents a TGetRoomInfoResult. */
        var TGetRoomInfoResult = /** @class */ (function () {
            function TGetRoomInfoResult() {
            }
            return TGetRoomInfoResult;
        }());
        roomserver.TGetRoomInfoResult = TGetRoomInfoResult;
        /** Represents a TQueryRoomsResult. */
        var TQueryRoomsResult = /** @class */ (function () {
            function TQueryRoomsResult() {
            }
            return TQueryRoomsResult;
        }());
        roomserver.TQueryRoomsResult = TQueryRoomsResult;
        /** Represents a TRoomsInfo. */
        var TRoomsInfo = /** @class */ (function () {
            function TRoomsInfo() {
            }
            return TRoomsInfo;
        }());
        roomserver.TRoomsInfo = TRoomsInfo;
        /** Represents a TRoomUserOpInfo. */
        var TRoomUserOpInfo = /** @class */ (function () {
            function TRoomUserOpInfo() {
            }
            return TRoomUserOpInfo;
        }());
        roomserver.TRoomUserOpInfo = TRoomUserOpInfo;
        /** Represents a TMatchJobResult. */
        var TMatchJobResult = /** @class */ (function () {
            function TMatchJobResult() {
            }
            return TMatchJobResult;
        }());
        roomserver.TMatchJobResult = TMatchJobResult;
        /** Represents a TUserInfo. */
        var TUserInfo = /** @class */ (function () {
            function TUserInfo() {
            }
            return TUserInfo;
        }());
        roomserver.TUserInfo = TUserInfo;
        /** Represents a TRoleBasic. */
        var TRoleBasic = /** @class */ (function () {
            function TRoleBasic() {
            }
            return TRoleBasic;
        }());
        roomserver.TRoleBasic = TRoleBasic;
        /** Represents a TRoleGameInfo. */
        var TRoleGameInfo = /** @class */ (function () {
            function TRoleGameInfo() {
            }
            return TRoleGameInfo;
        }());
        roomserver.TRoleGameInfo = TRoleGameInfo;
        /** Represents a TRoleRoomState. */
        var TRoleRoomState = /** @class */ (function () {
            function TRoleRoomState() {
            }
            return TRoleRoomState;
        }());
        roomserver.TRoleRoomState = TRoleRoomState;
        /** TRolePlayState enum. */
        var TRolePlayState;
        (function (TRolePlayState) {
            TRolePlayState[TRolePlayState["PENDING"] = 0] = "PENDING";
            TRolePlayState[TRolePlayState["READY"] = 1] = "READY";
            TRolePlayState[TRolePlayState["PLAYING"] = 2] = "PLAYING";
        })(TRolePlayState || (TRolePlayState = {}));
        /** Represents a TRoleGameState. */
        var TRoleGameState = /** @class */ (function () {
            function TRoleGameState() {
            }
            return TRoleGameState;
        }());
        roomserver.TRoleGameState = TRoleGameState;
        /** Represents a TRoleInfo. */
        var TRoleInfo = /** @class */ (function () {
            function TRoleInfo() {
            }
            return TRoleInfo;
        }());
        roomserver.TRoleInfo = TRoleInfo;
        /** Represents a TRoleModel. */
        var TRoleModel = /** @class */ (function () {
            function TRoleModel() {
            }
            return TRoleModel;
        }());
        roomserver.TRoleModel = TRoleModel;
        /** Represents a TRoomMemberFilterInfo. */
        var TRoomMemberFilterInfo = /** @class */ (function () {
            function TRoomMemberFilterInfo() {
            }
            return TRoomMemberFilterInfo;
        }());
        roomserver.TRoomMemberFilterInfo = TRoomMemberFilterInfo;
        /** Represents a THandleResult. */
        var THandleResult = /** @class */ (function () {
            function THandleResult() {
            }
            return THandleResult;
        }());
        roomserver.THandleResult = THandleResult;
        /** Represents a TRoomPlayerMessageOptions. */
        var TRoomPlayerMessageOptions = /** @class */ (function () {
            function TRoomPlayerMessageOptions() {
            }
            return TRoomPlayerMessageOptions;
        }());
        roomserver.TRoomPlayerMessageOptions = TRoomPlayerMessageOptions;
        /** Represents a TRoomPlayerMessage. */
        var TRoomPlayerMessage = /** @class */ (function () {
            function TRoomPlayerMessage() {
            }
            return TRoomPlayerMessage;
        }());
        roomserver.TRoomPlayerMessage = TRoomPlayerMessage;
        /** Represents a TReqEnterRoom. */
        var TReqEnterRoom = /** @class */ (function () {
            function TReqEnterRoom() {
            }
            return TReqEnterRoom;
        }());
        roomserver.TReqEnterRoom = TReqEnterRoom;
        /** Represents a TReqExitRoom. */
        var TReqExitRoom = /** @class */ (function () {
            function TReqExitRoom() {
            }
            return TReqExitRoom;
        }());
        roomserver.TReqExitRoom = TReqExitRoom;
        /** Represents a TReqDestroyRoomForce. */
        var TReqDestroyRoomForce = /** @class */ (function () {
            function TReqDestroyRoomForce() {
            }
            return TReqDestroyRoomForce;
        }());
        roomserver.TReqDestroyRoomForce = TReqDestroyRoomForce;
        /** Represents a TReqRoleBroadOptions. */
        var TReqRoleBroadOptions = /** @class */ (function () {
            function TReqRoleBroadOptions() {
            }
            return TReqRoleBroadOptions;
        }());
        roomserver.TReqRoleBroadOptions = TReqRoleBroadOptions;
        /** Represents a TFrameSyncInfo. */
        var TFrameSyncInfo = /** @class */ (function () {
            function TFrameSyncInfo() {
            }
            return TFrameSyncInfo;
        }());
        roomserver.TFrameSyncInfo = TFrameSyncInfo;
        /** Represents a TReqBroadCastFrameSyncReq. */
        var TReqBroadCastFrameSyncReq = /** @class */ (function () {
            function TReqBroadCastFrameSyncReq() {
            }
            return TReqBroadCastFrameSyncReq;
        }());
        roomserver.TReqBroadCastFrameSyncReq = TReqBroadCastFrameSyncReq;
        /** Represents a TReqBroadCastClientMessage. */
        var TReqBroadCastClientMessage = /** @class */ (function () {
            function TReqBroadCastClientMessage() {
            }
            return TReqBroadCastClientMessage;
        }());
        roomserver.TReqBroadCastClientMessage = TReqBroadCastClientMessage;
        /** Represents a TReqValidateRoom. */
        var TReqValidateRoom = /** @class */ (function () {
            function TReqValidateRoom() {
            }
            return TReqValidateRoom;
        }());
        roomserver.TReqValidateRoom = TReqValidateRoom;
        /** Represents a TReqSetRoomInfo. */
        var TReqSetRoomInfo = /** @class */ (function () {
            function TReqSetRoomInfo() {
            }
            return TReqSetRoomInfo;
        }());
        roomserver.TReqSetRoomInfo = TReqSetRoomInfo;
        /** Represents a TReqBanishMember. */
        var TReqBanishMember = /** @class */ (function () {
            function TReqBanishMember() {
            }
            return TReqBanishMember;
        }());
        roomserver.TReqBanishMember = TReqBanishMember;
        /** Represents a TReqSetSelfRoomChairNo. */
        var TReqSetSelfRoomChairNo = /** @class */ (function () {
            function TReqSetSelfRoomChairNo() {
            }
            return TReqSetSelfRoomChairNo;
        }());
        roomserver.TReqSetSelfRoomChairNo = TReqSetSelfRoomChairNo;
        /** Represents a TReqFilterMembers. */
        var TReqFilterMembers = /** @class */ (function () {
            function TReqFilterMembers() {
            }
            return TReqFilterMembers;
        }());
        roomserver.TReqFilterMembers = TReqFilterMembers;
        /** Represents a TStartGameOptions. */
        var TStartGameOptions = /** @class */ (function () {
            function TStartGameOptions() {
            }
            return TStartGameOptions;
        }());
        roomserver.TStartGameOptions = TStartGameOptions;
        /** Represents a TReqStartGame. */
        var TReqStartGame = /** @class */ (function () {
            function TReqStartGame() {
            }
            return TReqStartGame;
        }());
        roomserver.TReqStartGame = TReqStartGame;
        /** Represents a TFrameSyncInitConfig. */
        var TFrameSyncInitConfig = /** @class */ (function () {
            function TFrameSyncInitConfig() {
            }
            return TFrameSyncInitConfig;
        }());
        roomserver.TFrameSyncInitConfig = TFrameSyncInitConfig;
        /** Represents a TRespStartGameResult. */
        var TRespStartGameResult = /** @class */ (function () {
            function TRespStartGameResult() {
            }
            return TRespStartGameResult;
        }());
        roomserver.TRespStartGameResult = TRespStartGameResult;
        /** Represents a TReqSearchRoomById. */
        var TReqSearchRoomById = /** @class */ (function () {
            function TReqSearchRoomById() {
            }
            return TReqSearchRoomById;
        }());
        roomserver.TReqSearchRoomById = TReqSearchRoomById;
        /** Represents a TReqGetRecommendRooms. */
        var TReqGetRecommendRooms = /** @class */ (function () {
            function TReqGetRecommendRooms() {
            }
            return TReqGetRecommendRooms;
        }());
        roomserver.TReqGetRecommendRooms = TReqGetRecommendRooms;
        /** Represents a TReqMatchUsersWithDefaultRule. */
        var TReqMatchUsersWithDefaultRule = /** @class */ (function () {
            function TReqMatchUsersWithDefaultRule() {
            }
            return TReqMatchUsersWithDefaultRule;
        }());
        roomserver.TReqMatchUsersWithDefaultRule = TReqMatchUsersWithDefaultRule;
        /** Represents a TReqNotifyCreateRoom. */
        var TReqNotifyCreateRoom = /** @class */ (function () {
            function TReqNotifyCreateRoom() {
            }
            return TReqNotifyCreateRoom;
        }());
        roomserver.TReqNotifyCreateRoom = TReqNotifyCreateRoom;
        /** Represents a TReqNotifyRemoveRoom. */
        var TReqNotifyRemoveRoom = /** @class */ (function () {
            function TReqNotifyRemoveRoom() {
            }
            return TReqNotifyRemoveRoom;
        }());
        roomserver.TReqNotifyRemoveRoom = TReqNotifyRemoveRoom;
        /** Represents a TReqFetchGameOpRecords. */
        var TReqFetchGameOpRecords = /** @class */ (function () {
            function TReqFetchGameOpRecords() {
            }
            return TReqFetchGameOpRecords;
        }());
        roomserver.TReqFetchGameOpRecords = TReqFetchGameOpRecords;
        /** Represents a TFetchGameOpRecordsResult. */
        var TFetchGameOpRecordsResult = /** @class */ (function () {
            function TFetchGameOpRecordsResult() {
            }
            return TFetchGameOpRecordsResult;
        }());
        roomserver.TFetchGameOpRecordsResult = TFetchGameOpRecordsResult;
        /** Represents a TReqHeartBeat. */
        var TReqHeartBeat = /** @class */ (function () {
            function TReqHeartBeat() {
            }
            return TReqHeartBeat;
        }());
        roomserver.TReqHeartBeat = TReqHeartBeat;
        /** Represents a THeartBeatResult. */
        var THeartBeatResult = /** @class */ (function () {
            function THeartBeatResult() {
            }
            return THeartBeatResult;
        }());
        roomserver.THeartBeatResult = THeartBeatResult;
        /** Represents a TRoomServerRegisterForMatcherServerInfo. */
        var TRoomServerRegisterForMatcherServerInfo = /** @class */ (function () {
            function TRoomServerRegisterForMatcherServerInfo() {
            }
            return TRoomServerRegisterForMatcherServerInfo;
        }());
        roomserver.TRoomServerRegisterForMatcherServerInfo = TRoomServerRegisterForMatcherServerInfo;
        /** Represents a TRoomServerRegisterForMatcherServerResult. */
        var TRoomServerRegisterForMatcherServerResult = /** @class */ (function () {
            function TRoomServerRegisterForMatcherServerResult() {
            }
            return TRoomServerRegisterForMatcherServerResult;
        }());
        roomserver.TRoomServerRegisterForMatcherServerResult = TRoomServerRegisterForMatcherServerResult;
        /** Represents a TRoomServerUnregisterForMatcherServerInfo. */
        var TRoomServerUnregisterForMatcherServerInfo = /** @class */ (function () {
            function TRoomServerUnregisterForMatcherServerInfo() {
            }
            return TRoomServerUnregisterForMatcherServerInfo;
        }());
        roomserver.TRoomServerUnregisterForMatcherServerInfo = TRoomServerUnregisterForMatcherServerInfo;
        /** Represents a TRoomServerUnregisterForMatcherServerResult. */
        var TRoomServerUnregisterForMatcherServerResult = /** @class */ (function () {
            function TRoomServerUnregisterForMatcherServerResult() {
            }
            return TRoomServerUnregisterForMatcherServerResult;
        }());
        roomserver.TRoomServerUnregisterForMatcherServerResult = TRoomServerUnregisterForMatcherServerResult;
        /** Represents a TReqDownloadProto. */
        var TReqDownloadProto = /** @class */ (function () {
            function TReqDownloadProto() {
            }
            return TReqDownloadProto;
        }());
        roomserver.TReqDownloadProto = TReqDownloadProto;
        /** Represents a TProtoInfo. */
        var TProtoInfo = /** @class */ (function () {
            function TProtoInfo() {
            }
            return TProtoInfo;
        }());
        roomserver.TProtoInfo = TProtoInfo;
        /** Represents a TDownloadProtoResult. */
        var TDownloadProtoResult = /** @class */ (function () {
            function TDownloadProtoResult() {
            }
            return TDownloadProtoResult;
        }());
        roomserver.TDownloadProtoResult = TDownloadProtoResult;
        /** Represents a TRoleNetworkInfo. */
        var TRoleNetworkInfo = /** @class */ (function () {
            function TRoleNetworkInfo() {
            }
            return TRoleNetworkInfo;
        }());
        roomserver.TRoleNetworkInfo = TRoleNetworkInfo;
        /** Represents a TChangeMemberNetworkStateResult. */
        var TChangeMemberNetworkStateResult = /** @class */ (function () {
            function TChangeMemberNetworkStateResult() {
            }
            return TChangeMemberNetworkStateResult;
        }());
        roomserver.TChangeMemberNetworkStateResult = TChangeMemberNetworkStateResult;
        /** Represents a TChangeCustomPlayerStatus. */
        var TChangeCustomPlayerStatus = /** @class */ (function () {
            function TChangeCustomPlayerStatus() {
            }
            return TChangeCustomPlayerStatus;
        }());
        roomserver.TChangeCustomPlayerStatus = TChangeCustomPlayerStatus;
        /** Represents a TReqFrameRecordsInfo. */
        var TReqFrameRecordsInfo = /** @class */ (function () {
            function TReqFrameRecordsInfo() {
            }
            return TReqFrameRecordsInfo;
        }());
        roomserver.TReqFrameRecordsInfo = TReqFrameRecordsInfo;
        /** Represents a TReqFrameRecordsResult. */
        var TReqFrameRecordsResult = /** @class */ (function () {
            function TReqFrameRecordsResult() {
            }
            return TReqFrameRecordsResult;
        }());
        roomserver.TReqFrameRecordsResult = TReqFrameRecordsResult;
        /** Represents a TActorMoveInfo. */
        var TActorMoveInfo = /** @class */ (function () {
            function TActorMoveInfo() {
            }
            return TActorMoveInfo;
        }());
        roomserver.TActorMoveInfo = TActorMoveInfo;
        /** Represents a TRPGPlayerCmd. */
        var TRPGPlayerCmd = /** @class */ (function () {
            function TRPGPlayerCmd() {
            }
            return TRPGPlayerCmd;
        }());
        roomserver.TRPGPlayerCmd = TRPGPlayerCmd;
    })(roomserver = fsync.roomserver || (fsync.roomserver = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var network;
    (function (network) {
        var roomclient;
        (function (roomclient) {
            var mgobe;
            (function (mgobe) {
                var TRoomMsgEnum;
                (function (TRoomMsgEnum) {
                    TRoomMsgEnum["roommsg"] = "roommsg";
                    TRoomMsgEnum["leaveroom"] = "leaveroom";
                    TRoomMsgEnum["enterroom"] = "enterroom";
                    TRoomMsgEnum["changeroom"] = "changeroom";
                    TRoomMsgEnum["prepareready"] = "prepareready";
                    TRoomMsgEnum["startgame"] = "startgame";
                    TRoomMsgEnum["detoryroom"] = "detoryroom";
                    TRoomMsgEnum["changedmembernetowrk"] = "changedmembernetowrk";
                    TRoomMsgEnum["framemsg"] = "framemsg";
                    TRoomMsgEnum["startframesync"] = "startframesync";
                    TRoomMsgEnum["stopframesync"] = "stopframesync";
                })(TRoomMsgEnum = mgobe.TRoomMsgEnum || (mgobe.TRoomMsgEnum = {}));
                var TRoomProtoHelper = /** @class */ (function () {
                    function TRoomProtoHelper() {
                    }
                    TRoomProtoHelper.prototype.getLocalPlayerIdInRoom = function (roomInfo, serverRoleId) {
                        if (!roomInfo) {
                            return "";
                        }
                        var playerInfo = roomInfo.playerList.find(function (player) { return player.id == serverRoleId; });
                        var roleId = playerInfo ? playerInfo.customProfile : "";
                        return roleId;
                    };
                    TRoomProtoHelper.prototype.getFrameInfo = function (frame, item) {
                        var result = new fsync.roomserver.TReqBroadCastFrameSyncReq();
                        result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                        result.opInfo.serverRoleId = item.playerId;
                        result.opInfo.roomId = frame.roomId;
                        result.syncInfo = new fsync.roomserver.TFrameSyncInfo();
                        result.syncInfo.clientTime = item.timestamp;
                        result.syncInfo.serverTime = frame.time;
                        result.syncInfo.clientLerpTime = frame.time;
                        result.syncInfo.serverFrameCount = frame.id;
                        result.syncInfo.randomSeed = frame.ext.seed;
                        result.syncInfo.isReplay = frame.isReplay;
                        // console.log("frame.seed:", frame.ext.seed)
                        // console.log("frame:", frame.time, frame.id)
                        var frameData = item.data;
                        var str = frameData.m;
                        var head = str[0];
                        var bodyStr = str.slice(1);
                        var bodyBytes = base91.decode(bodyStr);
                        var realMsgBytes = bodyBytes;
                        if (head == 'e') {
                            realMsgBytes = pako.inflateRaw(bodyBytes);
                        }
                        result.msgBytes = realMsgBytes;
                        // const bs = []
                        // for (let key in frameData.msgBytes) {
                        // 	if (key != null) {
                        // 		bs.push(frameData.msgBytes[key])
                        // 	}
                        // }
                        // const bs2 = Uint8Array.from(bs)
                        // result.msgBytes = bs2
                        return result;
                    };
                    TRoomProtoHelper.prototype.getIndicate = function (evt) {
                        var indicate = new fsync.roomserver.TResultIndicate();
                        indicate.ok = (evt.code == MGOBE.ErrCode.EC_OK);
                        indicate.err = new fsync.roomserver.TErrorInfo();
                        indicate.err.code = evt.code;
                        indicate.err.message = evt.msg;
                        indicate.err.reason = evt.msg;
                        return indicate;
                    };
                    TRoomProtoHelper.prototype.getOkIndicate = function () {
                        var indicate = new fsync.roomserver.TResultIndicate();
                        indicate.ok = true;
                        indicate.err = new fsync.roomserver.TErrorInfo();
                        indicate.err.code = MGOBE.ErrCode.EC_OK;
                        indicate.err.message = "";
                        indicate.err.reason = "";
                        return indicate;
                    };
                    TRoomProtoHelper.prototype.getOpInfo = function (roleInfo, roomInfo) {
                        var opInfo = new fsync.roomserver.TRoomUserOpInfo();
                        opInfo.serverRoleId = roleInfo.basicInfo.serverRoleId;
                        opInfo.roleId = mgobe.RoomProtoHelper.getLocalPlayerIdInRoom(roomInfo, roleInfo.basicInfo.serverRoleId);
                        if (roomInfo) {
                            opInfo.roomId = roomInfo.id;
                        }
                        return opInfo;
                    };
                    TRoomProtoHelper.prototype.cloneOpInfo = function (opInfo) {
                        var opInfo2 = new fsync.roomserver.TRoomUserOpInfo();
                        opInfo2.serverRoleId = opInfo.serverRoleId;
                        opInfo2.roomId = opInfo.roomId;
                        opInfo2.roleId = opInfo.roleId;
                        return opInfo2;
                    };
                    TRoomProtoHelper.prototype.getRoomInfo = function (roomInfoRaw) {
                        var roomModel = new fsync.roomserver.TRoomModel();
                        roomModel.basicInfo = new fsync.roomserver.TRoomBasic();
                        roomModel.basicInfo.roomId = roomInfoRaw.id;
                        roomModel.basicInfo.createTime = roomInfoRaw.createTime;
                        roomModel.basicInfo.connAddr = "";
                        roomModel.basicInfo.uuid = "";
                        roomModel.basicInfo.createType = roomInfoRaw.createType;
                        roomModel.gameState = new fsync.roomserver.TRoomGameState();
                        roomModel.gameState.startTime = roomInfoRaw.startGameTime * 1000;
                        roomModel.gameState.gameSessionId = 0;
                        roomModel.gameState.isPlaying = (roomInfoRaw.frameSyncState == MGOBE.types.FrameSyncState.START);
                        roomModel.gameState.randomSeed = roomModel.basicInfo.createTime * 1000;
                        roomModel.gameInfo = new fsync.roomserver.TRoomGameInfo();
                        roomModel.gameInfo.frameDuration = 1 / roomInfoRaw.frameRate;
                        roomModel.gameInfo.gameMode = -1;
                        roomModel.gameInfo.matchTimeout = 0;
                        roomModel.gameInfo.roleCount = roomInfoRaw.maxPlayers;
                        roomModel.roomSettings = new fsync.roomserver.TRoomSettings();
                        roomModel.roomSettings.name = roomInfoRaw.name;
                        roomModel.roomSettings.password = "";
                        roomModel.roomSettings.roomType = roomInfoRaw.type;
                        roomModel.roomSettings.ownerId = roomInfoRaw.owner;
                        roomModel.roomSettings.isForbidJoin = roomInfoRaw.isForbidJoin;
                        roomModel.roomSettings.isPrivate = roomInfoRaw.isPrivate;
                        roomModel.serverInfo = new fsync.roomserver.TServerInfo();
                        roomModel.serverInfo.serverId = roomInfoRaw.routeId;
                        roomModel.serverInfo.address = "";
                        roomModel.roleModels = [];
                        roomInfoRaw.playerList.forEach(function (player) {
                            var roleModel = new fsync.roomserver.TRoleModel();
                            roleModel.basicInfo = new fsync.roomserver.TRoleBasic();
                            roleModel.basicInfo.isRobot = player.isRobot;
                            // 由于player.id是腾讯服务器自己生成的, 和游戏的roleid无法直接对应, 直接使用 customProfile
                            roleModel.basicInfo.serverRoleId = player.id;
                            roleModel.basicInfo.roleName = player.name;
                            roleModel.basicInfo.roleId = player.customProfile;
                            roleModel.netwokInfo = new fsync.roomserver.TRoleNetworkInfo();
                            roleModel.netwokInfo.relayNetworkState = player.relayNetworkState;
                            roleModel.netwokInfo.roomNetworkState = player.commonNetworkState;
                            roleModel.gameInfo = new fsync.roomserver.TRoleGameInfo();
                            roleModel.gameState = new fsync.roomserver.TRoleGameState();
                            roleModel.gameState.state = fsync.roomserver.TRolePlayState.READY;
                            roleModel.roomState = new fsync.roomserver.TRoleRoomState();
                            roleModel.roomState.isMaster = player.id == roomInfoRaw.owner;
                            roleModel.userInfo = new fsync.roomserver.TUserInfo();
                            // roleModel.userInfo.userId = player.id
                            roomModel.roleModels.push(roleModel);
                        });
                        return roomModel;
                    };
                    TRoomProtoHelper.prototype.getTheOnlyRoomsInfo = function (roomInfoRaw) {
                        var roomsInfo = new fsync.roomserver.TRoomsInfo();
                        roomsInfo.count = 1;
                        roomsInfo.roomModels = [];
                        roomsInfo.roomModels[0] = mgobe.RoomProtoHelper.getRoomInfo(roomInfoRaw);
                        return roomsInfo;
                    };
                    TRoomProtoHelper.prototype.getNormalResult = function (opInfo, evt) {
                        var result = new fsync.roomserver.TNormalResult();
                        result.indicate = this.getIndicate(evt);
                        result.opInfo = this.cloneOpInfo(opInfo);
                        return result;
                    };
                    TRoomProtoHelper.prototype.getOkNormalResult = function (opInfo) {
                        var result = new fsync.roomserver.TNormalResult();
                        result.indicate = this.getOkIndicate();
                        result.opInfo = this.cloneOpInfo(opInfo);
                        return result;
                    };
                    return TRoomProtoHelper;
                }());
                mgobe.TRoomProtoHelper = TRoomProtoHelper;
                mgobe.RoomProtoHelper = new TRoomProtoHelper();
                var RoomClient = /** @class */ (function () {
                    function RoomClient() {
                        this.frameEvent = new slib.SEvent();
                        this.roomEvent = new slib.SEvent();
                    }
                    RoomClient.prototype.init = function () {
                        this.stopHeartBeat = false;
                        return this;
                    };
                    RoomClient.prototype.setProto = function (proto) {
                        this.proto = proto;
                    };
                    /**
                     * 初始化连接
                     * @param call
                     */
                    RoomClient.prototype.connectAsync = function (info, call) {
                        var _this = this;
                        if (RoomClient.isNetworkInited) {
                            var result = new roomclient.TRoomClientConnectResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.indicate.ok = true;
                            this.setupRoomInstanceApi();
                            call(result);
                        }
                        else {
                            MGOBE.Listener.init(info.gameInfo, info.config, function (evt) {
                                var result = new roomclient.TRoomClientConnectResult();
                                result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                                if (result.indicate.ok) {
                                    RoomClient.isNetworkInited = true;
                                    result.serverInfo = new roomclient.TRoomServerInfo();
                                    result.serverInfo.serverTime = evt.data.serverTime;
                                    _this.setupRoomInstanceApi();
                                }
                                call(result);
                            });
                        }
                    };
                    RoomClient.prototype.setupRoomInstanceApi = function () {
                        var room = new MGOBE.Room();
                        this.matcherClient = room;
                        this.roomClient = room;
                        MGOBE.Listener.add(this.roomClient);
                        this.initFrameMsgListener();
                        this.initRoomClientMsgListener();
                    };
                    RoomClient.prototype.close = function () {
                        this.intervals && this.intervals.clearAllTimer();
                        if (this.roomClient) {
                            MGOBE.Listener.remove(this.roomClient);
                        }
                    };
                    /**
                     * 更新 protobuf 协议文件
                     * - 如果客户端版本较新，则服务器只返回服务器上协议版本号
                     * - 如果客户端版本较旧，则服务器返回新协议文件内容
                     * @param info
                     * @param call
                     */
                    RoomClient.prototype.checkoutProto = function (info, call) {
                    };
                    /**
                     * 通过房间匹配服匹配房间
                     * @param roleInfo
                     * @param roomInfo
                     * @param call
                     */
                    RoomClient.prototype.matchRoom = function (roleInfo, roomInfo, call) {
                        var _this = this;
                        this.roomClient.matchRoom({
                            maxPlayers: roomInfo.gameInfo.roleCount,
                            roomType: "" + roomInfo.roomSettings.roomType,
                            playerInfo: {
                                customPlayerStatus: 1,
                                customProfile: roleInfo.basicInfo.roleId,
                                name: roleInfo.basicInfo.roleName,
                            }
                        }, function (evt) {
                            var roomInfoRaw = evt.data.roomInfo;
                            var result = new fsync.roomserver.TMatchJobResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = roleInfo.basicInfo.serverRoleId;
                            result.opInfo.roleId = roleInfo.basicInfo.roleId;
                            if (roomInfoRaw) {
                                result.opInfo.roomId = roomInfoRaw.id;
                                if (result.indicate.ok) {
                                    result.roomsInfo = mgobe.RoomProtoHelper.getTheOnlyRoomsInfo(roomInfoRaw);
                                }
                            }
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 通过ID搜索房间
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.searchRoomById = function (opInfo, call) {
                        var _this = this;
                        MGOBE.Room.getRoomByRoomId({
                            roomId: "" + opInfo.roomId,
                        }, function (evt) {
                            var result = new fsync.roomserver.TQueryRoomsResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            if (result.indicate.ok) {
                                result.roomsInfo = mgobe.RoomProtoHelper.getTheOnlyRoomsInfo(evt.data.roomInfo);
                            }
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 发送房间服心跳
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.sendRoomHeartBeat = function (opInfo, call) {
                        // if (!this.roomClient.isConnected) {
                        // 	return
                        // }
                        // let reqData: roomserver.TReqHeartBeat = {
                        // 	opInfo: opInfo,
                        // }
                        // this.roomClient.SendReqPB(ReqId.BasicHeartBeat, reqData, roomserver.TReqHeartBeat, (sessionInfo: SessionInfo) => {
                        // 	let result = this.proto.decode(sessionInfo.data, roomserver.THeartBeatResult)
                        // 	call(result)
                        // })
                    };
                    /**
                     * 发送房间匹配服心跳
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.sendMatcherHeartBeat = function (opInfo, call) {
                    };
                    RoomClient.prototype.sendHeartBeat = function (opInfo) {
                        this.sendRoomHeartBeat(opInfo, function (result) {
                            //fmt.Println("SendRoomHeartBeat:", result)
                        });
                        this.sendMatcherHeartBeat(opInfo, function (result) {
                            //fmt.Println("SendMatcherHeartBeat:", result)
                        });
                    };
                    /**
                     * 维持心跳
                     * @param opInfo
                     */
                    RoomClient.prototype.startHeartBeatProcess = function (opInfo) {
                        var _this = this;
                        var id;
                        id = this.intervals.setInterval(function () {
                            if (_this.stopHeartBeat) {
                                clearInterval(id);
                                return;
                            }
                            _this.sendHeartBeat(opInfo);
                        }, 1e3);
                    };
                    /**
                     * 停止心跳
                     */
                    RoomClient.prototype.stopHeartBeatProcess = function () {
                        this.stopHeartBeat = true;
                    };
                    RoomClient.prototype._updateRoomInfo = function (roomInfo) {
                        if (roomInfo) {
                            this.cachedRoomInfo = mgobe.RoomProtoHelper.getRoomInfo(roomInfo);
                        }
                    };
                    RoomClient.prototype.getLocalRoomInfo = function () {
                        return this.cachedRoomInfo;
                    };
                    /**
                     * 进入房间
                     * @param roleInfo
                     * @param roomInfo
                     * @param call
                     */
                    RoomClient.prototype.enterRoom = function (roleInfo, roomInfo, call) {
                        var _this = this;
                        this.roomClient.joinRoom({
                            playerInfo: {
                                name: roleInfo.basicInfo.roleName,
                                customPlayerStatus: 1,
                                customProfile: roleInfo.basicInfo.roleId,
                            }
                        }, function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            result.opInfo = mgobe.RoomProtoHelper.getOpInfo(roleInfo, evt.data.roomInfo);
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 退出房间
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.exitRoom = function (opInfo, call) {
                        var _this = this;
                        this.roomClient.leaveRoom({}, function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            result.opInfo = mgobe.RoomProtoHelper.cloneOpInfo(opInfo);
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 强制销毁房间
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.destoryRoomForce = function (opInfo, call) {
                        this.roomClient.dismissRoom({}, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(opInfo, evt);
                            call(result);
                        });
                    };
                    /**
                     * 进入准备状态
                     * - 所有玩家进入准备状态之后，即可开始游戏
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.prepareStartGame = function (opInfo, call) {
                        var result = new fsync.roomserver.TRespStartGameResult();
                        result.opInfo = mgobe.RoomProtoHelper.cloneOpInfo(opInfo);
                        result.indicate = new fsync.roomserver.TResultIndicate();
                        result.indicate.ok = true;
                        result.indicate.err = new fsync.roomserver.TErrorInfo();
                        result.indicate.err.code = MGOBE.ErrCode.EC_OK;
                        result.indicate.err.message = "";
                        result.indicate.err.reason = "";
                        result.frameSyncInitConfig = {
                            randomSeed: 1,
                        };
                        call(result);
                        this.roomEvent.emit(TRoomMsgEnum.prepareready, result);
                        this.roomEvent.emit(TRoomMsgEnum.startgame, result);
                    };
                    RoomClient.prototype.initFrameMsgListener = function () {
                        var _this = this;
                        this.roomClient.onRecvFrame = function (evt) {
                            var frame = evt.data.frame;
                            // const dt = Math.random() * 500 + 500
                            // setTimeout(() => {
                            frame.items.forEach(function (item, index) {
                                var result = mgobe.RoomProtoHelper.getFrameInfo(frame, item);
                                _this.frameEvent.emit(TRoomMsgEnum.framemsg, result);
                            });
                            // }, dt)
                        };
                    };
                    /**
                     * 监听帧同步广播
                     * @param call
                     */
                    RoomClient.prototype.listenFrameSyncBroadCast = function (call) {
                        this.frameEvent.on(TRoomMsgEnum.framemsg, call);
                    };
                    RoomClient.prototype.offFrameSyncBroadCast = function (call) {
                        this.frameEvent.off(TRoomMsgEnum.framemsg, call);
                    };
                    /**
                     * 广播房间消息
                     * @param reqData
                     * @param call
                     */
                    RoomClient.prototype.broadCastRoomMessage = function (reqData, call) {
                        this.roomClient.sendToClient({
                            msg: reqData.msgStr,
                            recvPlayerList: reqData.targets.map(function (target) { return target.roleId; }),
                            recvType: MGOBE.types.RecvType.ROOM_SOME,
                        }, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(reqData.opInfo, evt);
                            call(result);
                        });
                    };
                    /**
                     * 广播帧同步消息
                     * @param reqData
                     * @param call
                     */
                    RoomClient.prototype.broadCastFrameSyncMessage = function (reqData, call) {
                        // e表示经过压缩, d表示未经压缩
                        // 实际是否经过zip
                        var isCompressed = false;
                        // zip后的数据
                        var zstr;
                        // 经观察, 大小小于40的数据很少能压缩
                        var needCompress = reqData.msgBytes.byteLength > 40;
                        if (needCompress) {
                            var zdata = pako.deflateRaw(reqData.msgBytes);
                            isCompressed = zdata.byteLength < reqData.msgBytes.byteLength;
                            if (isCompressed) {
                                zstr = "e" + base91.encode(zdata);
                            }
                            // console.log("compressedMSG:", zdata.byteLength, reqData.msgBytes.byteLength)
                        }
                        if (!isCompressed) {
                            zstr = "d" + base91.encode(reqData.msgBytes);
                        }
                        this.roomClient.sendFrame({
                            data: {
                                m: zstr,
                                // opInfo: reqData.opInfo,
                            },
                        }, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(reqData.opInfo, evt);
                            call(result);
                        });
                    };
                    /**
                     * 请求补帧
                     */
                    RoomClient.prototype.requestFrameSyncMessages = function (opInfo, paras, call) {
                        var _this = this;
                        this.roomClient.requestFrame({
                            beginFrameId: paras.beginFrame,
                            endFrameId: paras.endFrame,
                        }, function (evt) {
                            var result = new fsync.roomserver.TReqFrameRecordsResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            result.opInfo = mgobe.RoomProtoHelper.cloneOpInfo(opInfo);
                            result.messages = [];
                            if (result.indicate.ok) {
                                evt.data.frames.forEach(function (frame) {
                                    frame.items.forEach(function (item) {
                                        result.messages.push(mgobe.RoomProtoHelper.getFrameInfo(frame, item));
                                    });
                                });
                            }
                            call(result);
                            result.messages.forEach(function (message) {
                                _this.frameEvent.emit(TRoomMsgEnum.framemsg, message);
                            });
                        });
                    };
                    RoomClient.prototype.initRoomClientMsgListener = function () {
                        var _this = this;
                        this.roomClient.onRecvFromClient = function (evt) {
                            var result = new fsync.roomserver.TReqBroadCastClientMessage();
                            var info = evt.data;
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = info.sendPlayerId;
                            result.opInfo.roleId = "";
                            result.opInfo.roomId = info.roomId;
                            result.msgStr = info.msg;
                            _this.roomEvent.emit(TRoomMsgEnum.roommsg, result);
                        };
                    };
                    /**
                     * 监听房间内广播消息
                     * @param call
                     */
                    RoomClient.prototype.listenRoomBroadCast = function (call) {
                        this.roomEvent.on(TRoomMsgEnum.roommsg, function (result) {
                            call(result);
                        });
                    };
                    /**
                     * 监听成员离开房间
                     * @param call
                     */
                    RoomClient.prototype.listenExitRoom = function (call) {
                        var _this = this;
                        this.roomClient.onLeaveRoom = this.roomClient.onLeaveRoom || (function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = evt.data.leavePlayerId;
                            result.opInfo.roleId = "";
                            result.opInfo.roomId = evt.data.roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.leaveroom, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.leaveroom, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听成员进入房间
                     * @param call
                     */
                    RoomClient.prototype.listenEnterRoom = function (call) {
                        var _this = this;
                        this.roomClient.onJoinRoom = this.roomClient.onJoinRoom || (function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = evt.data.joinPlayerId;
                            result.opInfo.roleId = mgobe.RoomProtoHelper.getLocalPlayerIdInRoom(evt.data.roomInfo, evt.data.joinPlayerId);
                            result.opInfo.roomId = evt.data.roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.enterroom, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.enterroom, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听成员设置房间
                     * @param call
                     */
                    RoomClient.prototype.listenSetRoomInfo = function (call) {
                        var _this = this;
                        this.roomClient.onChangeRoom = this.roomClient.onChangeRoom || (function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = evt.data.roomInfo.owner;
                            result.opInfo.roleId = mgobe.RoomProtoHelper.getLocalPlayerIdInRoom(evt.data.roomInfo, evt.data.roomInfo.owner);
                            result.opInfo.roomId = evt.data.roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.changeroom, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.changeroom, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听成员进入准备状态
                     * @param call
                     */
                    RoomClient.prototype.listenPrepareStartGame = function (call) {
                        this.roomEvent.on(TRoomMsgEnum.prepareready, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听游戏开始
                     * @param call
                     */
                    RoomClient.prototype.listenStartGame = function (call) {
                        this.roomEvent.on(TRoomMsgEnum.startgame, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听同步游戏记录
                     * @param call
                     */
                    RoomClient.prototype.listenFetchGameOpRecords = function (call) {
                        throw new Error("not implemented.");
                    };
                    /**
                     * 房间销毁
                     * @param call
                     */
                    RoomClient.prototype.listenDestoryRoom = function (call) {
                        var _this = this;
                        this.roomClient.onDismissRoom = this.roomClient.onDismissRoom || (function (evt) {
                            var roomInfo = evt.data.roomInfo;
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = roomInfo.owner;
                            result.opInfo.roleId = mgobe.RoomProtoHelper.getLocalPlayerIdInRoom(roomInfo, roomInfo.owner);
                            result.opInfo.roomId = roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.detoryroom, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.detoryroom, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 验证房间
                     * @param call
                     */
                    RoomClient.prototype.validateRoom = function (opInfo, call) {
                        var result = mgobe.RoomProtoHelper.getOkNormalResult(opInfo);
                        call(result);
                    };
                    /**
                     * 设置房间信息
                     * @param call
                     */
                    RoomClient.prototype.setRoomInfo = function (opInfo, roomInfo, call) {
                        var _this = this;
                        this.roomClient.changeRoom({
                            roomName: roomInfo.name,
                            isForbidJoin: roomInfo.isForbidJoin,
                            isPrivate: roomInfo.isPrivate,
                            owner: roomInfo.ownerId,
                        }, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(opInfo, evt);
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 放逐成员（未实现）
                     * @param call
                     */
                    RoomClient.prototype.banishMember = function (opInfo, roles, call) {
                        var _this = this;
                        this.roomClient.removePlayer({
                            removePlayerId: roles[0],
                        }, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(opInfo, evt);
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 获取房间信息（未实现）
                     * @param call
                     */
                    RoomClient.prototype.getRoomInfo = function (opInfo, call) {
                        var _this = this;
                        this.roomClient.getRoomDetail(function (evt) {
                            var result = new fsync.roomserver.TGetRoomInfoResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt);
                            result.opInfo = mgobe.RoomProtoHelper.cloneOpInfo(opInfo);
                            var roomInfoRaw = evt.data.roomInfo;
                            if (roomInfoRaw) {
                                result.opInfo.roomId = roomInfoRaw.id;
                                if (result.indicate.ok) {
                                    result.roomModel = mgobe.RoomProtoHelper.getRoomInfo(roomInfoRaw);
                                }
                            }
                            _this._updateRoomInfo(evt.data.roomInfo);
                            call(result);
                        });
                    };
                    /**
                     * 获取游戏操作记录（未实现）
                     * @param call
                     */
                    RoomClient.prototype.fetchGameOpRecords = function (opInfo, call) {
                        throw new Error("not implemented.");
                    };
                    /**
                     * 监听成员网络状态变化
                     * @param call
                     */
                    RoomClient.prototype.listenChangedMemberNetworkState = function (call) {
                        var _this = this;
                        this.roomClient.onChangePlayerNetworkState = this.roomClient.onChangePlayerNetworkState || (function (evt) {
                            var info = evt.data;
                            var result = new fsync.roomserver.TChangeMemberNetworkStateResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = info.changePlayerId;
                            result.opInfo.roleId = mgobe.RoomProtoHelper.getLocalPlayerIdInRoom(info.roomInfo, info.changePlayerId);
                            result.opInfo.roomId = info.roomInfo.id;
                            result.networkInfo = new fsync.roomserver.TRoleNetworkInfo();
                            result.networkInfo.roomNetworkState = info.networkState;
                            result.networkInfo.relayNetworkState = info.networkState;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.changedmembernetowrk, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.changedmembernetowrk, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 监听玩家信息变化
                     * @param call
                     */
                    RoomClient.prototype.listenChangeCustomPlayerStatus = function (call) {
                        throw new Error("not implemented: 暂时没啥用,不实现.");
                    };
                    /**
                     * 开始帧同步
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.startFrameSync = function (opInfo, call) {
                        this.roomClient.startFrameSync({}, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(opInfo, evt);
                            call(result);
                        });
                    };
                    /**
                     * 停止帧同步
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.stopFrameSync = function (opInfo, call) {
                        this.roomClient.stopFrameSync({}, function (evt) {
                            var result = mgobe.RoomProtoHelper.getNormalResult(opInfo, evt);
                            call(result);
                        });
                    };
                    /**
                     * 开始帧同步广播回调接口
                     * @param call
                     */
                    RoomClient.prototype.onStartFrameSync = function (call) {
                        var _this = this;
                        this.roomClient.onStartFrameSync = this.roomClient.onStartFrameSync || (function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = "";
                            result.opInfo.roleId = "";
                            result.opInfo.roomId = evt.data.roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.startframesync, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.startframesync, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 停止帧同步广播回调接口
                     */
                    RoomClient.prototype.onStopFrameSync = function (call) {
                        var _this = this;
                        this.roomClient.onStopFrameSync = this.roomClient.onStopFrameSync || (function (evt) {
                            var result = new fsync.roomserver.TNormalResult();
                            result.indicate = mgobe.RoomProtoHelper.getOkIndicate();
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.opInfo.serverRoleId = "";
                            result.opInfo.roleId = "";
                            result.opInfo.roomId = evt.data.roomInfo.id;
                            _this._updateRoomInfo(evt.data.roomInfo);
                            _this.roomEvent.emit(TRoomMsgEnum.stopframesync, result);
                        });
                        this.roomEvent.on(TRoomMsgEnum.stopframesync, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 自动补帧失败回调接口
                     */
                    RoomClient.prototype.onAutoRequestFrameError = function (call) {
                        var _this = this;
                        this.roomClient.onAutoRequestFrameError = this.roomClient.onAutoRequestFrameError || (function (evt) {
                            var result = new fsync.roomserver.TReqFrameRecordsResult();
                            result.indicate = mgobe.RoomProtoHelper.getIndicate(evt.data);
                            result.opInfo = new fsync.roomserver.TRoomUserOpInfo();
                            result.messages = [];
                            if (result.indicate.ok) {
                                var framesData = evt.data.data;
                                if (framesData) {
                                    framesData.frames.forEach(function (frame) {
                                        result.opInfo.roomId = frame.roomId;
                                        frame.items.forEach(function (item) {
                                            result.messages.push(mgobe.RoomProtoHelper.getFrameInfo(frame, item));
                                        });
                                    });
                                }
                            }
                            call(result);
                            result.messages.forEach(function (message) {
                                _this.frameEvent.emit(TRoomMsgEnum.framemsg, message);
                            });
                        });
                        this.roomEvent.on(TRoomMsgEnum.stopframesync, function (evt) {
                            call(evt);
                        });
                    };
                    /**
                     * 重试自动补帧
                     * @param opInfo
                     * @param call
                     */
                    RoomClient.prototype.retryAutoRequestFrame = function (opInfo, call) {
                        this.roomClient.retryAutoRequestFrame();
                        var result = mgobe.RoomProtoHelper.getOkNormalResult(opInfo);
                        call(result);
                    };
                    // setPerformRecordContainer(performer: PerformRecordContainer) {
                    // this.MatcherClient.SetPerformRecordContainer(performer)
                    // this.RoomClient.SetPerformRecordContainer(performer)
                    // }
                    RoomClient.isNetworkInited = false;
                    return RoomClient;
                }());
                mgobe.RoomClient = RoomClient;
            })(mgobe = roomclient.mgobe || (roomclient.mgobe = {}));
        })(roomclient = network.roomclient || (network.roomclient = {}));
    })(network = fsync.network || (fsync.network = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var network;
    (function (network) {
        var roomclient;
        (function (roomclient) {
            var glee;
            (function (glee) {
                var v1;
                (function (v1) {
                    var RoomClient = /** @class */ (function () {
                        function RoomClient() {
                        }
                        RoomClient.prototype.getLocalRoomInfo = function () {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.offFrameSyncBroadCast = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.connectAsync = function (info, call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.requestFrameSyncMessages = function (opInfo, paras, call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.listenDestoryRoom = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.listenChangedMemberNetworkState = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.listenChangeCustomPlayerStatus = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.startFrameSync = function (opInfo, call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.stopFrameSync = function (opInfo, call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.onStartFrameSync = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.onStopFrameSync = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.onAutoRequestFrameError = function (call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.retryAutoRequestFrame = function (opInfo, call) {
                            throw new Error("Method not implemented.");
                        };
                        RoomClient.prototype.init = function () {
                            this.stopHeartBeat = false;
                            this.matcherClient = new fsync.PBClient().init(fsync.ClientFactory.createClient("websocket"));
                            this.roomClient = new fsync.PBClient().init(fsync.ClientFactory.createClient("websocket"));
                            var onClose = function () {
                                console.warn("client disconnected");
                            };
                            this.matcherClient.onclose = onClose;
                            this.roomClient.onclose = onClose;
                            return this;
                        };
                        RoomClient.prototype.setProto = function (proto) {
                            this.proto = proto;
                            this.matcherClient.proto = proto;
                            this.roomClient.proto = proto;
                        };
                        // setPerformRecordContainer(performer: PerformRecordContainer) {
                        // this.MatcherClient.SetPerformRecordContainer(performer)
                        // this.RoomClient.SetPerformRecordContainer(performer)
                        // }
                        RoomClient.prototype.close = function () {
                            this.matcherClient.close();
                            this.roomClient.close();
                        };
                        /**
                         * 更新 protobuf 协议文件
                         * - 如果客户端版本较新，则服务器只返回服务器上协议版本号
                         * - 如果客户端版本较旧，则服务器返回新协议文件内容
                         * @param info
                         * @param call
                         */
                        RoomClient.prototype.checkoutProto = function (info, call) {
                            var _this = this;
                            var reqData = {
                                protoVersion: info.clientProtoVersion,
                                force: false,
                            };
                            this.matcherClient.SendReqPB(fsync.ReqId.BasicCheckoutProto, reqData, fsync.roomserver.TReqDownloadProto, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TDownloadProtoResult);
                                call(result);
                            });
                        };
                        /**
                         * 通过房间匹配服匹配房间
                         * @param roleInfo
                         * @param roomInfo
                         * @param call
                         */
                        RoomClient.prototype.matchRoom = function (roleInfo, roomInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: {
                                    roleId: roleInfo.basicInfo.roleId,
                                    roomId: roomInfo.basicInfo.roomId,
                                },
                                roleInfo: roleInfo,
                                roomInfo: roomInfo,
                            };
                            this.matcherClient.SendReqPB(fsync.ReqId.RoomMatchUsersWithDefaultRule, reqData, fsync.roomserver.TReqMatchUsersWithDefaultRule, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TMatchJobResult);
                                call(result);
                            });
                        };
                        /**
                         * 通过ID搜索房间
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.searchRoomById = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.matcherClient.SendReqPB(fsync.ReqId.RoomSearchRoomById, reqData, fsync.roomserver.TReqSearchRoomById, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TQueryRoomsResult);
                                call(result);
                            });
                        };
                        /**
                         * 发送房间服心跳
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.sendRoomHeartBeat = function (opInfo, call) {
                            var _this = this;
                            if (!this.roomClient.isConnected) {
                                return;
                            }
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.BasicHeartBeat, reqData, fsync.roomserver.TReqHeartBeat, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.THeartBeatResult);
                                call(result);
                            });
                        };
                        /**
                         * 发送房间匹配服心跳
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.sendMatcherHeartBeat = function (opInfo, call) {
                            var _this = this;
                            if (!this.matcherClient.isConnected) {
                                return;
                            }
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.matcherClient.SendReqPB(fsync.ReqId.BasicHeartBeat, reqData, fsync.roomserver.TReqHeartBeat, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.THeartBeatResult);
                                call(result);
                            });
                        };
                        RoomClient.prototype.sendHeartBeat = function (opInfo) {
                            this.sendRoomHeartBeat(opInfo, function (result) {
                                //fmt.Println("SendRoomHeartBeat:", result)
                            });
                            this.sendMatcherHeartBeat(opInfo, function (result) {
                                //fmt.Println("SendMatcherHeartBeat:", result)
                            });
                        };
                        /**
                         * 维持心跳
                         * @param opInfo
                         */
                        RoomClient.prototype.startHeartBeatProcess = function (opInfo) {
                            var _this = this;
                            var id;
                            id = this.intervals.setInterval(function () {
                                if (_this.stopHeartBeat) {
                                    clearInterval(id);
                                    return;
                                }
                                _this.sendHeartBeat(opInfo);
                            }, 1e3);
                        };
                        /**
                         * 停止心跳
                         */
                        RoomClient.prototype.stopHeartBeatProcess = function () {
                            this.stopHeartBeat = true;
                        };
                        /**
                         * 进入房间
                         * @param roleInfo
                         * @param roomInfo
                         * @param call
                         */
                        RoomClient.prototype.enterRoom = function (roleInfo, roomInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: {
                                    roleId: roleInfo.basicInfo.roleId,
                                    roomId: roomInfo.basicInfo.roomId,
                                },
                                roleInfo: roleInfo,
                                roomInfo: roomInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomEnterRoom, reqData, fsync.roomserver.TReqEnterRoom, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 退出房间
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.exitRoom = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomExitRoom, reqData, fsync.roomserver.TReqExitRoom, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 强制销毁房间
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.destoryRoomForce = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomDestroyRoomForce, reqData, fsync.roomserver.TReqDestroyRoomForce, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 进入准备状态
                         * - 所有玩家进入准备状态之后，即可开始游戏
                         * @param opInfo
                         * @param call
                         */
                        RoomClient.prototype.prepareStartGame = function (opInfo, call) {
                            var _this = this;
                            //fmt.Println("PrepareStartGame", opInfo)
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomPrepareRoomStartGame, reqData, fsync.roomserver.TReqStartGame, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TRespStartGameResult);
                                call(result);
                            });
                        };
                        /**
                         * 广播房间消息
                         * @param reqData
                         * @param call
                         */
                        RoomClient.prototype.broadCastRoomMessage = function (reqData, call) {
                            var _this = this;
                            this.roomClient.SendReqPB(fsync.ReqId.RoomBroadCastClientMessage, reqData, fsync.roomserver.TReqBroadCastClientMessage, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 广播帧同步消息
                         * @param reqData
                         * @param call
                         */
                        RoomClient.prototype.broadCastFrameSyncMessage = function (reqData, call) {
                            var _this = this;
                            this.roomClient.SendReqPB(fsync.ReqId.RoomFrameSync, reqData, fsync.roomserver.TReqBroadCastFrameSyncReq, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听帧同步广播
                         * @param call
                         */
                        RoomClient.prototype.listenFrameSyncBroadCast = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.RespId.RoomNotifyFrameSync, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TReqBroadCastFrameSyncReq);
                                call(result);
                            });
                        };
                        /**
                         * 监听房间内广播消息
                         * @param call
                         */
                        RoomClient.prototype.listenRoomBroadCast = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.RespId.RoomNotifyClientMessage, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TReqBroadCastClientMessage);
                                call(result);
                            });
                        };
                        /**
                         * 监听成员离开房间
                         * @param call
                         */
                        RoomClient.prototype.listenExitRoom = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomExitRoom), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听成员进入房间
                         * @param call
                         */
                        RoomClient.prototype.listenEnterRoom = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomEnterRoom), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听成员设置房间
                         * @param call
                         */
                        RoomClient.prototype.listenSetRoomInfo = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomSetRoomInfo), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听成员进入准备状态
                         * @param call
                         */
                        RoomClient.prototype.listenPrepareStartGame = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomPrepareRoomStartGame), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听游戏开始
                         * @param call
                         */
                        RoomClient.prototype.listenStartGame = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomStartGame), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TRespStartGameResult);
                                call(result);
                            });
                        };
                        /**
                         * 监听同步游戏记录
                         * @param call
                         */
                        RoomClient.prototype.listenFetchGameOpRecords = function (call) {
                            var _this = this;
                            this.roomClient.SubEvent(fsync.toRespId(fsync.ReqId.RoomFetchGameOpRecords), function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TFetchGameOpRecordsResult);
                                call(result);
                            });
                        };
                        /**
                         * 验证房间
                         * @param call
                         */
                        RoomClient.prototype.validateRoom = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomIsRoomValid, reqData, fsync.roomserver.TReqValidateRoom, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 设置房间信息
                         * @param call
                         */
                        RoomClient.prototype.setRoomInfo = function (opInfo, roomInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                                roomInfo: roomInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomSetRoomInfo, reqData, fsync.roomserver.TReqSetRoomInfo, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 放逐成员（未实现）
                         * @param call
                         * @deprecated
                         */
                        RoomClient.prototype.banishMember = function (opInfo, roles, call) {
                            var _this = this;
                            var roles2 = roles.map(function (v) { return "" + v; });
                            var reqData = {
                                opInfo: opInfo,
                                roles: roles2,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomBanishMember, reqData, fsync.roomserver.TReqBanishMember, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TNormalResult);
                                call(result);
                            });
                        };
                        /**
                         * 获取房间信息（未实现）
                         * @param call
                         */
                        RoomClient.prototype.getRoomInfo = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomGetRoomInfo, reqData, fsync.roomserver.TReqGetRoomInfo, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TGetRoomInfoResult);
                                call(result);
                            });
                        };
                        /**
                         * 获取游戏操作记录（未实现）
                         * @param call
                         */
                        RoomClient.prototype.fetchGameOpRecords = function (opInfo, call) {
                            var _this = this;
                            var reqData = {
                                opInfo: opInfo,
                            };
                            this.roomClient.SendReqPB(fsync.ReqId.RoomFetchGameOpRecords, reqData, fsync.roomserver.TReqFetchGameOpRecords, function (sessionInfo) {
                                var result = _this.proto.decode(sessionInfo.data, fsync.roomserver.TFetchGameOpRecordsResult);
                                call(result);
                            });
                        };
                        return RoomClient;
                    }());
                    v1.RoomClient = RoomClient;
                })(v1 = glee.v1 || (glee.v1 = {}));
            })(glee = roomclient.glee || (roomclient.glee = {}));
        })(roomclient = network.roomclient || (network.roomclient = {}));
    })(network = fsync.network || (fsync.network = {}));
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var TPrefab = /** @class */ (function () {
        function TPrefab() {
        }
        TPrefab.prototype.init = function (prefabId) {
            this.prefabId = prefabId;
            return this;
        };
        return TPrefab;
    }());
    fsync.TPrefab = TPrefab;
})(fsync || (fsync = {}));
var fsync;
(function (fsync) {
    var ViewBindManager = /** @class */ (function () {
        function ViewBindManager() {
            this.entityViewMap = fsync.EmptyTable();
        }
        ViewBindManager.prototype.init = function () {
            this.entityViewMap = fsync.EmptyTable();
            return this;
        };
        ViewBindManager.prototype.getEntityView = function (entity) {
            return this.entityViewMap[entity.identity];
        };
        ViewBindManager.prototype.bindEntityView = function (entity, view) {
            this.entityViewMap[entity.identity] = view;
        };
        ViewBindManager.prototype.unbindEntityView = function (entity) {
            delete this.entityViewMap[entity.identity];
        };
        ViewBindManager.prototype.removeEntity = function (entity) {
            this.removeEntityById(entity.identity);
        };
        ViewBindManager.prototype.removeEntityById = function (entityId) {
            var view = this.entityViewMap[entityId];
            view.destroy();
            delete this.entityViewMap[entityId];
        };
        ViewBindManager.prototype.getAllEntityID = function () {
            return Object.keys(this.entityViewMap);
        };
        ViewBindManager.prototype.clear = function () {
            for (var _i = 0, _a = this.getAllEntityID(); _i < _a.length; _i++) {
                var key = _a[_i];
                this.removeEntityById(key);
            }
        };
        return ViewBindManager;
    }());
    fsync.ViewBindManager = ViewBindManager;
})(fsync || (fsync = {}));
var graph;
(function (graph) {
    graph.createSprite = function () {
        return graphengine.createSprite();
    };
    graph.getSystemEvent = function () {
        if (graph.systemEventCenter == null) {
            graph.systemEventCenter = new slib.SEvent();
        }
        return graph.systemEventCenter;
    };
    graph.PredefSystemEvent = {
        GameFinished: "GameFinished",
    };
})(graph || (graph = {}));
(function (graph) {
    window["graph"] = graph;
})(graph || (graph = {}));
var fsync;
(function (fsync) {
    var TransformSyncSystem = /** @class */ (function (_super) {
        __extends(TransformSyncSystem, _super);
        function TransformSyncSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransformSyncSystem.prototype.update = function () {
            var _this = this;
            // 自动跟踪entity销毁、创建
            // !!! 还需要补充同entityid，不同view类型和状态的情况处理，否则会出错
            {
                var entities = this.entityManager.createQuery().toArray();
                var existsMap = fsync.EmptyTable();
                for (var _i = 0, entities_3 = entities; _i < entities_3.length; _i++) {
                    var entity = entities_3[_i];
                    existsMap[entity.identity] = entity;
                }
                var viewMap = fsync.EmptyTable();
                for (var _a = 0, _b = this.viewBinder.getAllEntityID(); _a < _b.length; _a++) {
                    var id = _b[_a];
                    viewMap[id] = true;
                    if (!existsMap[id]) {
                        this.viewBinder.removeEntityById(id);
                    }
                }
                for (var _c = 0, entities_4 = entities; _c < entities_4.length; _c++) {
                    var entity = entities_4[_c];
                    if (!viewMap[entity.identity]) {
                        var meta = this.entityManager.getComponent(entity, fsync.PrefabMeta);
                        if (meta != null) {
                            var ViewFactory = fsync.PrefabManager.inst.getPrefabView(meta.prefabId);
                            var view = new ViewFactory().init();
                            this.viewBinder.bindEntityView(entity, view);
                        }
                    }
                }
            }
            // console.log("allentitycount:", this.entityManager.createQuery().with(Translation).toArray().length)
            this.entityManager.createQuery().with(fsync.Translation).forEach(function (entity) {
                var view = _this.viewBinder.getEntityView(entity);
                if (view != null) {
                    var trans = _this.entityManager.getComponent(entity, fsync.Translation);
                    view.setPos(trans.value);
                }
            });
            this.entityManager.createQuery().with(fsync.Scale).forEach(function (entity) {
                var view = _this.viewBinder.getEntityView(entity);
                if (view != null) {
                    var scale = _this.entityManager.getComponent(entity, fsync.Scale);
                    view.setScale(scale.value);
                }
            });
            this.entityManager.createQuery().with(fsync.Rotation).forEach(function (entity) {
                var view = _this.viewBinder.getEntityView(entity);
                if (view != null) {
                    var rotate = _this.entityManager.getComponent(entity, fsync.Rotation);
                    view.setRotation(rotate.value);
                }
            });
        };
        TransformSyncSystem = __decorate([
            fsync.cname("TransformSyncSystem")
        ], TransformSyncSystem);
        return TransformSyncSystem;
    }(fsync.SystemBase));
    fsync.TransformSyncSystem = TransformSyncSystem;
})(fsync || (fsync = {}));
//# sourceMappingURL=fsync.js.map