(function(){
'use strict';
var D=null,q=document.getElementById('q'),res=document.getElementById('res'),cnt=document.getElementById('count');
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function fmt(n){return (typeof n==='number')?n.toLocaleString('he-IL'):'-'}
function dt(c){var k=D.containers[c];if(!k||!k.date)return 'מועד הגעה לא ידוע';var p=k.date.split('-');return k.status+': '+(k.wd?'יום '+k.wd+', ':'')+p[2]+'/'+p[1]+'/'+p[0]+' ('+k.heb+' תשפ"ז)'}
function okImg(u){return typeof u==='string'&&/^https:\/\/(www\.)?shlich\.us\/images\/[A-Za-z0-9_\/.\-]+$/.test(u)}
var box=null;
function closeBox(){if(box){box.remove();box=null;document.removeEventListener('keydown',esc)}}
function esc(e){if(e.key==='Escape')closeBox()}
function openBox(u,alt){closeBox();box=el('div','lb');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','תמונה מוגדלת');
 var b=el('button','lbx','סגירה');b.type='button';b.addEventListener('click',closeBox);
 var i=el('img');i.src=u;i.alt=alt;i.referrerPolicy='no-referrer';box.appendChild(b);box.appendChild(i);
 box.addEventListener('click',function(e){if(e.target===box)closeBox()});document.body.appendChild(box);document.addEventListener('keydown',esc);b.focus()}
function thumb(p){var u=p.img;if(!okImg(u))return null;var nm=p.name||p.sku||'מוצר';
 var b=el('button','th');b.type='button';b.setAttribute('aria-label','הגדלת תמונה: '+nm);
 var i=el('img');i.src=u;i.alt=nm;i.loading='lazy';i.referrerPolicy='no-referrer';i.width=80;i.height=80;b.appendChild(i);
 b.addEventListener('click',function(){openBox(u,nm)});return b}
function card(p){
 var d=el('div','card'),h=el('h2',null,p.name||'(ללא שם)');var tb=thumb(p);if(tb){var row=el('div','row');row.appendChild(tb);var tx=el('div','tx');tx.appendChild(h);row.appendChild(tx);d.appendChild(row);var holder=tx}else{d.appendChild(h);var holder=d}
 holder.appendChild(el('div','sku','מק"ט: '+(p.sku||'-')+(p.cat?' | '+p.cat:'')));
 holder.appendChild(el('div',null,'מלאי שנשאר משנה שעברה: '+(p.left===null?'לא נספר / אין נתון':fmt(p.left))));
 holder.appendChild(el('div',null,'כמות שהוזמנה לחנוכה: '+(typeof p.ordered==='number'?fmt(p.ordered):'-')));
 if(p.inc.length){var t=el('table'),hd=el('tr');['מכולה','כמות במכולה','מועד הגעה'].forEach(function(x){hd.appendChild(el('th',null,x))});t.appendChild(hd);
  p.inc.forEach(function(i){var r=el('tr');r.appendChild(el('td',null,i.c));r.appendChild(el('td',null,fmt(i.q)));r.appendChild(el('td',null,dt(i.c)));t.appendChild(r)});d.appendChild(t)}
 else d.appendChild(el('div','muted',p.pending?('הוזמנו '+fmt(p.pending)+' יחידות, טרם שויכו למכולה'):'אין מכולה משויכת כרגע'));
 return d}
function norm(s){return String(s).toLowerCase().replace(/[\u0591-\u05C7"'`{}()\-]/g,'').trim()}
function run(){var v=norm(q.value);res.textContent='';
 if(v.length<1){cnt.textContent='הקלידו מק"ט או שם מוצר';return}
 var a=D.products.filter(function(p){return norm(p.sku).indexOf(v)>-1||norm(p.name).indexOf(v)>-1}).slice(0,50);
 cnt.textContent=a.length?('נמצאו '+a.length+' מוצרים'):'לא נמצאו מוצרים';
 a.forEach(function(p){res.appendChild(card(p))})}
fetch('data.json').then(function(r){return r.json()}).then(function(j){D=j;document.getElementById('upd').textContent='עודכן: '+j.updated.split('-').reverse().join('/');q.addEventListener('input',run);run()}).catch(function(){cnt.textContent='שגיאה בטעינת הנתונים'});
})();
