/* Global State */
const state = {
  products: [],
  filtered: [],
  cart: {},
  wishlist: new Set(),
  query: '',
  filter: 'all',
  sort: 'popularity',
  orderType: 'dinein',
  notes: {}
}

/* Utils */
const $ = (sel, root=document) => root.querySelector(sel)
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel))
const rp = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const slug = s => s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')
const localImg = name => `assets/images/${slug(name)}.jpg`
const saveLS = () => {
  localStorage.setItem('cart', JSON.stringify(state.cart))
  localStorage.setItem('wishlist', JSON.stringify([...state.wishlist]))
  localStorage.setItem('orderType', state.orderType)
  localStorage.setItem('notes', JSON.stringify(state.notes))
}
const loadLS = () => {
  try {
    state.cart = JSON.parse(localStorage.getItem('cart')||'{}')
    state.wishlist = new Set(JSON.parse(localStorage.getItem('wishlist')||'[]'))
    state.orderType = localStorage.getItem('orderType') || 'dinein'
    state.notes = JSON.parse(localStorage.getItem('notes')||'{}')
  } catch {}
}

/* Demo Data (Angkringan Menu) */
const demoProducts = () => {
  const base = [
    { id:'a1', name:'Sate Usus', price:3000, category:'skewers', rating:4.7, img:'https://images.unsplash.com/photo-1612929633738-8fe44f3820cf?q=80&w=800&auto=format&fit=crop', tags:['sate','usus'] },
    { id:'a2', name:'Sate Kulit', price:3000, category:'skewers', rating:4.6, img:'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop', tags:['sate','kulit'] },
    { id:'a3', name:'Sate Telur Puyuh', price:4000, category:'skewers', rating:4.8, img:'https://images.unsplash.com/photo-1604908553734-4d9d34658fec?q=80&w=800&auto=format&fit=crop', tags:['sate','puyuh'] },
    { id:'a13', name:'Sate Ati Ampela', price:4000, category:'skewers', rating:4.4, img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop', tags:['sate','ati','ampela'] },
    { id:'a14', name:'Baso Tusuk', price:3000, category:'skewers', rating:4.3, img:'https://images.unsplash.com/photo-1586201375761-83865001e31b?q=80&w=800&auto=format&fit=crop', tags:['baso','tusuk'] },
    { id:'a4', name:'Nasi Kucing Terasi', price:5000, category:'rice', rating:4.5, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', tags:['nasi','kucing'] },
    { id:'a5', name:'Nasi Kucing Teri', price:6000, category:'rice', rating:4.4, img:'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop', tags:['nasi','kucing'] },
    { id:'a15', name:'Nasi Kucing Ayam Suwir', price:6000, category:'rice', rating:4.6, img:'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop', tags:['nasi','kucing','ayam'] },
    { id:'a6', name:'Tahu Isi', price:2000, category:'snacks', rating:4.3, img:'https://images.unsplash.com/photo-1593529467220-9f1bc2d54e34?q=80&w=800&auto=format&fit=crop', tags:['gorengan','tahu'] },
    { id:'a7', name:'Tempe Mendoan', price:3000, category:'snacks', rating:4.6, img:'https://images.unsplash.com/photo-1612872087720-bb8a7b3b5162?q=80&w=800&auto=format&fit=crop', tags:['gorengan','tempe'] },
    { id:'a16', name:'Bakwan Sayur', price:2000, category:'snacks', rating:4.2, img:'https://images.unsplash.com/photo-1604908553706-680cf3a4a26a?q=80&w=800&auto=format&fit=crop', tags:['gorengan','bakwan'] },
    { id:'a17', name:'Cireng', price:2000, category:'snacks', rating:4.1, img:'https://images.unsplash.com/photo-1601050690079-3fd9d8e9a599?q=80&w=800&auto=format&fit=crop', tags:['gorengan','cireng'] },
    { id:'a8', name:'Wedang Jahe', price:7000, category:'hot', rating:4.2, img:'https://images.unsplash.com/photo-1613478223719-8b7698d2bf44?q=80&w=800&auto=format&fit=crop', tags:['minum','hangat'] },
    { id:'a9', name:'Teh Anget', price:4000, category:'hot', rating:4.1, img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop', tags:['teh','hangat'] },
    { id:'a18', name:'Kopi Hitam Panas', price:6000, category:'hot', rating:4.3, img:'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop', tags:['kopi','hangat'] },
    { id:'a10', name:'Es Teh Manis', price:5000, category:'cold', rating:4.0, img:'https://images.unsplash.com/photo-1556679343-c7306c2c9c0f?q=80&w=800&auto=format&fit=crop', tags:['teh','dingin'] },
    { id:'a11', name:'Es Jeruk', price:7000, category:'cold', rating:4.3, img:'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop', tags:['jeruk','dingin'] },
    { id:'a19', name:'Es Kopi Susu', price:8000, category:'cold', rating:4.4, img:'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=800&auto=format&fit=crop', tags:['kopi','dingin'] },
    { id:'a12', name:'Pisang Goreng', price:4000, category:'snacks', rating:4.5, img:'https://images.unsplash.com/photo-1604908553716-3f5a5b5f963f?q=80&w=800&auto=format&fit=crop', tags:['gorengan','pisang'] },
    { id:'a20', name:'Sosis Bakar', price:5000, category:'skewers', rating:4.0, img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop', tags:['sate','sosis'] },
  ]
  return base.map(p=> ({ ...p, local: localImg(p.name) }))
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
    const murah = p.price <= 5000
    card.innerHTML = `
      <div class="relative">
        <img src="${p.local}" onerror="this.onerror=null;this.src='${p.img}';" alt="${p.name}" class="w-full aspect-[4/3] object-cover"/>
        <span class="absolute left-2 top-2 px-2 py-0.5 rounded-full text-[11px] bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 capitalize">${p.category}</span>
        ${murah ? '<span class="absolute left-2 bottom-2 px-2 py-0.5 rounded-full text-[11px] bg-emerald-600 text-white">Murah</span>' : ''}
        <button data-id="${p.id}" class="btn-wishlist absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 hover:bg-white ${state.wishlist.has(p.id)?'ring-2 ring-pink-500':''}"><i class="ph ph-heart text-pink-600"></i></button>
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
        <img src="${p.local}" onerror="this.onerror=null;this.src='${p.img}';" alt="${p.name}" class="h-16 w-16 rounded-lg object-cover border border-gray-100 dark:border-gray-800"/>
        <div class="flex-1">
          <p class="font-medium">${p.name}</p>
          <p class="text-sm text-gray-500">${rp(p.price)}</p>
          <div class="mt-2 flex items-center gap-2">
            <button data-id="${p.id}" class="btn-dec px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">-</button>
            <span class="min-w-6 text-center">${qty}</span>
            <button data-id="${p.id}" class="btn-inc px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">+</button>
            <button data-id="${p.id}" class="btn-remove ml-auto px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Hapus</button>
          </div>
          <input data-id="${p.id}" placeholder="Catatan (mis: pedas, tanpa sambal)" class="note-input mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm" value="${(state.notes[p.id]||'').replace(/"/g,'&quot;')}" />
        </div>
      `
      wrap.appendChild(row)
    }
  }

  $('#cartSubtotal').textContent = rp(subtotal)
  const count = entries.reduce((a, [_, q]) => a + q, 0)
  $('#badgeCart').textContent = count
  $('#badgeCart').classList.toggle('hidden', count === 0)
  updateBottomBar(subtotal, count)
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

  // Mobile menu toggle
  const menuBtn = $('#btnMenu')
  const mobileMenu = $('#mobileMenu')
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'))
  }

  // Smooth scroll for nav links and close mobile menu
  $$('.nav-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior:'smooth', block:'start' })
        mobileMenu?.classList.add('hidden')
      }
    })
  })

  // Quick category filters in navbar/mobile
  $$('.nav-filter').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault()
      const filter = a.dataset.filter || 'all'
      state.filter = filter
      // update chip active state
      $$('.filter-chip').forEach(c=>{
        c.classList.toggle('active', c.dataset.filter===filter)
        c.classList.toggle('border-brand-500', c.dataset.filter===filter)
        c.classList.toggle('text-brand-700', c.dataset.filter===filter)
      })
      applyQuery()
      document.querySelector('#products')?.scrollIntoView({ behavior:'smooth', block:'start' })
      mobileMenu?.classList.add('hidden')
    })
  })

  // Open cart from any cart buttons (desktop/mobile)
  $$('[id="btnCart"]').forEach(btn=> btn.addEventListener('click', openCart))
  $('#btnCloseCart').addEventListener('click', closeCart)

  const search = $('#searchInput')
  const clear = $('#btnClearSearch')
  const searchM = $('#searchInputMobile')
  const clearM = $('#btnClearSearchMobile')
  const syncInputs = (val) => {
    if (search && search.value !== val) search.value = val
    if (searchM && searchM.value !== val) searchM.value = val
  }
  const onQuery = (val) => {
    state.query = val
    clear?.classList.toggle('hidden', !state.query)
    clearM?.classList.toggle('hidden', !state.query)
    applyQuery()
  }
  if (search) {
    search.addEventListener('input', (e)=>{ syncInputs(e.target.value); onQuery(e.target.value) })
    clear?.addEventListener('click', ()=>{ syncInputs(''); onQuery('') })
  }
  if (searchM) {
    searchM.addEventListener('input', (e)=>{ syncInputs(e.target.value); onQuery(e.target.value) })
    clearM?.addEventListener('click', ()=>{ syncInputs(''); onQuery('') })
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

  const orderSel = $('#orderType')
  if (orderSel) {
    orderSel.value = state.orderType
    orderSel.addEventListener('change', (e)=>{ state.orderType = e.target.value; saveLS(); toast(`Tipe pesanan: ${state.orderType==='dinein'?'Makan di tempat':'Bungkus'}`) })
  }
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
      wishBtn.classList.toggle('ring-pink-500')
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
  wrap.addEventListener('input', (e)=>{
    const input = e.target.closest('.note-input')
    if (!input) return
    const id = input.dataset.id
    state.notes[id] = input.value
    saveLS()
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
  delete state.notes[id]
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
      <img src="${p.local}" onerror="this.onerror=null;this.src='${p.img}';" alt="${p.name}" class="w-full aspect-square rounded-xl object-cover border border-gray-100 dark:border-gray-800"/>
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
  bindWhatsApp(); bindBottomBar()
  bindReceipt()
  $('#year').textContent = new Date().getFullYear()

  // Close top announcement banner
  $('#btnCloseBanner')?.addEventListener('click', ()=>{
    $('#btnCloseBanner').closest('div')?.remove()
  })
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

/* WhatsApp order */
function bindWhatsApp(){
  const btn = $('#btnWaOrder')
  const float = $('#btnWaFloat')
  const waNumber = '6281223464835'
  const go = () => {
    const entries = Object.entries(state.cart)
    if (!entries.length) { toast('Pesanan kosong'); return }
    let subtotal = 0
    const lines = entries.map(([id, qty])=>{
      const p = state.products.find(x=>x.id===id)
      if (!p) return null
      subtotal += p.price*qty
      const note = state.notes[id] ? ` (catatan: ${state.notes[id]})` : ''
      return `- ${p.name} x${qty}${note} = ${rp(p.price*qty)}`
    }).filter(Boolean)
    const now = new Date()
    const header = `Halo Hilmi Cafe,\nSaya ingin pesan (${state.orderType==='dinein'?'Makan di tempat':'Bungkus'}) pada ${now.toLocaleString('id-ID')}:`
    const total = `\nTotal: ${rp(subtotal)}`
    const msg = `${header}\n${lines.join('\n')}${total}`
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }
  btn?.addEventListener('click', go)
  float?.addEventListener('click', go)
}

/* Bottom bar */
function updateBottomBar(total, count){
  const bar = $('#bottomBar')
  const totalEl = $('#bottomBarTotal')
  if (!bar || !totalEl) return
  totalEl.textContent = rp(total)
  bar.classList.toggle('hidden', count===0)
}
function bindBottomBar(){
  const open = $('#bottomBarOpen')
  open?.addEventListener('click', openCart)
}

/* Receipt (Struk) */
function renderReceipt(){
  const body = $('#receiptBody')
  const entries = Object.entries(state.cart)
  if (!entries.length) { body.innerHTML = '<p>Pesanan kosong.</p>'; return }
  let subtotal = 0
  const now = new Date()
  const pad = (n)=> String(n).padStart(2,'0')
  const orderNo = `HC-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const lines = []
  // Header
  lines.push(`<div class="text-center">
    <div class="font-bold text-base">Hilmi Cafe</div>
    <div class="text-xs text-gray-500">No: ${orderNo} • ${state.orderType==='dinein'?'Makan di tempat':'Bungkus'} • ${now.toLocaleString('id-ID')}</div>
  </div>`)
  // Table header
  lines.push(`<div class="mt-3 grid grid-cols-12 text-xs text-gray-500">
    <div class="col-span-6">Item</div>
    <div class="col-span-2 text-right">Qty</div>
    <div class="col-span-2 text-right">Harga</div>
    <div class="col-span-2 text-right">Total</div>
  </div>`)
  lines.push('<div class="h-px bg-gray-200 dark:bg-gray-800 my-1"></div>')
  // Rows
  entries.forEach(([id, qty])=>{
    const p = state.products.find(x=>x.id===id)
    if (!p) return
    const line = p.price * qty
    subtotal += line
    const note = state.notes[id] ? `<div class=\"text-[11px] text-gray-500\">Catatan: ${state.notes[id]}</div>` : ''
    lines.push(`<div class="grid grid-cols-12 items-start gap-2 py-1">
      <div class="col-span-6">
        <div class="font-medium">${p.name}</div>
        ${note}
      </div>
      <div class="col-span-2 text-right">${qty}</div>
      <div class="col-span-2 text-right">${rp(p.price)}</div>
      <div class="col-span-2 text-right font-medium">${rp(line)}</div>
    </div>`)
  })
  lines.push('<div class="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>')
  // Footer totals
  const totalItems = entries.reduce((a, [_, q])=> a+q, 0)
  lines.push(`<div class="flex items-center justify-between text-sm">
    <span>Total Item</span>
    <span class="font-medium">${totalItems}</span>
  </div>`)
  lines.push(`<div class="flex items-center justify-between text-base font-semibold">
    <span>Subtotal</span>
    <span>${rp(subtotal)}</span>
  </div>`)
  lines.push(`<div class="text-center text-xs text-gray-500 mt-3">Terima kasih sudah berkunjung 👋</div>`)
  body.innerHTML = lines.join('\n')
}
function bindReceipt(){
  const openBtn = $('#btnReceipt')
  const modal = $('#receiptModal')
  const closeBtn = $('#btnCloseReceipt')
  const printBtn = $('#btnPrintReceipt')
  const waBtn = $('#btnWaFromReceipt')
  const checkoutBtn = $('#btnCheckout')
  openBtn?.addEventListener('click', ()=>{ renderReceipt(); modal.classList.remove('hidden') })
  // Bind any header receipt buttons (desktop/mobile)
  $$('[id="btnReceiptHeader"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ renderReceipt(); modal.classList.remove('hidden') })
  })
  checkoutBtn?.addEventListener('click', ()=>{ renderReceipt(); modal.classList.remove('hidden') })
  closeBtn?.addEventListener('click', ()=> modal.classList.add('hidden'))
  modal.addEventListener('click', (e)=>{ if (e.target.id==='receiptModal') modal.classList.add('hidden') })
  printBtn?.addEventListener('click', ()=> window.print())
  waBtn?.addEventListener('click', ()=>{
    const btn = $('#btnWaOrder'); btn?.click()
  })
}
