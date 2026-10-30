(function () {
  'use strict';
  const key='aws-badge-accessory-2027-v1', A=BadgeAccessory;
  let settings=A.normalizeLayout(null), active=0, changed=()=>{};
  try {settings=A.normalizeLayout(JSON.parse(localStorage.getItem(key)));} catch {}
  const shared=name=>['width','thickness'].includes(name);
  const value=name=>shared(name)?settings[name]:settings.items[active][name];
  function save(){try{localStorage.setItem(key,JSON.stringify(settings));}catch{}}
  function syncLink(){const url=new URL(location.href);if(url.searchParams.has('accessory')){url.searchParams.delete('accessory');history.replaceState(null,'',url);}}
  function sync(){
    active=Math.min(active,Math.max(0,settings.count-1));
    document.getElementById('accessoryCount').value=settings.count;
    const selector=document.getElementById('accessoryIndex');
    selector.innerHTML=settings.items.slice(0,settings.count).map((item,i)=>'<option value="'+i+'">'+(i+1)+' · UG '+item.role.toUpperCase()+'</option>').join('');
    selector.value=active;selector.disabled=settings.count===0;
    const role=document.getElementById('accessoryRole');role.value=settings.items[active].role;role.disabled=settings.count===0;
    for(const name of Object.keys(A.limits))for(const suffix of ['','Range']){
      const input=document.getElementById('accessory-'+name+suffix);
      if(document.activeElement!==input)input.value=value(name);
      input.disabled=settings.count===0&&!shared(name);
    }
  }
  function mount(onChange){
    changed=onChange;
    const labels={width:'牌子宽度 · 联动',thickness:'牌子厚度 · 联动',x:'左右位置 X',frontGap:'距前墙 Z',elevation:'高度偏移 Y',yaw:'水平转角',pitch:'前后倾角',roll:'左右倾角'};
    const host=document.getElementById('accessoryControls');
    for(const [name,[min,max]]of Object.entries(A.limits)){
      const unit=['yaw','pitch','roll'].includes(name)?'°':'mm',step=name==='thickness'?.1:.5;
      host.insertAdjacentHTML('beforeend','<div class="control"><div class="control-top"><label for="accessory-'+name+'">'+labels[name]+'</label><div class="numeric"><input id="accessory-'+name+'" type="number" min="'+min+'" max="'+max+'" step="'+step+'"><span>'+unit+'</span></div></div><input id="accessory-'+name+'Range" type="range" min="'+min+'" max="'+max+'" step="'+step+'" aria-label="'+labels[name]+'滑块"></div>');
      for(const suffix of ['','Range']){
        const input=document.getElementById('accessory-'+name+suffix);
        input.addEventListener('input',()=>{
          const n=input.valueAsNumber;
          if(!Number.isFinite(n)||n<min||n>max){input.setAttribute('aria-invalid','true');return;}
          input.removeAttribute('aria-invalid');
          if(shared(name)&&window.BadgeScaleControls?.linkedAccessory(name,n))return;
          if(shared(name))settings[name]=n;else settings.items[active][name]=n;
          save();sync();changed();
        });
        input.addEventListener('change',()=>{input.value=value(name);input.removeAttribute('aria-invalid');});
      }
    }
    document.getElementById('accessoryCount').addEventListener('change',e=>{settings.count=Number(e.target.value);save();sync();changed();});
    document.getElementById('accessoryIndex').addEventListener('change',e=>{active=Number(e.target.value);sync();});
    document.getElementById('accessoryRole').addEventListener('change',e=>{settings.items[active].role=e.target.value;save();syncLink();sync();changed();});
    document.getElementById('resetAccessory').addEventListener('click',()=>{settings=A.normalizeLayout(null);active=0;save();syncLink();sync();changed();});
    const requested=new URLSearchParams(location.search).get('accessory');
    if(['leader','speaker','volunteer'].includes(requested)){settings.items[0].role=requested;settings.count=Math.max(1,settings.count);save();syncLink();}
    sync();
  }
  function restore(value,preserveActive=false){settings=A.normalizeLayout(value);if(!preserveActive)active=0;save();syncLink();sync();}
  window.BadgeAccessoryControls={mount,get:()=>JSON.parse(JSON.stringify(settings)),restore};
})();
