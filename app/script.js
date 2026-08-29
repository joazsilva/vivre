const WHATSAPP_NUMBER = "5599999999999"; // ALTERE PARA O NÚMERO REAL DA LOJA

const products = [
  {id:1,name:"Conjunto Romance",category:"Conjuntos",price:89.90,oldPrice:99.90,tone1:"#f7d9df",tone2:"#e8a1b0",lingerie:"#e595aa",sizes:["P","M","G","GG"],colors:["Rosa","Preto"],badge:"Mais vendido"},
  {id:2,name:"Conjunto Renda Rosé",category:"Conjuntos",price:94.90,tone1:"#f9e3e0",tone2:"#d99aa8",lingerie:"#e4b1b6",sizes:["P","M","G"],colors:["Rosé","Nude"],badge:"Novo"},
  {id:3,name:"Conjunto Encanto",category:"Conjuntos",price:79.90,tone1:"#eee0dc",tone2:"#b86f7f",lingerie:"#b14c69",sizes:["P","M","G","GG"],colors:["Vinho","Preto"]},
  {id:4,name:"Conjunto Doce Amor",category:"Conjuntos",price:84.90,tone1:"#f5d9dd",tone2:"#efb2c0",lingerie:"#f0b7c5",sizes:["P","M","G"],colors:["Rosa"],badge:"Favorito"},
  {id:5,name:"Sutiã Renda Delicada",category:"Sutiãs",price:49.90,tone1:"#f4d9dc",tone2:"#d692a1",lingerie:"#d98298",sizes:["P","M","G","GG"],colors:["Rosa","Nude"]},
  {id:6,name:"Sutiã Preto Elegance",category:"Sutiãs",price:54.90,tone1:"#ece5e4",tone2:"#9b7f86",lingerie:"#241b21",sizes:["M","G","GG"],colors:["Preto"]},
  {id:7,name:"Sutiã Soft Nude",category:"Sutiãs",price:44.90,tone1:"#f4e5dd",tone2:"#d5b3a4",lingerie:"#d6a99d",sizes:["P","M","G"],colors:["Nude"]},
  {id:8,name:"Calcinha Renda Romance",category:"Calcinhas",price:29.90,tone1:"#f5dce0",tone2:"#e49ba9",lingerie:"#e08ca1",sizes:["P","M","G","GG"],colors:["Rosa","Preto"]},
  {id:9,name:"Calcinha Fio Duplo",category:"Calcinhas",price:27.90,tone1:"#f5e3dd",tone2:"#d7a3a4",lingerie:"#b94b67",sizes:["P","M","G"],colors:["Vinho","Preto"]},
  {id:10,name:"Conjunto Intenso",category:"Lingerie Sensual",price:109.90,tone1:"#dacbd0",tone2:"#84656e",lingerie:"#3d1724",sizes:["P","M","G"],colors:["Preto"],badge:"Sensual"},
  {id:11,name:"Conjunto Paixão",category:"Lingerie Sensual",price:114.90,tone1:"#f0d8dc",tone2:"#bd5b74",lingerie:"#a91743",sizes:["P","M","G"],colors:["Vermelho"],badge:"Novo"},
  {id:12,name:"Top Fitness Vivre",category:"Academia",price:69.90,tone1:"#efdce0",tone2:"#a87888",lingerie:"#7d3047",sizes:["P","M","G","GG"],colors:["Preto","Rosa"]}
];

let cart = JSON.parse(localStorage.getItem("vivreCart") || "[]");
let activeCategory = "Todos";
let selectedProduct = null;
let selectedSize = "";
let selectedColor = "";
let selectedQty = 1;

const $ = s => document.querySelector(s);
const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function saveCart(){ localStorage.setItem("vivreCart", JSON.stringify(cart)); }
function showToast(message){ const t=$("#toast"); t.textContent=message; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }

function renderCategoryPills(){
  const categories=["Todos",...new Set(products.map(p=>p.category))];
  $("#categoryPills").innerHTML=categories.map(c=>`<button class="category-pill ${activeCategory===c?"active":""}" data-category="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
    activeCategory=btn.dataset.category;
    renderCategoryPills(); renderProducts();
    if(activeCategory!=="Todos") document.getElementById(slug(activeCategory))?.scrollIntoView({behavior:"smooth",block:"start"});
  }));
}
function slug(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g,"-");}
function card(p){
  return `<article class="product-card">
    <div class="product-image" onclick="openProduct(${p.id})" style="cursor:pointer">
      <div class="visual" style="--tone1:${p.tone1};--tone2:${p.tone2};--lingerie:${p.lingerie}"><i></i></div>
      ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
    </div>
    <div class="product-info">
      <h4>${p.name}</h4><p>${p.category}</p>
      <div class="product-bottom"><div><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div>
      <button class="add-btn" onclick="quickAdd(${p.id})" aria-label="Adicionar ${p.name}">+</button></div>
    </div>
  </article>`;
}
function renderProducts(){
  const container=$("#productSections");
  const categories=[...new Set(products.map(p=>p.category))];
  const filtered=activeCategory==="Todos"?categories:[activeCategory];
  container.innerHTML=filtered.map(category=>{
    const list=products.filter(p=>p.category===category);
    return `<section class="product-category" id="${slug(category)}">
      <div class="category-title"><h3>${category}</h3><span>${list.length} ${list.length===1?"produto":"produtos"}</span></div>
      <div class="products-grid">${list.map(card).join("")}</div>
    </section>`;
  }).join("");
}
function openProduct(id){
  selectedProduct=products.find(p=>p.id===id);
  selectedSize=selectedProduct.sizes[0]; selectedColor=selectedProduct.colors[0]; selectedQty=1;
  renderProductModal();
  $("#productModal").classList.add("show"); document.body.classList.add("no-scroll");
}
function renderProductModal(){
  const p=selectedProduct;
  $("#productModalContent").innerHTML=`<div class="product-modal-grid">
    <div class="modal-product-art" style="--tone1:${p.tone1};--tone2:${p.tone2};--lingerie:${p.lingerie}"><i></i></div>
    <div class="modal-info">
      <span class="eyebrow">${p.category.toUpperCase()}</span><h2>${p.name}</h2>
      <p>Uma peça pensada para valorizar sua beleza com conforto e delicadeza.</p>
      <div class="modal-price">${money(p.price)}</div>
      <div class="option-label">Escolha o tamanho</div>
      <div class="options">${p.sizes.map(s=>`<button class="option ${selectedSize===s?"selected":""}" onclick="selectSize('${s}')">${s}</button>`).join("")}</div>
      <div class="option-label">Escolha a cor</div>
      <div class="options">${p.colors.map(c=>`<button class="option ${selectedColor===c?"selected":""}" onclick="selectColor('${c}')">${c}</button>`).join("")}</div>
      <div class="option-label">Quantidade</div>
      <div class="modal-actions">
        <div class="qty-box"><button onclick="changeModalQty(-1)">−</button><span>${selectedQty}</span><button onclick="changeModalQty(1)">+</button></div>
        <button class="btn btn-primary" onclick="addSelectedProduct()">Adicionar ao carrinho</button>
      </div>
    </div></div>`;
}
function selectSize(s){selectedSize=s;renderProductModal()} function selectColor(c){selectedColor=c;renderProductModal()}
function changeModalQty(v){selectedQty=Math.max(1,selectedQty+v);renderProductModal()}
function addSelectedProduct(){addToCart(selectedProduct,selectedSize,selectedColor,selectedQty);closeModal("productModal");}
function quickAdd(id){const p=products.find(x=>x.id===id);addToCart(p,p.sizes[0],p.colors[0],1)}
function addToCart(product,size,color,quantity){
  const key=`${product.id}-${size}-${color}`;
  const existing=cart.find(i=>i.key===key);
  if(existing) existing.quantity+=quantity;
  else cart.push({key,productId:product.id,name:product.name,price:product.price,size,color,quantity,tone1:product.tone1,tone2:product.tone2});
  saveCart();renderCart();showToast("Produto adicionado ao carrinho ♡");
}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.quantity,0);
  $("#cartCount").textContent=count;
  const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  $("#cartTotal").textContent=money(total);
  $("#cartItems").innerHTML=cart.map(i=>`<div class="cart-item">
    <div class="cart-thumb" style="--tone1:${i.tone1};--tone2:${i.tone2}"></div>
    <div><h4>${i.name}</h4><div class="cart-meta">${i.size} • ${i.color}</div><div class="cart-price">${money(i.price)}</div>
    <div class="qty-controls"><button onclick="changeCartQty('${i.key}',-1)">−</button><span>${i.quantity}</span><button onclick="changeCartQty('${i.key}',1)">+</button></div></div>
    <button class="remove-item" onclick="removeFromCart('${i.key}')" aria-label="Remover">×</button>
  </div>`).join("");
  $("#cartEmpty").classList.toggle("show",cart.length===0);
  $("#cartFooter").classList.toggle("hidden",cart.length===0);
}
function changeCartQty(key,delta){const i=cart.find(x=>x.key===key);if(!i)return;i.quantity+=delta;if(i.quantity<=0)cart=cart.filter(x=>x.key!==key);saveCart();renderCart();}
function removeFromCart(key){cart=cart.filter(x=>x.key!==key);saveCart();renderCart();}
function openCart(){$("#cartDrawer").classList.add("active");$("#overlay").classList.add("active");document.body.classList.add("no-scroll")}
function closeCart(){$("#cartDrawer").classList.remove("active");$("#overlay").classList.remove("active");document.body.classList.remove("no-scroll")}
function closeModal(id){$("#"+id).classList.remove("show");document.body.classList.remove("no-scroll")}

$("#cartBtn").addEventListener("click",openCart); $("#closeCart").addEventListener("click",closeCart); $("#overlay").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",()=>{closeCart();$("#produtos").scrollIntoView({behavior:"smooth"})});
$("#resetFilter").addEventListener("click",()=>{activeCategory="Todos";renderCategoryPills();renderProducts();});
$("#menuBtn").addEventListener("click",()=>$("#mobileNav").classList.toggle("open"));
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>$("#mobileNav").classList.remove("open")));
$("#searchBtn").addEventListener("click",()=>{$("#searchOverlay").classList.add("show");$("#searchInput").focus()});
$("#closeSearch").addEventListener("click",()=>$("#searchOverlay").classList.remove("show"));
$("#searchOverlay").addEventListener("click",e=>{if(e.target===$("#searchOverlay"))$("#searchOverlay").classList.remove("show")});
$("#searchInput").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  $("#searchResults").innerHTML=!q?"":products.filter(p=>(p.name+p.category).toLowerCase().includes(q)).slice(0,6).map(p=>`<div class="search-result" onclick="searchOpen(${p.id})"><strong>${p.name}</strong><span>${p.category} • ${money(p.price)}</span></div>`).join("") || "<p>Nenhum produto encontrado.</p>";
});
function searchOpen(id){$("#searchOverlay").classList.remove("show");openProduct(id)}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m){m.classList.remove("show");document.body.classList.remove("no-scroll")}}));

$("#checkoutBtn").addEventListener("click",()=>{if(cart.length){closeCart();$("#checkoutModal").classList.add("show");document.body.classList.add("no-scroll")}});
$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#customerName").value.trim(),city=$("#customerCity").value.trim(),phone=$("#customerPhone").value.trim();
  const lines=cart.map((i,n)=>`${n+1}. *${i.name}*\n   Tamanho: ${i.size}\n   Cor: ${i.color}\n   Quantidade: ${i.quantity}\n   ${money(i.price*i.quantity)}`).join("\n\n");
  const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  const message=`Olá! 👋 Gostaria de fazer um pedido na *Vivre L'amour*.\n\n🛍️ *MEU PEDIDO:*\n\n${lines}\n\n━━━━━━━━━━━━━━\n💰 *TOTAL: ${money(total)}*\n\n👤 *DADOS DO CLIENTE*\nNome: ${name}\nCidade: ${city}\nWhatsApp: ${phone}\n\nAguardo a confirmação do pedido! ♡`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
  closeModal("checkoutModal");
});
$("#resellerBtn").addEventListener("click",()=>{$("#resellerModal").classList.add("show");document.body.classList.add("no-scroll")});
$("#resellerForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#resellerName").value.trim(),phone=$("#resellerPhone").value.trim(),city=$("#resellerCity").value.trim(),state=$("#resellerState").value.trim();
  const message=`Olá! 👋 Tenho interesse em ser *revendedora da Vivre L'amour*.\n\n👤 Nome: ${name}\n📱 WhatsApp: ${phone}\n📍 Cidade: ${city} - ${state}\n\nGostaria de saber mais sobre a oportunidade de revenda. ♡`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
  closeModal("resellerModal");
});
$("#whatsappFloat").addEventListener("click",e=>{e.preventDefault();window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida sobre a Vivre L'amour. ♡")}`,"_blank")});
$("#year").textContent=new Date().getFullYear();
renderCategoryPills();renderProducts();renderCart();
