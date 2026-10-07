(function(){
  'use strict';
  if(window.lucide)lucide.createIcons();
  const dialog=document.getElementById('project-dialog');
  if(dialog){
    const image=dialog.querySelector('img'),caption=dialog.querySelector('[data-caption]'),link=dialog.querySelector('[data-original]'),stage=dialog.querySelector('.project-dialog-stage');
    let items=[],index=0;
    function show(i){index=(i+items.length)%items.length;const item=items[index];image.src=item.dataset.image;image.alt=item.dataset.caption;caption.textContent=`${item.dataset.caption} · ${index+1} / ${items.length}`;link.href=item.dataset.image;stage.classList.remove('zoom');dialog.querySelector('[data-zoom]').setAttribute('aria-pressed','false');}
    document.addEventListener('click',e=>{const button=e.target.closest('[data-image]');if(!button)return;items=[...document.querySelectorAll('[data-image]')].filter(b=>!b.closest('[hidden]'));show(items.indexOf(button));dialog.showModal();});
    dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
    dialog.querySelector('[data-zoom]').addEventListener('click',e=>{const zoom=stage.classList.toggle('zoom');e.currentTarget.setAttribute('aria-pressed',String(zoom));});
    dialog.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));
    dialog.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
    dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  }
  const search=document.getElementById('archive-search'),category=document.getElementById('archive-category');
  if(search&&category){const items=[...document.querySelectorAll('.archive-grid .scheme')];function filter(){const q=search.value.trim().toLowerCase();let count=0;for(const item of items){item.hidden=!(item.dataset.title.toLowerCase().includes(q)&&(category.value==='all'||item.dataset.category===category.value));if(!item.hidden)count++;}document.getElementById('archive-count').textContent=`${count} 张`;document.getElementById('archive-empty').hidden=count!==0;}search.addEventListener('input',filter);category.addEventListener('change',filter);filter();}
})();
