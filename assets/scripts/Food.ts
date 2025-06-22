import { _decorator, Color, Component, math, Node, Sprite, UITransform, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Food")
export class Food extends Component {
    start() {
        this.node.getComponent(Sprite).color = this.randomColor();
        this.node.setPosition(this.randomPos());
    }

    update(deltaTime: number) {}

    randomColor(): Color {
        const red = Math.round(Math.random() * 255);
        const green = Math.round(Math.random() * 255);
        const blue = Math.round(Math.random() * 255);
        return new Color(red, green, blue);
    }

    randomPos(): math.Vec3 {
        const width = this.node.parent.getComponent(UITransform).contentSize.width - 200;
        const height = this.node.parent.getComponent(UITransform).contentSize.height - 200;
        const x = Math.round(Math.random() * width) - width / 2;
        const y = Math.round(Math.random() * height) - height / 2;
        return v3(x, y, 0);
    }
}
