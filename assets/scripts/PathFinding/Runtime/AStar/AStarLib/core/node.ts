import { Int3 } from "../../../Scan/Int3";
import { INodeConstructor, IPoint } from '../interfaces/astar.interfaces';

export class ANode {
  private _id!: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  readonly ipos: IPoint;

  private fValue: number;
  private gValue: number;
  private hValue: number;
  private parentNode: ANode | undefined;
  private isOnClosedList: boolean;
  private isOnOpenList: boolean;
  private _isWalkable!: boolean;
  public get isWalkable(): boolean {
    return this._isWalkable;
  }
  public set isWalkable(value: boolean) {
    this._isWalkable = value;
  }

  position!: Int3

  constructor(aParams: INodeConstructor) {
    this._id = aParams.id;
    this.ipos = aParams.ipos;

    this.hValue = 0;
    this.gValue = 0;
    this.fValue = 0;
    this.parentNode = undefined;
    this.isOnClosedList = false;
    this.isOnOpenList = false;
    this.isWalkable = aParams.walkable || false;
  }

  mergeTo(node: ANode) {
    node.fValue = this.fValue
    node.gValue = this.gValue
    node.hValue = this.hValue
    node.parentNode = this.parentNode
    node.isOnClosedList = this.isOnClosedList
    node.isOnOpenList = this.isOnOpenList
    node.isWalkable = this.isWalkable
  }
  clone(): ANode {
    var node = new ANode(this)
    this.mergeTo(node)
    return node
  }

  /**
   * Calculate or Recalculate the F value
   * This is a private function
   */
  private calculateFValue(): void {
    this.fValue = this.gValue + this.hValue;
  }

  /**
   * Set the g value of the node
   */
  public setGValue(gValue: number): void {
    this.gValue = gValue;
    // The G value has changed, so recalculate the f value
    this.calculateFValue();
  }

  /**
   * Set the h value of the node
   */
  public setHValue(hValue: number): void {
    this.hValue = hValue;
    // The H value has changed, so recalculate the f value
    this.calculateFValue();
  }

  /**
   * Reset the FGH values to zero
   */
  public setFGHValuesToZero(): void {
    this.fValue = this.gValue = this.hValue = 0;
  }

  /**
   * Getter functions
   */
  public getFValue(): number {
    return this.fValue;
  }

  public getGValue(): number {
    return this.gValue;
  }

  public getHValue(): number {
    return this.hValue;
  }

  public getParent(): ANode | undefined {
    return this.parentNode;
  }

  public getIsOnClosedList(): boolean {
    return this.isOnClosedList;
  }

  public getIsOnOpenList(): boolean {
    return this.isOnOpenList;
  }

  public getIsWalkable(): boolean {
    return this.isWalkable;
  }

  /**
   * Setter functions
   */
  public setParent(parent?: ANode): void {
    this.parentNode = parent;
  }

  public setIsOnClosedList(isOnClosedList: boolean): void {
    this.isOnClosedList = isOnClosedList;
  }

  public setIsOnOpenList(isOnOpenList: boolean): void {
    this.isOnOpenList = isOnOpenList;
  }

  public setIsWalkable(isWalkable: boolean): void {
    this.isWalkable = isWalkable;
  }

  public HasConnectionInDirection(dir: number): boolean {
    throw new Error("not implement")
  }

  public idistance(target: ANode): number {
    var ix = this.ipos.x - target.ipos.x
    var iy = this.ipos.y - target.ipos.y
    var idist = ix * ix + iy * iy
    idist = Math.floor(Math.sqrt(idist))
    return idist
  }

}
