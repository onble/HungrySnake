import { _decorator, CCFloat, CCInteger, Component, math, Node, Prefab, UITransform, v3 } from "cc";
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

    start() {
        this.node.setPosition(this.randomPos());
    }

    update(deltaTime: number) {}

    /**
     * 随机蛇生成的位置
     */
    randomPos(): math.Vec3 {
        const width = this.node.parent.getComponent(UITransform).contentSize.width - 200;
        const height = this.node.parent.getComponent(UITransform).contentSize.height - 200;
        const x = Math.round(Math.random() * width) - width / 2;
        const y = Math.round(Math.random() * height) - height / 2;
        return v3(x, y, 0);
    }
}
