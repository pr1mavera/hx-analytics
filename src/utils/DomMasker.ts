import { customCanvas } from './CustomCanvas';
import { Point } from './Point';

export class DomMasker implements DomMasker {
    private static instance: DomMasker;
    static w: number = window.innerWidth;
    static h: number = window.innerHeight;
    // _active: boolean;
    // 预设埋点
    points: Point[];
    // 当前圈选埋点
    activePoint: Point;

    // 主绘制canvas
    canvas: HTMLCanvasElement;
    // 缓存canvas
    tempCanvas: HTMLCanvasElement;

    public static getInstance(points: PointBase[] = []) {
        if (!DomMasker.instance) {
            DomMasker.instance = new DomMasker(points);
        }
        return DomMasker.instance;
    }
    private constructor(points: PointBase[]) {
        // points: [{ pid:'span.corner.top!document.querySelector()!sysId!pageId' }]

        // 初始化 主绘制canvas / 缓存canvas
        this.canvas = customCanvas(DomMasker.w, DomMasker.h);
        this.tempCanvas = customCanvas(DomMasker.w, DomMasker.h, 'rgba(200, 100, 50, 0.6)');

        // 插入页面根节点
        document.body.appendChild(this.canvas);
    }
    // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 注意：此API不会造成页面 主绘制canvas 的绘制
    // 幂等操作
    preset(points: PointBase[]) {
        console.log('this.tempCanvas：', this);
        this.tempCanvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
        this.points = points.map((p: PointBase) => new Point(p));

        const ctx = this.tempCanvas.getContext('2d');
        // 绘制预设埋点蒙版，保存在内存中
        this.points.forEach((point: Point) => {
            this.render(ctx, point);
        });
    }
    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
    }
    reset() {
        this.clear();
        if (this.points.length) {
            // 将缓存信息当做背景绘制到 主绘制canvas
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.tempCanvas, 0, 0);
        }
    }
    render(ctx: CanvasRenderingContext2D, point: Point) {
        const { tag, rect: [x, y, width, height] } = point;
        ctx.fillRect(x, y, width, height);
        ctx.fillText(tag, x, y);
        // ctx.save();
        // ctx.strokeStyle = '#fff';
        // ctx.lineWidth = 1;
        // ctx.strokeText(tag, x, y);
        // ctx.restore();
    }
}