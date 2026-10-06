/* ===== v163 — drag por ponteiro dos cards/elementos ===== */
(function(){
  const canvas=document.getElementById('customBuilderCanvasV156');
  if(!canvas || window.__customPointerDragV163) return;
  window.__customPointerDragV163=true;

  let drag=null;

  function markNoNativeDrag(root=canvas){
    root.querySelectorAll('.custom-element-v156').forEach(el=>{el.draggable=false;el.removeAttribute('draggable')});
  }
  markNoNativeDrag();
  new MutationObserver(()=>markNoNativeDrag()).observe(canvas,{childList:true,subtree:true});

  function nearestColumn(x,y){
    const hit=document.elementFromPoint(x,y);
    return hit?.closest?.('.custom-column-v156') || null;
  }

  function targetElement(col,x,y){
    const els=[...col.querySelectorAll(':scope > .custom-element-v156')].filter(el=>el!==drag?.el && !el.classList.contains('is-pointer-dragging-v163'));
    if(!els.length) return null;
    let best=null,bestD=Infinity;
    for(const el of els){
      const r=el.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      const d=Math.hypot(x-cx,y-cy);
      if(d<bestD){bestD=d;best=el}
    }
    return best;
  }

  function begin(e,handle){
    if(e.button!==0 || !document.body.classList.contains('editor-canvas-v156')) return;
    const el=handle.closest('.custom-element-v156');
    if(!el) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const r=el.getBoundingClientRect();
    const ph=document.createElement('div');
    ph.className='custom-drag-placeholder-v163';
    ph.style.height=Math.max(58,r.height)+'px';
    el.parentNode.insertBefore(ph,el);
    drag={el,ph,id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top,width:r.width,height:r.height};
    el.classList.add('is-pointer-dragging-v163');
    Object.assign(el.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
    handle.setPointerCapture?.(e.pointerId);
    document.body.style.userSelect='none';
  }

  function move(e){
    if(!drag || e.pointerId!==drag.id) return;
    e.preventDefault();
    drag.el.style.left=(e.clientX-drag.dx)+'px';
    drag.el.style.top=(e.clientY-drag.dy)+'px';
    const col=nearestColumn(e.clientX,e.clientY);
    if(!col) return;
    const target=targetElement(col,e.clientX,e.clientY);
    if(!target){col.appendChild(drag.ph);return}
    const r=target.getBoundingClientRect();
    const before=e.clientY < r.top+r.height/2 || (Math.abs(e.clientY-(r.top+r.height/2))<r.height*.25 && e.clientX < r.left+r.width/2);
    col.insertBefore(drag.ph,before?target:target.nextSibling);
  }

  function end(e){
    if(!drag || (e && e.pointerId!==drag.id)) return;
    const {el,ph}=drag;
    ph.replaceWith(el);
    el.classList.remove('is-pointer-dragging-v163');
    ['left','top','width','height'].forEach(k=>el.style.removeProperty(k));
    document.body.style.removeProperty('user-select');
    drag=null;
    window.__portfolioEditorDirtyV146=true;
  }

  document.addEventListener('pointerdown',e=>{
    const handle=e.target.closest?.('.custom-move-v157');
    if(!handle || !canvas.contains(handle)) return;
    begin(e,handle);
  },true);
  document.addEventListener('pointermove',move,true);
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);
})();