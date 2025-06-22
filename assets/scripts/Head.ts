import { _decorator, CCFloat, CCInteger, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Head")
export class Head extends Component {
    @property(Array(Node))
    public bodyArray: Node[] = [];

    @property(Prefab)
    public bodyPrefab: Prefab = null;

    @property(Prefab)
    public foodPrefab: Prefab = null;

    @property(CCInteger)
    bodyNum: number = 2;

    @property(CCFloat)
    bodyDistance: number = 50;

    speed: number = 200;

    start() {}

    update(deltaTime: number) {}
}
