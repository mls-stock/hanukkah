(function(){
'use strict';
var D=null,q=document.getElementById('q'),res=document.getElementById('res'),cnt=document.getElementById('count');
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function fmt(n){return (typeof n==='number')?n.toLocaleString('he-IL'):'-'}
function dt(c){var k=D.containers[c];if(!k||!k.date)return 'מועד הגעה לא ידוע';var p=k.date.split('-');return k.status+': '+(k.wd?'יום '+k.wd+', ':'')+p[2]+'/'+p[1]+'/'+p[0]+' ('+k.heb+' תשפ"ז)'}
function card(p){
 var d=el('div','card'),h=el('h2',null,p.name||'(ללא שם)');d.appendChild(h);
 d.appendChild(el('div','sku','מק"ט: '+(p.sku||'-')+(p.cat?' | '+p.cat:'')));
 d.appendChild(el('div',null,'מלאי שנשאר משנה שעברה: '+(p.left===null?'לא נספר / אין נתון':fmt(p.left))));
 d.appendChild(el('div',null,'כמות שהוזמנה לחנוכה: '+(typeof p.ordered==='number'?fmt(p.ordered):'-')));
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
