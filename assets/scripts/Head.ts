import {
    _decorator,
    CCFloat,
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    director,
    instantiate,
    Label,
    math,
    Node,
    Prefab,
    RichText,
    UITransform,
    v2,
    v3,
    Vec3,
} from "cc";
import { Joystick } from "./Joystick";
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

    /** 蛇头的方向 */
    @property(Vec3)
    snakeDir: Vec3; // 蛇头的方向

    /** 分数 */
    @property(Number)
    Score: number = 0;

    /** 保存上一帧的移动方向 */
    previousMoveDir: Vec3;

    //#endregion 变量

    //#region UI

    @property(RichText)
    public txt_score: RichText = null;

    @property(Node)
    public startPanel: Node = null;

    @property(Node)
    public gameOverPanel: Node = null;

    @property(Node)
    public joystick: Node = null;

    //#endregion UI

    //#region 生命周期
    protected onLoad(): void {
        this.bodyArray.push(this.node);
        this.node.setPosition(this.randomPos());

        this.rotateHead(new math.Vec2(this.node.position.x, this.node.position.y));

        this.previousMoveDir = this.node.position.clone().normalize();
        for (let i = 1; i <= this.bodyNum; i++) {
            this.getNewBody();
        }
    }

    start() {
        this.schedule(function () {
            this.moveBody();
        }, 0.2);
        this.node.parent.addChild(instantiate(this.foodPrefab));
        const collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.beginContactHandle, this);
    }

    update(deltaTime: number) {
        this.snakeDir = this.joystick.getComponent(Joystick).dir.normalize();
        if (this.snakeDir.length() === 0) {
            this.snakeDir = this.previousMoveDir.clone().normalize();
        } else {
            this.node.angle = this.joystick.getComponent(Joystick).calculateAngle() - 90;
            this.previousMoveDir = this.snakeDir;
        }
        const newPos = this.node.position.clone().add(this.snakeDir.clone().multiplyScalar(this.speed * deltaTime));

        this.node.setPosition(newPos);
    }
    //#endregion 生命周期

    moveBody() {
        const headPos = this.node.position; // 保存蛇头移动前的位置
        for (let i = this.bodyArray.length - 2; i >= 0; i--) {
            // 从后往前开始遍历移动蛇身
            this.bodyArray[i + 1].position = this.bodyArray[i].position; // 每一个蛇身都移动到它前面一个节点的位置
        }
        this.bodyArray[1].position = headPos;
    }

    rotateHead(headPos: math.Vec2) {
        const angle = (v2(1, 0).signAngle(headPos) * 180) / Math.PI;
        this.node.angle = angle - 90;
    }
    getNewBody() {
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
        // 将实例化的新蛇身放入canvas画布
        this.node.parent.addChild(newBody);
        // 将新蛇身放入数组
        this.bodyArray.push(newBody);
        this.changeZIndex();
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
    changeZIndex() {
        const lastIndex = this.node.parent.children.length - 1;
        for (let i = 0; i < this.bodyArray.length; i++) {
            this.bodyArray[i].setSiblingIndex(lastIndex - i);
        }
    }
    //#region 事件监听

    startGame() {
        if (director.isPaused()) {
            director.resume();
        }
        this.startPanel.active = false;
    }
    restartGame() {
        director.resume();
        director.loadScene("scene1");
    }
    private beginContactHandle(selfCollider: Collider2D, otherCollider: Collider2D): void {
        // 只在两个碰撞体开始接触时被调用一次
        if (otherCollider.group === 4) {
            otherCollider.node.removeFromParent();
            this.Score++;
            this.txt_score.string = `${this.Score}`;
            // 产生食物
            const newFood = instantiate(this.foodPrefab);
            this.node.parent.addChild(newFood);
            // 更新身体
            this.getNewBody();
        }
        if (otherCollider.group === 8) {
            this.gameOverPanel.active = true;
            this.gameOverPanel.getChildByName("Txt_Score").getComponent(Label).string = `得分: ${this.Score}`;
            director.pause();
        }
    }
    //#endregion 事件监听
}
