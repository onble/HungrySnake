import { _decorator, CCFloat, CCInteger, Component, instantiate, math, Node, Prefab, UITransform, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Head")
export class Head extends Component {
    //#region 预制体引用

    @property(Prefab)
    public bodyPrefab: Prefab = null;

    @property(Prefab)
    public foodPrefab: Prefab = null;

    //#endregion 预制体引用

    //#region 变量

    /** 蛇身体数组(包括蛇头) */
    @property(Array(Node))
    public bodyArray: Node[] = [];

    /** 初始蛇身数量 */
    @property(CCInteger)
    bodyNum: number = 2;

    /** 蛇身之间的距离 */
    @property(CCFloat)
    bodyDistance: number = 50;

    /** 蛇移动速度 */
    speed: number = 200;

    //#region 变量

    //#region 生命周期
    protected onLoad(): void {
        this.bodyArray.push(this.node);
        this.node.setPosition(this.randomPos());
        for (let i = 1; i <= this.bodyNum; i++) {
            this.getNowBody();
        }
    }

    start() {
        this.node.parent.addChild(instantiate(this.foodPrefab));
    }

    update(deltaTime: number) {}
    //#endregion 生命周期

    getNowBody() {
        const newBody = instantiate(this.bodyPrefab);
        if (this.bodyArray.length === 1) {
            const direction = this.node.position.clone().normalize();
            newBody.setPosition(this.node.position.clone().subtract(direction.multiplyScalar(this.bodyDistance)));
        } else {
            const lastBody = this.bodyArray[this.bodyArray.length - 1];
            const lastBoBody = this.bodyArray[this.bodyArray.length - 2];
            const direction = lastBoBody.position.clone().subtract(lastBody.position).normalize();
            newBody.setPosition(lastBody.position.clone().subtract(direction.multiplyScalar(this.bodyDistance)));
        }
        this.node.parent.addChild(newBody);
        this.bodyArray.push(newBody);
    }
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
