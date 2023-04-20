declare enum Layer_event_type {
    click = 0,
    touchstart = 1,
    touchmove = 2,
    touchend = 3
}
interface Layer_elem_baseOptions {
    x?: number;
    y?: number;
}
interface Layer_elem_textOptions extends Layer_elem_baseOptions {
    ifStroke?: boolean;
    font?: string;
    maxWidth?: number;
    maxHeight?: number;
}
interface Layer_elem_imgOptions extends ImageBitmapOptions, Layer_elem_baseOptions {
}
interface Layer_elem_lineOptions {
    style?: string;
    lineWidth?: number;
}
interface Layer_elem_rectOptions extends Layer_elem_lineOptions {
    ifStroke?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    lineJoin?: string;
    strokeStyle?: string;
}
interface Layer_elemOptions extends Layer_elem_imgOptions, Layer_elem_textOptions, Layer_elem_lineOptions, Layer_elem_rectOptions {
    name?: string;
    obj?: any;
}
interface Slice {
    dx: number;
    dy: number;
    sx: number;
    sy: number;
    w: number;
    h: number;
}
declare type Layer_elem_img = CanvasImageSource;
declare type Layer_elem_type = Layer_elem_img | Layer_elem_rect;
declare class Layer_elem_line {
    x: number;
    y: number;
    ex: number;
    ey: number;
    constructor(x: number, y: number, ex: number, ey: number);
}
declare class Layer_elem_rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
}
declare class Layer_elem {
    z_index: number;
    elemt: Layer_elem_type;
    options: Layer_elemOptions;
    x: number;
    y: number;
    angle: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    onclick: ((event?: Layer_Event) => any);
    ontouchstart: ((event?: Layer_Event) => any);
    ontouchmove: ((event?: Layer_Event) => any);
    ontouchend: ((event?: Layer_Event) => any);
    constructor(elemt: Layer_elem_type, z_index?: number, ops?: Layer_elemOptions);
    reset(): void;
}
declare class Layers {
    elemts: Layer_elem[];
    constructor();
    add_element(elemt: Layer_elem): number;
    delete_element(index: number): Layer_elem | undefined;
    clear_element(): void;
}
interface Pos {
    x: number;
    y: number;
    width: number;
    height: number;
}
declare class Layer_elem_slice {
    slice: Pos;
    elemt: Layer_elem;
    constructor(elemt: Layer_elem, slice: Pos);
}
declare enum UserAgent {
    mobile = 0,
    pc = 1
}
interface Layer_Event {
    x: number;
    y: number;
    elemt: Layer_elem;
    pos: Pos;
}
interface Layer_options {
    movable?: boolean;
    autoActEvent?: boolean;
}
declare class Layer {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    layer: Layers;
    z_slice: {
        pos: Pos;
        z_index: number;
    }[];
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    agent: UserAgent;
    startTouch: boolean;
    lastTouchX: number;
    lastTouchY: number;
    lastTouchTime: number;
    options: Layer_options;
    data?: any;
    constructor(canvas: HTMLCanvasElement, width?: number | undefined, height?: number | undefined, options?: Layer_options);
    getXY(event: MouseEvent | TouchEvent): {
        x: number;
        y: number;
    };
    eventstart(event: MouseEvent | TouchEvent): void;
    move_canvas(x: number, y: number): void;
    eventmove(event: MouseEvent | TouchEvent): void;
    eventend(event: MouseEvent | TouchEvent): void;
    get_index(z_index: number): number | undefined;
    get_slice(elemt: Layer_elem_slice): Slice;
    draw_img_slice(elemt: Layer_elem_slice): void;
    draw_line_slice(elemt: Layer_elem_slice): void;
    draw_text_slice(elemt: Layer_elem_slice): void;
    draw_rect_slice(elemt: Layer_elem_slice): void;
    draw_img(elemt: Layer_elem): void;
    draw_line(elemt: Layer_elem): void;
    draw_text(elemt: Layer_elem): void;
    draw_rect(elemt: Layer_elem): void;
    draw_img_rotate(elemt: Layer_elem): void;
    draw_rect_rotate(elemt: Layer_elem): void;
    draw(elemt: Layer_elem): void;
    draw_slice(elemt: Layer_elem_slice): void;
    get_pos_in(e: Layer_elem, x: number, y: number, w: number, h: number): Pos | undefined;
    get_elemts_in(x: number, y: number, w: number, h: number, index: number): Layer_elem_slice[];
    get_elemts_up(x: number, y: number, w: number, h: number, index: number): Layer_elem_slice[];
    print_canvas(): void;
    print_element_in_canvas(elemt: Layer_elem): Promise<void>;
    add_element_in_canvas(elemt: Layer_elem): Promise<void>;
    add_slice_element_in_canvas(elemt: Layer_elem_slice): Promise<void>;
    resize_max(): void;
    delete_element_in_canvas(index: number): Promise<void>;
    add_element(elemt: Layer_elem): Promise<number>;
    add_slice_element(elemt: Layer_elem_slice): Promise<number>;
    delete_element(z_index: number): Promise<Layer_elem>;
    move_to(x: number, y: number, z_index: number): Promise<boolean>;
    add_event(type: Layer_event_type, func: (event?: Layer_Event) => any, z_index: number): boolean;
    clear_element_canvas(): Promise<void>;
    clear_element(): Promise<void>;
    print_element(): Promise<void>;
}
declare class Page {
    layers: {
        layer: Layer;
        onCreate?: (l: Layer) => Promise<any>;
        onShow?: (l: Layer) => Promise<any>;
        onHide?: (l: Layer) => Promise<any>;
        onDestory?: (l: Layer) => Promise<any>;
        onLoad?: (l: Layer) => Promise<any>;
    }[];
    layer_index: number;
    load_layer_index: number;
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, width?: number | undefined, height?: number | undefined);
    now(): number;
    page(index: number): {
        layer: Layer;
        onCreate?: (l: Layer) => Promise<any>;
        onShow?: (l: Layer) => Promise<any>;
        onHide?: (l: Layer) => Promise<any>;
        onDestory?: (l: Layer) => Promise<any>;
        onLoad?: (l: Layer) => Promise<any>;
    };
    rotate_in_page(index: number, angle: number, z_index: number): Promise<boolean>;
    move_to_in_page(index: number, x: number, y: number, z_index: number): Promise<boolean>;
    slice_move_to_in_page(index: number, x: number, y: number, slice: Pos, z_index: number): Promise<boolean>;
    add_element_in_page(index: number, elemt: Layer_elem): Promise<number>;
    add_slice_element_in_page(index: number, elemt: Layer_elem_slice): Promise<number>;
    add_event_in_page(index: number, type: Layer_event_type, func: (event?: Layer_Event) => any, z_index: number): Promise<boolean>;
    delete_element_in_page(index: number, z_index: number): Promise<Layer_elem>;
    print_page(): Promise<void>;
    add_page(layer?: Layer | undefined, onCreate?: (l: Layer) => Promise<any>, onShow?: (l: Layer) => Promise<any>, onHide?: (l: Layer) => Promise<any>, onDestory?: (l: Layer) => Promise<any>, onLoad?: (l: Layer) => Promise<any>): number;
    activate_page(index: number): Promise<void>;
    deep_swap_page(index: number): Promise<void>;
    swap_page(index: number): Promise<void>;
    set_load_page(index: number): number;
    refresh(): Promise<void>;
    swap_page_with_load_page(index: number): Promise<void>;
    deep_swap_page_with_load_page(index: number): Promise<void>;
    delete_page(index: number): Promise<{
        layer: Layer;
        onCreate?: (l: Layer) => Promise<any>;
        onShow?: (l: Layer) => Promise<any>;
        onHide?: (l: Layer) => Promise<any>;
        onDestory?: (l: Layer) => Promise<any>;
        onLoad?: (l: Layer) => Promise<any>;
    }>;
    len_page(): number;
}
