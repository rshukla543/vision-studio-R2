import{u as j,r as n,s as x,j as e,L as m,m as l,g as v,B as N}from"./index-BA4AF_FF.js";import{S as k}from"./save-D4s_wXmQ.js";const u={hidden:{},show:{transition:{staggerChildren:.12}}},h={hidden:{opacity:0,y:24},show:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}};function P(){const{showToast:g}=j(),[c,d]=n.useState([]),[f,b]=n.useState(!0),[o,p]=n.useState(!1);n.useEffect(()=>{y()},[]);const y=async()=>{const{data:s,error:t}=await x.from("services_packages").select("*").order("display_order",{ascending:!0});t&&console.error(t),d(s||[]),b(!1)},r=(s,t,i)=>{const a=[...c];a[s][t]=i,d(a)},w=async()=>{p(!0),await Promise.all(c.map(s=>x.from("services_packages").upsert(s))),p(!1),g("Services updated successfully")};return f?e.jsx("div",{className:"flex items-center justify-center min-h-[400px]",children:e.jsx(m,{className:"animate-spin text-primary",size:32})}):e.jsxs(l.section,{initial:"hidden",animate:"show",variants:u,className:"mt-20 p-6 max-w-7xl mx-auto",children:[e.jsxs(l.div,{variants:h,className:"mb-14",children:[e.jsx("span",{className:"text-xs tracking-[0.4em] uppercase text-primary font-bold",children:"Pricing CMS"}),e.jsxs("h2",{className:"text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic",children:["Services ",e.jsx("span",{className:"text-white not-italic",children:"& Packages"})]}),e.jsx("div",{className:"h-px w-20 bg-primary mt-4 opacity-50"})]}),e.jsx(l.div,{variants:u,className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:c.map((s,t)=>{var i;return e.jsxs(l.div,{variants:h,className:`rounded-2xl border p-8 space-y-6 transition-all
              ${s.featured?"border-primary/40 bg-primary/5":"border-white/10 bg-white/5"}
            `,children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-white/10 pb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 text-primary",children:[e.jsx(v,{size:18}),e.jsx("span",{className:"text-xs uppercase tracking-widest",children:"Package"})]}),e.jsxs("label",{className:"flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50",children:["Featured",e.jsx("input",{type:"checkbox",checked:s.featured,onChange:a=>r(t,"featured",a.target.checked),className:"accent-primary"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("input",{className:"w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",placeholder:"Service Title",value:s.title,onChange:a=>r(t,"title",a.target.value)}),e.jsx("input",{className:"w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/70 outline-none",placeholder:"Subtitle",value:s.subtitle,onChange:a=>r(t,"subtitle",a.target.value)}),e.jsx("input",{className:"w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary font-serif outline-none",placeholder:"Price (e.g. From ₹...)",value:s.price,onChange:a=>r(t,"price",a.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-widest text-primary/60 font-bold",children:"Included Features"}),e.jsx("textarea",{rows:5,className:`\r
                  w-full\r
                  bg-white/5\r
                  border border-white/10\r
                  rounded-xl\r
\r
                  px-5\r
                  py-5\r
\r
                  text-xs\r
                  leading-relaxed\r
\r
                  scrollbar-hidden\r
                  focus:border-primary\r
                  outline-none\r
                  resize-none\r
\r
                  scroll-py-4\r
                  scroll-px-4\r
                `,value:((i=s.features)==null?void 0:i.join(`
`))||"",onChange:a=>r(t,"features",a.target.value.split(`
`))})]}),e.jsxs("div",{className:"flex items-center gap-4 pt-2",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-widest text-white/40",children:"Display Order"}),e.jsx("input",{type:"number",className:"w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1  text-xs outline-none",value:s.display_order,onChange:a=>r(t,"display_order",Number(a.target.value))})]})]},s.id||t)})}),e.jsx("div",{className:"mt-16 flex justify-center",children:e.jsxs(N,{onClick:w,disabled:o,className:"w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10",children:[o?e.jsx(m,{className:"animate-spin",size:20}):e.jsx(k,{size:20}),o?"Deploying...":"Update Services"]})})]})}export{P as default};
