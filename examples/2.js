
let page = new Page(document.getElementById("canvas"),600,600);
let p1 = page.add_page();
let angle = 0;

page.add_element_in_page(p1,new Layer_elem(new Layer_elem_rect(150,100,300,300),1)).then((rz1)=>{

  let animating = false;
  let interFunc = ()=>{
    angle += Math.PI / 60;
    page.rotate_in_page(p1,angle,rz1);
  };
  let timer = null;
  page.add_event_in_page(p1,Layer_event_type.click,()=>{
    if(animating) clearInterval(timer);
    else timer = setInterval(interFunc,16);
    animating = !animating;
  },rz1);

  let touchstart = false;
  let tx = 0,ty = 0,deltaX = 0,deltaY = 0;
  page.add_event_in_page(p1,Layer_event_type.touchstart,(e)=>{
    touchstart = true;
    tx = e.x;
    ty = e.y;
  },rz1);
  page.add_event_in_page(p1,Layer_event_type.touchmove,(e)=>{
    if(touchstart) {
      deltaX = e.x - tx;
      deltaY = e.y - ty;
      tx = e.x;
      ty = e.y;
      page.move_to_in_page(p1,e.elemt.x + deltaX,e.elemt.y +deltaY,rz1);
    }
  },rz1);
  page.add_event_in_page(p1,Layer_event_type.touchend,()=>{
    touchstart = false;
  },rz1);
})
