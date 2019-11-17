export const customCanvas: (width: number, height: number, color?: string) => HTMLCanvasElement
    = (width, height, color = 'rgba(77, 131, 202, 0.5)') => {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = '18px serif';
        ctx.textBaseline = 'ideographic';

        return canvas;
    };