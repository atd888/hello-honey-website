
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.querySelector('.menu-toggle'),links=document.querySelector('.navlinks');
 if(toggle&&links)toggle.addEventListener('click',()=>{links.classList.toggle('open');toggle.setAttribute('aria-expanded',links.classList.contains('open')?'true':'false')});
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
   document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
   const filter=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>card.hidden=!(filter==='all'||card.dataset.category===filter));
 }));
 const form=document.querySelector('#booking-form');
 if(form)form.addEventListener('submit',e=>{e.preventDefault();const msg=document.querySelector('.form-message');if(msg){msg.style.display='block';msg.innerHTML='<strong>Your request is ready to review.</strong><br>This demo does not send or save your details. Please do not enter real personal information yet. The live booking system must be connected before this form can accept customer requests.';}});
});
