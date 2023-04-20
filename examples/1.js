
let page = new Page(document.getElementById("canvas"),1500,600);
let p1 = page.add_page();
let angle = 0,x = 600;

page.add_element_in_page(p1,new Layer_elem(new Layer_elem_rect(150,100,300,300),1)).then((rz1)=>{
  setInterval(()=>{
    angle += Math.PI / 60;
    page.rotate_in_page(p1,angle,rz1);
  },16);
})
page.add_element_in_page(p1,new Layer_elem(new Layer_elem_rect(x,50,300,300),2,{style:"#FF0000"})).then((rz2)=>{
  setInterval(()=>{
    x -= 1;
    page.move_to_in_page(p1,x,50,rz2);
  },16);
})
