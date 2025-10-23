/* Global State */
const state = {
  products: [],
  filtered: [],
  cart: {},
  wishlist: new Set(),
  query: '',
  filter: 'all',
  sort: 'popularity'
}

/* Utils */
const $ = (sel, root=document) => root.querySelector(sel)
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel))
const rp = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const saveLS = () => {
  localStorage.setItem('cart', JSON.stringify(state.cart))
  localStorage.setItem('wishlist', JSON.stringify([...state.wishlist]))
}
const loadLS = () => {
  try {
    state.cart = JSON.parse(localStorage.getItem('cart')||'{}')
    state.wishlist = new Set(JSON.parse(localStorage.getItem('wishlist')||'[]'))
  } catch {}
}

/* Demo Data (Cafe Menu) */
const demoProducts = () => {
  const base = [
    { id:'m1', name:'Espresso Single', price:18000, category:'coffee', rating:4.7, img:'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?q=80&w=800&auto=format&fit=crop', tags:['espresso','coffee'] },
    { id:'m2', name:'Cappuccino', price:28000, category:'coffee', rating:4.8, img:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop', tags:['milk','coffee'] },
    { id:'m3', name:'Latte Caramel', price:32000, category:'coffee', rating:4.6, img:'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=800&auto=format&fit=crop', tags:['latte','sweet'] },
    { id:'m4', name:'Matcha Latte', price:34000, category:'tea', rating:4.5, img:'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=800&auto=format&fit=crop', tags:['tea','matcha'] },
    { id:'m5', name:'Earl Grey Tea', price:22000, category:'tea', rating:4.4, img:'https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?q=80&w=800&auto=format&fit=crop', tags:['tea'] },
    { id:'m6', name:'Croissant Butter', price:20000, category:'pastry', rating:4.5, img:'https://images.unsplash.com/photo-1541781286675-09d01e5c1f9a?q=80&w=800&auto=format&fit=crop', tags:['pastry','butter'] },
    { id:'m7', name:'Chocolate Muffin', price:18000, category:'pastry', rating:4.3, img:'https://images.unsplash.com/photo-1599785209797-7f6f5d5c7858?q=80&w=800&auto=format&fit=crop', tags:['cake','pastry'] },
    { id:'m8', name:'Chicken Sandwich', price:38000, category:'food', rating:4.4, img:'https://images.unsplash.com/photo-1604908176997-43162f2e3cbb?q=80&w=800&auto=format&fit=crop', tags:['food','sandwich'] },
    { id:'m9', name:'Pasta Aglio Olio', price:42000, category:'food', rating:4.2, img:'https://images.unsplash.com/photo-1522184216315-dc2f4f5147f1?q=80&w=800&auto=format&fit=crop', tags:['pasta','food'] },
    { id:'m10', name:'Iced Americano', price:24000, category:'coffee', rating:4.1, img:'https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=800&auto=format&fit=crop', tags:['coffee','iced'] },
    { id:'m11', name:'Lemon Tea', price:20000, category:'tea', rating:4.0, img:'https://images.unsplash.com/photo-1505575972945-3f4d52f1f003?q=80&w=800&auto=format&fit=crop', tags:['tea','lemon'] },
    { id:'m12', name:'Cinnamon Roll', price:23000, category:'pastry', rating:4.6, img:'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop', tags:['pastry'] },
  ]
  return base
}

/* Rendering */
function renderProducts() {
  const grid = $('#productGrid')
  grid.innerHTML = ''

  const items = state.filtered
  if (!items.length) {
    $('#emptyState').classList.remove('hidden')
    return
  } else {
    $('#emptyState').classList.add('hidden')
  }

  for (const p of items) {
    const card = document.createElement('div')
    card.className = 'group relative bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-smooth hover:-translate-y-0.5 transition will-change-transform'
    card.innerHTML = `
      <div class="relative">
        <img src="${p.img}" alt="${p.name}" class="w-full aspect-[4/3] object-cover"/>
        <button data-id="${p.id}" class="btn-wishlist absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 hover:bg-white"><i class="ph ph-heart text-pink-600"></i></button>
      </div>
      <div class="p-3 md:p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">${p.category}</p>
        <h3 class="font-semibold leading-tight line-clamp-2">${p.name}</h3>
        <div class="mt-2 flex items-center justify-between">
          <span class="font-bold text-brand-700 dark:text-brand-400">${rp(p.price)}</span>
          <span class="text-xs text-gray-500">⭐ ${p.rating}</span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button data-id="${p.id}" class="btn-quick px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-600 text-sm">Lihat</button>
          <button data-id="${p.id}" class="btn-add px-3 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-sm">Tambah</button>
        </div>
      </div>
    `
    grid.appendChild(card)
  }
}

function renderCart() {
  const wrap = $('#cartItems')
  wrap.innerHTML = ''
  let subtotal = 0

  const entries = Object.entries(state.cart)
  if (!entries.length) {
    wrap.innerHTML = '<div class="p-6 text-center text-sm text-gray-500">Pesanan kosong</div>'
  } else {
    for (const [id, qty] of entries) {
      const p = state.products.find(x => x.id === id)
      if (!p) continue
      subtotal += p.price * qty
      const row = document.createElement('div')
      row.className = 'flex gap-3 p-4'
      row.innerHTML = `
        <img src="${p.img}" alt="${p.name}" class="h-16 w-16 rounded-lg object-cover border border-gray-100 dark:border-gray-800"/>
        <div class="flex-1">
          <p class="font-medium">${p.name}</p>
          <p class="text-sm text-gray-500">${rp(p.price)}</p>
          <div class="mt-2 flex items-center gap-2">
            <button data-id="${p.id}" class="btn-dec px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">-</button>
            <span class="min-w-6 text-center">${qty}</span>
            <button data-id="${p.id}" class="btn-inc px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">+</button>
            <button data-id="${p.id}" class="btn-remove ml-auto px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Hapus</button>
          </div>
        </div>
      `
      wrap.appendChild(row)
    }
  }

  $('#cartSubtotal').textContent = rp(subtotal)
  const count = entries.reduce((a, [_, q]) => a + q, 0)
  $('#badgeCart').textContent = count
  $('#badgeCart').classList.toggle('hidden', count === 0)
}

function renderWishlistBadge() {
  const count = state.wishlist.size
  $('#badgeWishlist').textContent = count
  $('#badgeWishlist').classList.toggle('hidden', count === 0)
}

/* Filtering & Sorting */
function applyQuery() {
  const q = state.query.trim().toLowerCase()
  let items = [...state.products]
  if (state.filter !== 'all') items = items.filter(p => p.category === state.filter)
  if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))

  switch (state.sort) {
    case 'newest': items = items.reverse(); break
    case 'price_low': items.sort((a,b)=>a.price-b.price); break
    case 'price_high': items.sort((a,b)=>b.price-a.price); break
    default: items.sort((a,b)=>b.rating-a.rating)
  }

  state.filtered = items
  renderProducts()
}

/* Interactions */
function bindHeader() {
  const themeBtn = $('#btnTheme')
  themeBtn.addEventListener('click', () => {
    const html = document.documentElement
    const dark = !html.classList.contains('dark')
    html.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  })

  $('#btnCart').addEventListener('click', openCart)
  $('#btnCloseCart').addEventListener('click', closeCart)

  const search = $('#searchInput')
  const clear = $('#btnClearSearch')
  if (search) {
    search.addEventListener('input', (e)=>{
      state.query = e.target.value
      clear.classList.toggle('hidden', !state.query)
      applyQuery()
    })
    clear.addEventListener('click', ()=>{
      state.query = ''
      search.value = ''
      clear.classList.add('hidden')
      applyQuery()
    })
  }

  $$('#sortSelect').forEach(sel=>{
    sel.addEventListener('change', (e)=>{ state.sort = e.target.value; applyQuery() })
  })

  $$('.filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      $$('.filter-chip').forEach(c=>c.classList.remove('active','border-brand-500','text-brand-700'))
      chip.classList.add('active','border-brand-500','text-brand-700')
      state.filter = chip.dataset.filter
      applyQuery()
    })
  })

  $('#btnRefresh').addEventListener('click', ()=>{
    toast('Daftar menu diperbarui')
    state.products = demoProducts()
    applyQuery()
  })

  $('#btnWishlist').addEventListener('click', ()=>{
    toast(`Wishlist: ${state.wishlist.size} item`)
  })
}

function bindGridEvents() {
  const grid = $('#productGrid')
  grid.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('.btn-add')
    const quickBtn = e.target.closest('.btn-quick')
    const wishBtn = e.target.closest('.btn-wishlist')
    if (addBtn) {
      addToCart(addBtn.dataset.id)
    } else if (quickBtn) {
      openQuickView(quickBtn.dataset.id)
    } else if (wishBtn) {
      toggleWishlist(wishBtn.dataset.id)
      wishBtn.classList.toggle('ring-2')
      renderWishlistBadge()
      saveLS()
    }
  })
}

function bindCartEvents() {
  const wrap = $('#cartItems')
  wrap.addEventListener('click', (e)=>{
    const id = e.target.dataset.id
    if (e.target.classList.contains('btn-inc')) updateQty(id, 1)
    if (e.target.classList.contains('btn-dec')) updateQty(id, -1)
    if (e.target.classList.contains('btn-remove')) removeFromCart(id)
  })
}

/* Cart Logic */
function addToCart(id, qty=1) {
  state.cart[id] = (state.cart[id]||0) + qty
  renderCart(); saveLS(); toast('Ditambahkan ke pesanan')
}
function updateQty(id, delta) {
  const cur = state.cart[id]||0
  const next = Math.max(0, cur + delta)
  if (next === 0) delete state.cart[id]; else state.cart[id] = next
  renderCart(); saveLS()
}
function removeFromCart(id) {
  delete state.cart[id]
  renderCart(); saveLS(); toast('Dihapus dari pesanan')
}

/* Wishlist */
function toggleWishlist(id) {
  if (state.wishlist.has(id)) state.wishlist.delete(id); else state.wishlist.add(id)
}

/* Drawer & Modal */
function openCart(){ $('#cartDrawer').style.transform = 'translateX(0)' }
function closeCart(){ $('#cartDrawer').style.transform = 'translateX(100%)' }

function openQuickView(id){
  const p = state.products.find(x=>x.id===id)
  if (!p) return
  $('#modalTitle').textContent = p.name
  $('#modalBody').innerHTML = `
    <div>
      <img src="${p.img}" alt="${p.name}" class="w-full aspect-square rounded-xl object-cover border border-gray-100 dark:border-gray-800"/>
    </div>
    <div class="space-y-3">
      <p class="text-2xl font-bold text-brand-700 dark:text-brand-400">${rp(p.price)}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Kategori: <span class="capitalize">${p.category}</span></p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Rating: ⭐ ${p.rating}</p>
      <div class="pt-2 flex gap-2">
        <button data-id="${p.id}" id="modalAdd" class="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700">Tambah ke Pesanan</button>
        <button id="modalClose" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">Tutup</button>
      </div>
    </div>
  `
  $('#modal').classList.remove('hidden')
}

function bindModal() {
  $('#btnCloseModal').addEventListener('click', ()=> $('#modal').classList.add('hidden'))
  $('#modal').addEventListener('click', (e)=>{ if (e.target.id==='modal') $('#modal').classList.add('hidden') })
  $('#modal').addEventListener('click', (e)=>{
    if (e.target.id==='modalClose') $('#modal').classList.add('hidden')
    if (e.target.id==='modalAdd') { addToCart(e.target.dataset.id); $('#modal').classList.add('hidden') }
  })
}

/* Toast */
let toastTimer
function toast(msg) {
  const box = $('#toast')
  box.textContent = msg
  box.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm shadow-smooth'
  clearTimeout(toastTimer)
  box.classList.remove('hidden')
  toastTimer = setTimeout(()=> box.classList.add('hidden'), 1600)
}

/* Init */
function initTheme(){
  const saved = localStorage.getItem('theme')
  if (saved) document.documentElement.classList.toggle('dark', saved==='dark')
}

function init() {
  initTheme()
  loadLS()
  state.products = demoProducts()
  state.filtered = [...state.products]
  renderProducts()
  renderCart()
  renderWishlistBadge()
  bindHeader(); bindGridEvents(); bindCartEvents(); bindModal()
  bindReservation()
  $('#year').textContent = new Date().getFullYear()
}

/* Drawer close button */
$('#btnCloseCart')?.addEventListener('click', closeCart)

window.addEventListener('DOMContentLoaded', init)

/* Reservation */
function bindReservation(){
  const openers = [$('#btnReserve'), $('#btnReserveHero')].filter(Boolean)
  const modal = $('#reserveModal')
  const closeBtn = $('#btnCloseReserve')
  const form = $('#reserveForm')
  openers.forEach(btn=> btn.addEventListener('click', ()=> modal.classList.remove('hidden')))
  closeBtn?.addEventListener('click', ()=> modal.classList.add('hidden'))
  modal.addEventListener('click', (e)=>{ if (e.target.id==='reserveModal') modal.classList.add('hidden') })
  form?.addEventListener('submit', (e)=>{
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form).entries())
    toast(`Reservasi untuk ${data.people} orang, ${data.date} ${data.time}`)
    form.reset(); modal.classList.add('hidden')
  })
}
