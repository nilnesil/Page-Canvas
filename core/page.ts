
enum Layer_event_type{
    click,
    touchstart,
    touchmove,
    touchend
}

interface Layer_elem_baseOptions{
    x?:number;
    y?:number;
}

interface Layer_elem_textOptions extends Layer_elem_baseOptions{
    ifStroke?:boolean;
    font?:string;
    maxWidth?:number;
    maxHeight?:number;
}

interface Layer_elem_imgOptions extends ImageBitmapOptions,Layer_elem_baseOptions{
}

interface Layer_elem_lineOptions{
    style?:string;
    lineWidth ?:number;
}
interface Layer_elem_rectOptions extends Layer_elem_lineOptions{
    ifStroke?:boolean;
    shadowColor?:string;
    shadowBlur?:number;
    lineJoin ?:string;
    strokeStyle?:string;
}


interface Layer_elemOptions extends Layer_elem_imgOptions,Layer_elem_textOptions,Layer_elem_lineOptions,Layer_elem_rectOptions{
    name?:string,
    obj?//extension
}

interface Slice{
    dx:number;
    dy:number;
    sx:number;
    sy:number;
    w:number;
    h:number;
}

type  Layer_elem_img = CanvasImageSource;

type Layer_elem_type = Layer_elem_img/*图片*//*|string文字*/|Layer_elem_rect/*正方形*//*|Layer_elem_line线*/;

class Layer_elem_line{
    x:number;
    y:number;
    ex:number;
    ey:number;
    constructor(x:number,y:number,ex:number,ey:number){
        this.x = x;
        this.y = y;
        this.ex = ex;
        this.ey = ey;
    }
}
class Layer_elem_rect{
    x:number;
    y:number;
    width:number;
    height:number;
    constructor(x:number,y:number,width:number,height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Layer_elem{
    z_index:number;
    elemt:Layer_elem_type;
    options:Layer_elemOptions;

    x:number;
    y:number;
    angle:number = 0;//弧度
    width:number;
    height:number;
    maxWidth:number;
    maxHeight:number;

    onclick:((event?:Layer_Event)=>any);
    ontouchstart:((event?:Layer_Event)=>any);
    ontouchmove:((event?:Layer_Event)=>any);
    ontouchend:((event?:Layer_Event)=>any);

    constructor(elemt:Layer_elem_type,z_index?:number,ops?:Layer_elemOptions){
        let deOps:Layer_elemOptions = {
            x:50,
            y:50,
            ifStroke:false,
            font:'25px serif',
            maxWidth:200,
            maxHeight:20,
            style:'#1F1E33',
            shadowBlur:0,
            shadowColor:'#1F1E33',
            lineJoin:'bevel',
            strokeStyle:'#1F1E33',
            lineWidth:1,
        };

        if(ops === undefined)ops = deOps;
        if(ops.x == undefined) ops.x = deOps.x;
        if(ops.y == undefined) ops.y = deOps.y;
        if(z_index == undefined)z_index = -1;

        this.options = ops;
        this.elemt = elemt;
        if(ops.x != undefined) this.x = ops.x<0?0:ops.x;
        if(ops.y != undefined) this.y = ops.y<0?0:ops.y;
        this.z_index = z_index;

        if(this.elemt instanceof ImageBitmap){
            this.width = this.elemt.width;
            this.height = this.elemt.height;
            if(ops.x != undefined)this.maxWidth = this.elemt.width + ops.x;
            if (ops.y != undefined)this.maxHeight = this.elemt.height + ops.y;
        }else if(this.elemt instanceof Layer_elem_line){
            if(ops.style == undefined) ops.style = deOps.style;
            if(ops.lineWidth == undefined) ops.lineWidth = deOps.lineWidth;
            if(ops.maxWidth == undefined) ops.maxWidth = deOps.maxWidth;
            if(ops.maxHeight == undefined) ops.maxHeight = deOps.maxHeight;
            
            if(this.elemt.x>this.elemt.ex){
                let t = this.elemt.ex;
                this.elemt.ex = this.elemt.x;
                this.elemt.x = t;
            }
            if(this.elemt.y>this.elemt.ey){
                let t = this.elemt.y;
                this.elemt.ey = this.elemt.y;
                this.elemt.y = t;
            }

            this.x = this.elemt.x;
            this.y = this.elemt.y
            this.width = this.elemt.ex - this.elemt.x;
            this.height = this.elemt.ey - this.elemt.y;
            this.maxWidth = this.elemt.ex;
            this.maxHeight = this.elemt.ey;

            this.options.style = ops.style;
            this.options.lineWidth = ops.lineWidth;
        }else if(typeof this.elemt == "string"){
            if(ops.ifStroke == undefined) ops.ifStroke = deOps.ifStroke;
            if(ops.font == undefined) ops.font = deOps.font;
            if(ops.style == undefined) ops.style = deOps.style;
            if(ops.maxWidth == undefined) ops.maxWidth = deOps.maxWidth;
            if(ops.maxHeight == undefined) ops.maxHeight = deOps.maxHeight;

            if (ops.maxWidth != undefined)this.width = ops.maxWidth;
            if (ops.maxHeight != undefined)this.height = ops.maxHeight;
            if (ops.maxWidth != undefined&&ops.x != undefined)this.maxWidth = ops.maxWidth + ops.x;
            if (ops.maxHeight != undefined&&ops.y != undefined)this.maxHeight = ops.maxHeight + ops.y;

            this.options.ifStroke = ops.ifStroke;
            this.options.font = ops.font;
            this.options.style = ops.style;
            this.options.maxWidth = ops.maxWidth;
            this.options.maxHeight = ops.maxHeight;
        }else if(this.elemt instanceof Layer_elem_rect){
            if(ops.ifStroke == undefined) ops.ifStroke = deOps.ifStroke;
            if(ops.style == undefined) ops.style = deOps.style;
            if(ops.shadowColor == undefined) ops.shadowColor = deOps.shadowColor;
            if(ops.shadowBlur == undefined) ops.shadowBlur = deOps.shadowBlur;
            if(ops.lineJoin == undefined) ops.lineJoin = deOps.lineJoin;
            if(ops.lineWidth == undefined) ops.lineWidth = deOps.lineWidth;

            this.x = this.elemt.x;
            this.y = this.elemt.y;
            this.width = this.elemt.width;
            this.height = this.elemt.height;
            this.maxWidth = this.elemt.width + this.x;
            this.maxHeight = this.elemt.height + this.y;

            this.options.ifStroke = ops.ifStroke;
            this.options.style = ops.style;
            this.options.shadowColor = ops.shadowColor;
            this.options.shadowBlur = ops.shadowBlur;
            this.options.lineJoin = ops.lineJoin;
            this.options.lineWidth = ops.lineWidth;
        }
    }
    reset(){

        if(this.angle != 0){
            let djx = Math.sqrt((this.width*this.width)+(this.height*this.height)),
            x = this.x<djx?0:this.x - djx,
            y = this.y<djx?0:this.y - djx,
            width = djx*2,
            height = djx*2;
            this.maxWidth = x + width;
            this.maxHeight = y + height;
        }else{
            this.maxWidth = this.x + this.width;
            this.maxHeight = this.y + this.height;
        }
        // only z_index can't resets
    }
}

class Layers{
    elemts:Layer_elem[] = [];
    constructor(){
        this.elemts.push(new Layer_elem(new Layer_elem_rect(0,0,20,20),-1,{style:"#FFFFFF"}));
    }

    add_element(elemt:Layer_elem){
        if(elemt.maxHeight>this.elemts[0].height){
            let old = this.elemts.shift();
            if(old != undefined){
                old.height = elemt.maxHeight;
                this.elemts.unshift(old);
            }
        }
        if(elemt.maxWidth>this.elemts[0].width){
            let old = this.elemts.shift();
            if(old != undefined){
                old.width = elemt.maxWidth;
                this.elemts.unshift(old);
            }
        }

        if(this.elemts.length == 0){
            if(elemt.z_index<0) elemt.z_index = 0
            this.elemts.push(elemt);
        }
        else if(elemt.z_index < 0){
            elemt.z_index = this.elemts[this.elemts.length-1].z_index+1;
            this.elemts.push(elemt);
        }
        else{
            let len = this.elemts.length,i:number;
            for(i=0;i<len;i++){
                if(this.elemts[i].z_index>elemt.z_index){
                    this.elemts.splice(i,0,elemt);
                    len++;
                    if(i != 0) for(let j=i;j<len;j++)
                        if(this.elemts[j-1].z_index==this.elemts[j].z_index)this.elemts[j].z_index+=1;
                    break;
                }
            }
            if(i==len)this.elemts.push(elemt);
        }
        return elemt.z_index;
    }
    delete_element(index:number):Layer_elem|undefined{
        if(index!=-1) return this.elemts.splice(index,1)[0];
        return undefined;
    }
    clear_element(){
        for(let i = 1;i<this.elemts.length;i++) delete this.elemts[i];
        this.elemts.length = 1;
    }
}

interface Pos{
    x:number;
    y:number;
    width:number;
    height:number;
}
class Layer_elem_slice{
    slice:Pos;
    elemt:Layer_elem;
    constructor(elemt:Layer_elem,slice:Pos){
        this.elemt = elemt;
        this.slice = slice;
    }
}

enum UserAgent{
    mobile,
    pc
}

interface Layer_Event{
    x:number;
    y:number;
    elemt:Layer_elem;
    pos:Pos;
}

interface Layer_options{
    movable?:boolean;
    autoActEvent?:boolean;
}

class Layer{
    cvs:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    layer:Layers = new Layers();
    z_slice:{pos:Pos,z_index:number}[] = [];
    x:number = 0;
    y:number = 0;
    maxWidth:number;
    maxHeight:number;
    agent:UserAgent;

    startTouch:boolean = false;
    lastTouchX:number;
    lastTouchY:number;
    lastTouchTime:number;

    options:Layer_options;

    data?:any; // extension

    constructor(canvas:HTMLCanvasElement,width?:number|undefined,height?:number|undefined,options?:Layer_options){
        var deOps:Layer_options = {
            movable:false,
            autoActEvent:true
        }
        
        if(options == undefined)options = deOps;
        if(options.movable == undefined)options.movable = deOps.movable;
        if(options.autoActEvent == undefined)options.autoActEvent = deOps.autoActEvent;

        this.options = options;
        this.cvs = canvas;
        this.cvs.width = width == undefined || width<0?100:width;
        this.cvs.height = height == undefined || height<0?100:height;
        this.maxWidth = this.cvs.width;
        this.maxHeight = this.cvs.height;
        let ctx = this.cvs.getContext('2d');
        if(ctx !==null)this.ctx = ctx;


        let sUserAgent = navigator.userAgent.toLowerCase();
        if(/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)){
            this.agent = UserAgent.mobile;
            document.body.style.overflow='hidden';
            this.cvs.addEventListener('touchstart',(e)=>this.eventstart(e));
            this.cvs.addEventListener('touchmove',(e)=>this.eventmove(e));
            this.cvs.addEventListener('touchend',(e)=>this.eventend(e));

        }
        else {
            this.agent = UserAgent.pc; 
            this.cvs.addEventListener('mousedown',(e)=>this.eventstart(e));
            this.cvs.addEventListener('mousemove',(e)=>this.eventmove(e));
            this.cvs.addEventListener('mouseup',(e)=>this.eventend(e));
        }

    }
    getXY(event:MouseEvent|TouchEvent){
        let x: number,y: number;
        try{

            if(event instanceof TouchEvent){
                x = event.touches[0].pageX;
                y = event.touches[0].pageY;
            }else{
                x = event.pageX;
                y = event.pageY;
            }
            x+=this.x - this.cvs.offsetLeft;
            y+=this.y - this.cvs.offsetTop;
        }catch(e){
            x = this.lastTouchX;
            y = this.lastTouchY;
        }
        x = x;
        y = y;
        x = x<0?0:x;
        y = y<0?0:y;
        return {x:x,y:y};
    }
    eventstart(event:MouseEvent|TouchEvent){
        if(this.options.autoActEvent == false) return;

        let xy = this.getXY(event);

        this.startTouch = true;
        this.lastTouchX = xy.x;
        this.lastTouchY = xy.y;
        this.lastTouchTime = (new Date()).getTime();

        let elemts = this.get_elemts_in(xy.x-10,xy.y-10,20,20,0);
        for(let i = elemts.length - 1;i >= 0;i--){
            if(elemts[i].elemt.ontouchstart != undefined){
                let e:Layer_Event = {x:xy.x,y:xy.y,elemt:elemts[i].elemt,pos:elemts[i].slice};
                elemts[i].elemt.ontouchstart(e);
                break;
            }
        }
        
    }
    move_canvas(x:number,y:number){
        if(this.options.autoActEvent == false) return;
        if(!this.startTouch) return;

        let remainX = this.maxWidth - this.cvs.width -this.x,
        remainY = this.maxHeight - this.cvs.height -this.y,
        deltaX = x - this.lastTouchX,
        deltaY = y - this.lastTouchY;

        
        if(deltaX>remainX) deltaX = remainX;
        if(deltaY>remainY) deltaY = remainY;
        this.x = this.x - deltaX<=0?0:this.x-deltaX;
        this.y = this.y - deltaY<=0?0:this.y-deltaY;
        if(this.x + this.cvs.width > this.maxWidth) this.x = this.maxWidth - this.cvs.width-1;
        if(this.y + this.cvs.height > this.maxHeight) this.y = this.maxHeight - this.cvs.height-1;

        this.lastTouchX = x;
        this.lastTouchY = y;

        this.print_canvas();

    }
    eventmove(event:MouseEvent|TouchEvent){
        if(this.options.autoActEvent == false) return;

        let xy = this.getXY(event);

        if(this.options.movable) this.move_canvas(xy.x,xy.y);
        
        let elemts = this.get_elemts_in(xy.x-10,xy.y-10,20,20,0);
        for(let i = elemts.length - 1;i >= 0;i--)
            if(elemts[i].elemt.ontouchmove != undefined){
                let e:Layer_Event|undefined = {x:xy.x,y:xy.y,elemt:elemts[i].elemt,pos:elemts[i].slice};
                elemts[i].elemt.ontouchmove(e);
                break;
            }

        
    }
    eventend(event:MouseEvent|TouchEvent){
        if(this.options.autoActEvent == false) return;

        let xy = this.getXY(event);
        let now = (new Date()).getTime();
        let elemts = this.get_elemts_in(xy.x-10,xy.y-10,20,20,0);

        if(now-this.lastTouchTime<=200&&Math.abs(this.lastTouchX - xy.x)<=5&&Math.abs(this.lastTouchY - xy.y)<=5)
            for(let i = elemts.length - 1;i >= 0;i--){
                if(elemts[i].elemt.onclick != undefined){
                    let e:Layer_Event = {x:xy.x,y:xy.y,elemt:elemts[i].elemt,pos:elemts[i].slice};
                    elemts[i].elemt.onclick(e);
                    break;
                }
            }
        for(let i = elemts.length - 1;i >= 0;i--)
            if(elemts[i].elemt.ontouchend != undefined){
                let e:Layer_Event = {x:xy.x,y:xy.y,elemt:elemts[i].elemt,pos:elemts[i].slice};
                elemts[i].elemt.ontouchend(e)
                break;
            }

        this.startTouch = false;
    }
    get_index(z_index:number):number|undefined{
        let index = 0;
        for(;index<this.layer.elemts.length;index++) if(this.layer.elemts[index].z_index == z_index) break;
        if(index == this.layer.elemts.length)return undefined;
        return index
    }
    get_slice(elemt:Layer_elem_slice):Slice{
        let dx = elemt.elemt.x + elemt.slice.x - this.x,dy = elemt.elemt.y+elemt.slice.y - this.y,
        sx = elemt.slice.x,sy = elemt.slice.y,
        w = elemt.slice.width,h = elemt.slice.height;
        if(dx<0){
            sx -= dx;
            if(sx >= w){
                w = 0;
                sx = 0;    
            }
            w += dx;
            dx = 0;
        }
        if(dy<0){
            sy -= dy;
            if(sy >= h){
                h = 0;    
                sy = 0;
            }
            h += dy;
            dy = 0;
        }
        return {sx:sx,sy:sy,w:w,h:h,dx:dx,dy:dy}; 
    }
    draw_img_slice(elemt:Layer_elem_slice){
        if(elemt.elemt.elemt instanceof ImageBitmap) {
            let s = this.get_slice(elemt);
            this.ctx.drawImage(elemt.elemt.elemt,
            s.sx,s.sy,
            s.w,s.h,
            s.dx,s.dy,
            s.w,s.h);
        }
    }
    draw_line_slice(elemt:Layer_elem_slice){
        if(elemt.elemt.elemt instanceof Layer_elem_line){
            
            var 
            lineWidth = this.ctx.lineWidth,
            style = this.ctx.fillStyle;
            
            let s = this.get_slice(elemt);
            if(elemt.elemt.options.lineWidth != undefined) this.ctx.lineWidth = elemt.elemt.options.lineWidth;
            if(elemt.elemt.options.style != undefined) this.ctx.fillStyle = elemt.elemt.options.style;
            this.ctx.beginPath();
            this.ctx.moveTo(s.dx,s.dy);
            this.ctx.lineTo(s.dx + s.w ,s.dy +s.h);
            this.ctx.stroke();
            
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = style;
        }
    }
    draw_text_slice(elemt:Layer_elem_slice){
        if(typeof elemt.elemt.elemt == "string"){
            
            var 
            font = this.ctx.font,
            style = this.ctx.fillStyle,
            textBaseline = this.ctx.textBaseline;
            
            let s = this.get_slice(elemt);
            if(elemt.elemt.options.font != undefined) this.ctx.font = elemt.elemt.options.font;
            if(elemt.elemt.options.style != undefined) this.ctx.fillStyle = elemt.elemt.options.style;
            this.ctx.textBaseline = 'top';
            if(elemt.elemt.options.ifStroke) this.ctx.strokeText(elemt.elemt.elemt,s.dx,s.dy,s.w);
            else this.ctx.fillText(elemt.elemt.elemt,s.dx,s.dy,s.w);

            this.ctx.font = font;
            this.ctx.fillStyle = style;
            this.ctx.textBaseline = textBaseline;
        }
    }
    draw_rect_slice(elemt:Layer_elem_slice){
        if(elemt.elemt.elemt instanceof Layer_elem_rect){
            var 
            shadowColor = this.ctx.shadowColor,
            shadowBlur = this.ctx.shadowBlur,
            lineJoin = this.ctx.lineJoin,
            lineWidth = this.ctx.lineWidth,
            style = this.ctx.fillStyle;
            let s = this.get_slice(elemt);
            if(elemt.elemt.options.font != undefined) this.ctx.font = elemt.elemt.options.font;
            if(elemt.elemt.options.style != undefined) this.ctx.fillStyle = elemt.elemt.options.style;
            // unfinished
            if(elemt.elemt.options.ifStroke) this.ctx.strokeRect(s.dx,s.dy,s.w,s.h);
            else this.ctx.fillRect(s.dx,s.dy,s.w,s.h);

            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.lineJoin = lineJoin;
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = style;
        }
    }
    draw_img(elemt:Layer_elem){
        if(elemt.elemt instanceof ImageBitmap) {
            this.ctx.drawImage(elemt.elemt,elemt.x,elemt.y);
            
        }
        // if(elemt.elemt instanceof ImageBitmap) this.draw_img_slice(new Layer_elem_slice(elemt,{x:0,y:0,width:elemt.width,height:elemt.height}));
    }
    draw_line(elemt:Layer_elem){
        if(elemt.elemt instanceof Layer_elem_line) this.draw_line_slice(new Layer_elem_slice(elemt,{x:0,y:0,width:elemt.width,height:elemt.height +0}));
    }
    draw_text(elemt:Layer_elem){
        if(typeof elemt.elemt == "string"&&elemt.options.maxWidth&&elemt.options.maxHeight) this.draw_text_slice(new Layer_elem_slice(elemt,{x:0,y:0,width:elemt.options.maxWidth,height:elemt.options.maxHeight}));
    }
    draw_rect(elemt:Layer_elem){
        if(elemt.elemt instanceof Layer_elem_rect) this.draw_rect_slice(new Layer_elem_slice(elemt,{x:0,y:0,width:elemt.width,height:elemt.height}));
    }
    draw_img_rotate(elemt:Layer_elem){
        this.ctx.translate(elemt.width/2 + elemt.x,elemt.height/2 + elemt.y);
        this.ctx.rotate(elemt.angle);

        if(elemt.elemt instanceof ImageBitmap) {
            this.ctx.drawImage(elemt.elemt,-elemt.width/2,-elemt.height/2);
        }

        this.ctx.rotate(-elemt.angle);
        this.ctx.translate(-(elemt.width/2 + elemt.x),-(elemt.height/2 + elemt.y));
    }
    draw_rect_rotate(elemt:Layer_elem){
        this.ctx.translate(elemt.width/2 + elemt.x,elemt.height/2 + elemt.y);
        this.ctx.rotate(elemt.angle);

        
        if(elemt.elemt instanceof Layer_elem_rect){
            var 
            shadowColor = this.ctx.shadowColor,
            shadowBlur = this.ctx.shadowBlur,
            lineJoin = this.ctx.lineJoin,
            lineWidth = this.ctx.lineWidth,
            style = this.ctx.fillStyle;
            if(elemt.options.font != undefined) this.ctx.font = elemt.options.font;
            if(elemt.options.style != undefined) this.ctx.fillStyle = elemt.options.style;
            
            if(elemt.options.ifStroke) this.ctx.strokeRect(-elemt.width/2,-elemt.height/2,elemt.width,elemt.height);
            else this.ctx.fillRect(-elemt.width/2,-elemt.height/2,elemt.width,elemt.height);

            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.lineJoin = lineJoin;
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = style;
        }

        this.ctx.rotate(-elemt.angle);
        this.ctx.translate(-(elemt.width/2 + elemt.x),-(elemt.height/2 + elemt.y));
    }
    draw(elemt:Layer_elem){
        if(elemt.angle != 0){

            if(elemt.elemt instanceof ImageBitmap) this.draw_img_rotate(elemt);
            // else if(elemt.elemt instanceof Layer_elem_line) this.draw_line(elemt);
            // else if(typeof elemt.elemt == "string")  this.draw_text(elemt);
            else if(elemt.elemt instanceof Layer_elem_rect) this.draw_rect_rotate(elemt);
            
        }
        else{
            if(elemt.elemt instanceof ImageBitmap) this.draw_img(elemt);
            else if(elemt.elemt instanceof Layer_elem_line) this.draw_line(elemt);
            else if(typeof elemt.elemt == "string")  this.draw_text(elemt);
            else if(elemt.elemt instanceof Layer_elem_rect) this.draw_rect(elemt);
        }
    }
    draw_slice(elemt:Layer_elem_slice){
        if(elemt.elemt.elemt instanceof ImageBitmap) this.draw_img_slice(elemt);
        else if(elemt.elemt.elemt instanceof Layer_elem_line) this.draw_line_slice(elemt);
        else if(typeof elemt.elemt.elemt == "string")  this.draw_text_slice(elemt);
        else if(elemt.elemt.elemt instanceof Layer_elem_rect) this.draw_rect_slice(elemt);
    }
    get_pos_in(e:Layer_elem,x:number,y:number,w:number,h:number):Pos|undefined{
        let ret:Pos|undefined = undefined;
        let index = -1;
        for(let i =0;i<this.z_slice.length;i++)
            if(this.z_slice[i].z_index == e.z_index){
                index = i;
                break;
            }
        let t = index == -1?e:{
            x:e.x + this.z_slice[index].pos.x,
            y:e.y + this.z_slice[index].pos.y,
            width:this.z_slice[index].pos.width,
            height:this.z_slice[index].pos.height
        };
        let x1 = x>t.x?x:t.x, // max
        y1 = y>t.y?y:t.y,
        x2 = x+w>t.x+t.width?t.x+t.width:x+w, // min
        y2 = y+h>t.y+t.height?t.y+t.height:y+h;
        if(x1<x2&&y1<y2) ret = {x:x1-e.x,y:y1-e.y,width:x2-x1,height:y2-y1};
        return ret;
    }
    get_elemts_in(x:number,y:number,w:number,h:number,index:number):Layer_elem_slice[]{
        var elems:Layer_elem_slice[] = [];
        if(index == -1){
            for(let i = 0;i<this.layer.elemts.length;i++){
                let s:Pos|undefined = this.get_pos_in(this.layer.elemts[i],x,y,w,h);
                if(s != undefined) elems.push(new Layer_elem_slice(this.layer.elemts[i],s));
            }
        }
        else{
            for(let i = 0;i<index;i++){
                let s:Pos|undefined = this.get_pos_in(this.layer.elemts[i],x,y,w,h);
                if(s != undefined) elems.push(new Layer_elem_slice(this.layer.elemts[i],s));
            }
            for(let i = index + 1;i<this.layer.elemts.length;i++){
                let s:Pos|undefined = this.get_pos_in(this.layer.elemts[i],x,y,w,h);
                if(s != undefined) elems.push(new Layer_elem_slice(this.layer.elemts[i],s));
            }
        }
        return elems; 
    }
    get_elemts_up(x:number,y:number,w:number,h:number,index:number):Layer_elem_slice[]{
        var elems:Layer_elem_slice[] = [];
        if(index == -1){
            for(let i = 0;i<this.layer.elemts.length;i++){
                let s:Pos|undefined = this.get_pos_in(this.layer.elemts[i],x,y,w,h);
                if(s != undefined) elems.push(new Layer_elem_slice(this.layer.elemts[i],s));
            }
        }
        else{
            for(let i = index + 1;i<this.layer.elemts.length;i++){
                let s:Pos|undefined = this.get_pos_in(this.layer.elemts[i],x,y,w,h);
                if(s != undefined) elems.push(new Layer_elem_slice(this.layer.elemts[i],s));
            }
        }
        return elems; 
    }
    print_canvas(){
        Promise.all(
            this.get_elemts_in(
                this.x,
                this.y,
                this.cvs.width,
                this.cvs.height,-1)).then((e)=>{
            for(let i =0;i<e.length;i++){
                this.draw_slice(e[i]);
            }
        })
    }
    async print_element_in_canvas(elemt:Layer_elem){
        if(elemt.maxWidth>this.cvs.width+this.x||
            elemt.maxHeight>this.cvs.height+this.y){
                let s:Pos|undefined = this.get_pos_in(elemt,this.x,this.y,this.cvs.height,this.cvs.height);
                if(s != undefined) this.draw_slice(new Layer_elem_slice(elemt,s));
            }
        else this.draw(elemt);
    }
    async add_element_in_canvas(elemt:Layer_elem){
        let index = this.get_index(elemt.z_index);
        if(index == undefined)return;
        
        if(elemt.maxWidth>this.maxWidth) this.maxWidth = elemt.maxWidth;
        if(elemt.maxHeight>this.maxHeight) this.maxHeight = elemt.maxHeight;

        this.draw(elemt);
        this.get_elemts_up(elemt.x,elemt.y,elemt.width,elemt.height,index).forEach(async (v)=>{
            await this.print_element_in_canvas(v.elemt);
        });
    }
    async add_slice_element_in_canvas(elemt:Layer_elem_slice){
        let index = this.get_index(elemt.elemt.z_index);
        if(index == undefined)return;
        
        if(elemt.elemt.maxWidth>this.maxWidth) this.maxWidth = elemt.elemt.maxWidth;
        if(elemt.elemt.maxHeight>this.maxHeight) this.maxHeight = elemt.elemt.maxHeight;
        this.draw_slice(elemt);
        this.get_elemts_up(elemt.elemt.x,elemt.elemt.y,elemt.elemt.width,elemt.elemt.height,index).forEach((v)=>{
            this.print_element_in_canvas(v.elemt);
        });
        // for(;index<this.layer.elemts.length;index++){
        //     this.print_element_in_canvas(this.layer.elemts[index]);// wait to optimate,need to know the elemt in this area
        // }
    }
    resize_max(){
        this.maxHeight = this.layer.elemts[0].height;
        this.maxWidth = this.layer.elemts[0].width;

        this.layer.elemts.forEach((v)=>{
            if(this.maxHeight<v.maxHeight) this.maxHeight = v.maxHeight;
            if(this.maxWidth<v.maxWidth) this.maxWidth = v.maxWidth;
        })
    }
    async delete_element_in_canvas(index:number){
        var x,y,width,height;
        if(this.layer.elemts[index].angle == 0){
            x = this.layer.elemts[index].x;
            y = this.layer.elemts[index].y;
            width = this.layer.elemts[index].width;
            height = this.layer.elemts[index].height;
        }else{
            let djx = Math.sqrt((this.layer.elemts[index].width*this.layer.elemts[index].width)+(this.layer.elemts[index].height*this.layer.elemts[index].height))
            x = this.layer.elemts[index].x<djx?0:this.layer.elemts[index].x - djx;
            y = this.layer.elemts[index].y<djx?0:this.layer.elemts[index].y - djx;
            width = djx*2;
            height = djx*2;
        }
        const e = await Promise.all(
            this.get_elemts_in(x,y,width,height, index));
        for (let i = 0; i < e.length; i++) {
            this.draw_slice(e[i]);
        }
        this.resize_max();
    }
    
    public async add_element(elemt:Layer_elem){
        let z = this.layer.add_element(elemt);
        elemt.z_index = z;
        await this.add_element_in_canvas(elemt);
        return z;
    }
    public async add_slice_element(elemt:Layer_elem_slice){
        let z = this.layer.add_element(elemt.elemt);
        elemt.elemt.z_index = z;
        this.z_slice.push({pos:elemt.slice,z_index:z});
        await this.add_slice_element_in_canvas(elemt);
        return z;
    }
    public async delete_element(z_index:number){
        let index = this.get_index(z_index);
        if(z_index < 0 || index == undefined)return undefined;
        
        for(let i = 0;i<this.z_slice.length;i++) if(this.z_slice[i].z_index == z_index){
            this.z_slice.splice(i,1);
        }
        await this.delete_element_in_canvas(index);
        return this.layer.delete_element(index);
    }
    public async move_to(x:number,y:number,z_index:number){
        
        let e = await this.delete_element(z_index);
        if(e != undefined){
            e.x = x<0?0:x;
            e.y = y<0?0:y;
            e.reset();
            this.add_element(e);
            return true
        }
        return false;
    }
    public add_event(type:Layer_event_type,func:(event?:Layer_Event)=>any,z_index:number):boolean{
        let index = this.get_index(z_index);
        if(index == undefined) return false;
        
        switch(type){
            case Layer_event_type.click:this.layer.elemts[index].onclick = func;break;
            case Layer_event_type.touchstart:this.layer.elemts[index].ontouchstart = func;break;
            case Layer_event_type.touchmove:this.layer.elemts[index].ontouchmove = func;break;
            case Layer_event_type.touchend:this.layer.elemts[index].ontouchend = func;break;
            default:return false;
        }
        return true;
    }
    public async clear_element_canvas(){
        this.draw(this.layer.elemts[0]);
        this.resize_max();
    }
    public async clear_element(){
        this.clear_element_canvas();
        this.layer.clear_element();
        this.z_slice = [];
    }
    public async print_element(){
        for(let i = 0;i<this.layer.elemts.length;i++){
            let index = -1,e = this.layer.elemts[i];
            for(let j = 0;j<this.z_slice.length;j++){
                if(this.z_slice[j].z_index == e.z_index){
                    index = j;
                    break;
                }
            }
            if(index != -1) this.draw_slice(new Layer_elem_slice(e,this.z_slice[index].pos));
            else this.draw(e);
        }
    }
}

class Page{
    layers:{
        layer:Layer,
        onCreate?:(l:Layer)=>Promise<any>,
        onShow?: (l:Layer)=>Promise<any>,
        onHide?: (l:Layer)=>Promise<any>,
        onDestory?:(l:Layer)=>Promise<any>,
        onLoad?:(l:Layer)=>Promise<any>,
    }[] = [];
    layer_index:number = -1;
    load_layer_index:number = -1;
    cvs:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement,width?:number|undefined,height?:number|undefined){
        this.cvs = canvas;

        this.cvs.width = width == undefined || width<0?100:width;
        this.cvs.height = height == undefined || height<0?100:height;
        let ctx = this.cvs.getContext('2d');
        if(ctx != null) this.ctx = ctx;
    }

    public now(){
        return this.layer_index;
    }

    public page(index:number){
        if(index<0||index>=this.layers.length) return undefined;
        return this.layers[index];
    }
    public async rotate_in_page(index:number,angle:number/*弧度*/,z_index:number){
        let e = await this.delete_element_in_page(index,z_index);
        if(e != undefined){
            e.angle = angle;
            e.reset();
            await this.add_element_in_page(index,e);
            return true
        }
        return false;
    }
    public async move_to_in_page(index:number,x:number,y:number,z_index:number){
        let e = await this.delete_element_in_page(index,z_index);
        if(e != undefined){
            e.x = x<0?0:x;
            e.y = y<0?0:y;
            e.reset();
            await this.add_element_in_page(index,e);
            return true
        }
        return false;
    }

    public async slice_move_to_in_page(index:number,x:number,y:number,slice:Pos,z_index:number){
        let e = await this.delete_element_in_page(index,z_index);
        if(e != undefined){
            e.x = x+slice.x<0?0:x;
            e.y = y+slice.y<0?0:y;
            e.reset();
            await this.add_slice_element_in_page(index,new Layer_elem_slice(e,slice));
            return true
        }
        return false;
    }

    public async add_element_in_page(index:number,elemt:Layer_elem){
        if(index<0||index>=this.layers.length) return -1;
        let z = this.layers[index].layer.layer.add_element(elemt);
        elemt.z_index = z;
        
        if(this.layer_index == index) await this.layers[index].layer.add_element_in_canvas(elemt);
        
        return z;
    }

    public async add_slice_element_in_page(index:number,elemt:Layer_elem_slice){
        if(index<0||index>=this.layers.length) return -1;
        let z = this.layers[index].layer.layer.add_element(elemt.elemt);
        elemt.elemt.z_index = z;

        this.layers[index].layer.z_slice.push({pos:elemt.slice,z_index:z});
        if(this.layer_index == index) await this.layers[index].layer.add_slice_element_in_canvas(elemt);

        return z;
    }
    
    public async add_event_in_page(index:number,type:Layer_event_type,func:(event?:Layer_Event)=>any,z_index:number){
        if(index<0||index>=this.layers.length) return false;

        return this.layers[index].layer.add_event(type,func,z_index);
    }

    public async delete_element_in_page(index:number,z_index:number){
        if(index<0||index>=this.layers.length) return undefined;

        let lindex = this.layers[index].layer.get_index(z_index);
        if(z_index < 0 || lindex == undefined)return undefined;
        
        for(let i = 0;i<this.layers[index].layer.z_slice.length;i++) if(this.layers[index].layer.z_slice[i].z_index == z_index){
            this.layers[index].layer.z_slice.splice(i,1);
        }

        if(this.layer_index == index) await this.layers[index].layer.delete_element_in_canvas(lindex);
        return this.layers[index].layer.delete_element(z_index);
    }

    public async print_page(){
        if(this.layers[this.layer_index].onShow != undefined) await this.layers[this.layer_index].onShow(this.layers[this.layer_index].layer);
        await this.layers[this.layer_index].layer.print_element();
    }

    public add_page(
        layer?:Layer|undefined,
        onCreate?:(l:Layer)=>Promise<any>,
        onShow?: (l:Layer)=>Promise<any>,
        onHide?: (l:Layer)=>Promise<any>,
        onDestory?:(l:Layer)=>Promise<any>,
        onLoad?:(l:Layer)=>Promise<any>,
        ){
        if(layer == undefined) layer = new Layer(this.cvs,this.cvs.width,this.cvs.height);
        
        layer.options.autoActEvent = this.layers.length == 0?true:false;
        this.layers.push({layer:layer,onCreate:onCreate,onShow:onShow,onHide:onHide,onDestory:onDestory,onLoad:onLoad});
        
        (async ()=>{

            if(this.layers.length == 1){
                this.layer_index = 0;
                
                this.layers[this.layer_index].layer.options.autoActEvent = true;
                if(this.layers[this.layer_index].onCreate != undefined) await this.layers[this.layer_index].onCreate(this.layers[this.layer_index].layer);
                await this.print_page();
            }else{
                this.layers[this.layers.length-1].layer.options.autoActEvent = false;
                if(this.layers[this.layers.length-1].onCreate != undefined) await this.layers[this.layers.length-1].onCreate(this.layers[this.layers.length-1].layer);
            }
        })();
        
        return this.layers.length-1;
    }

    public async activate_page(index:number){
        if(index<0||index>=this.layers.length) return;

        this.layers[this.layer_index].layer.options.autoActEvent = false;
        this.layer_index = index;
        this.layers[this.layer_index].layer.options.autoActEvent = true;
        await this.print_page();
    }
    public async deep_swap_page(index:number){
        if(index<0||index>=this.layers.length||index == this.layer_index) return;

        if(this.layers[this.layer_index].onHide != undefined)await this.layers[this.layer_index].onHide(this.layers[this.layer_index].layer);
        await this.layers[this.layer_index].layer.clear_element();
        await this.activate_page(index);
    }

    public async swap_page(index:number){
        if(index<0||index>=this.layers.length||index == this.layer_index) return;
        if(this.layers[this.layer_index].onHide != undefined)await this.layers[this.layer_index].onHide(this.layers[this.layer_index].layer);
        await this.layers[this.layer_index].layer.clear_element_canvas();
        await this.activate_page(index);
    }

    public set_load_page(index:number){
        if(index<0||index>=this.layers.length) return -1;
        this.load_layer_index = index;
        return index;
    }
    public async refresh(){
        if(this.layer_index<0||this.layer_index>=this.layers.length) return;
        await this.swap_page(this.load_layer_index);
        if(this.layers[this.layer_index].onLoad != undefined)await this.layers[this.layer_index].onLoad(this.layers[this.layer_index].layer);
        await this.swap_page(this.layer_index);

    }
    public async swap_page_with_load_page(index:number){
        if(index<0||index>=this.layers.length||index == this.layer_index) return;
        if(index != this.load_layer_index){
            await this.swap_page(this.load_layer_index);
            if(this.layers[index].onLoad != undefined)await this.layers[index].onLoad(this.layers[index].layer);
        }
        await this.swap_page(index);
    }

    public async deep_swap_page_with_load_page(index:number){
        if(index<0||index>=this.layers.length||index == this.layer_index) return;
        let temp = this.layer_index;
        if(index != this.load_layer_index){
            await this.swap_page(this.load_layer_index);
            if(this.layers[index].onLoad != undefined) await this.layers[index].onLoad(this.layers[index].layer);
        }
        this.layer_index = temp;
        await this.deep_swap_page(index);
    }
    public async delete_page(index:number){
        if(index<0||index>=this.layers.length) return undefined;
        
        if(this.layers[index].onHide != undefined)await this.layers[index].onHide(this.layers[index].layer);
        if(this.layers[index].onDestory != undefined)await this.layers[index].onDestory(this.layers[index].layer)
        await this.layers[index].layer.clear_element();
        let l = this.layers.splice(index,1)[0];
        
        if(index == this.layer_index){
            if(this.layers.length == 0)this.layer_index = -1;
            else this.activate_page(0);
        }
        if(index == this.load_layer_index){
            this.layer_index = -1;
        }

        return l;
    }

    public len_page(){
        return this.layers.length;
    }
}
