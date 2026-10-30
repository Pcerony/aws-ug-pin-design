(function(){
  'use strict';
  let api,baseline,enabled=false;
  const key='aws-badge-linked-scale-v1';
  function sync(){
    const [min,max]=BadgeScale.range(baseline.params,baseline.accessory);
    for(const id of ['setScale','setScaleRange']){
      const e=document.getElementById(id);e.min=Math.ceil(min*10000)/100;e.max=Math.floor(max*10000)/100;e.disabled=!enabled;
    }
  }
  function rebase(){if(!api)return;baseline=api.get();for(const id of ['setScale','setScaleRange'])document.getElementById(id).value=100;sync();}
  function apply(source,factor){
    try{const out=BadgeScale.scale(source.params,source.accessory,factor);api.set(out);document.getElementById('scaleError').textContent='';return true;}
    catch(error){document.getElementById('scaleError').textContent=error.message;return false;}
  }
  function linkedDimension(name,n){
    if(!enabled||!BadgeScale.lengths.includes(name))return false;
    const source=api.get(),old=source.params[name];if(!old)return false;
    apply(source,n/old);rebase();return true;
  }
  function linkedAccessory(name,n){
    if(!enabled)return false;
    const source=api.get();apply(source,n/source.accessory[name]);rebase();return true;
  }
  function mount(callbacks){
    api=callbacks;
    try{enabled=localStorage.getItem(key)==='true';}catch{}
    document.getElementById('linkSetScale').checked=enabled;
    if(enabled)api.unlock();
    rebase();
    document.getElementById('linkSetScale').addEventListener('change',e=>{
      enabled=e.target.checked;if(enabled)api.unlock();rebase();
      try{localStorage.setItem(key,String(enabled));}catch{}
    });
    for(const id of ['setScale','setScaleRange']){
      const e=document.getElementById(id);
      e.addEventListener('input',()=>{
        if(!enabled)return;
        const n=e.valueAsNumber;if(!Number.isFinite(n))return;
        if(apply(baseline,n/100))for(const other of ['setScale','setScaleRange'])if(other!==id)document.getElementById(other).value=n;
      });
      e.addEventListener('change',()=>{if(document.getElementById('scaleError').textContent)rebase();});
    }
  }
  window.BadgeScaleControls={mount,rebase,linkedDimension,linkedAccessory};
})();
