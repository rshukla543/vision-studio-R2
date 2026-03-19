import{c as I,u as P,r as i,s as l,j as e,L as p,I as A,B as f,Q as B,f as M}from"./index-BA4AF_FF.js";import{p as U,u as y}from"./imageProcessing-GwGx5W6F.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=I("PencilLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}],["path",{d:"m15 5 3 3",key:"1w25hb"}]]);function H(){const{showToast:$}=P(),[a,c]=i.useState(null),[w,x]=i.useState(!0),[o,u]=i.useState(!1),[v,m]=i.useState(!1),[N,g]=i.useState(!1),[h,_]=i.useState(null),b=i.useRef(null),d=`
    w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 
    text-white placeholder:text-white/20 outline-none transition-all duration-300
    focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:bg-black/40
  `;i.useEffect(()=>{k()},[]);const k=async()=>{x(!0);const{data:t}=await l.from("about_content").select("*").eq("singleton_key",1).limit(1);if(t&&t.length>0)c(t[0]);else{const{data:r}=await l.from("about_content").insert({singleton_key:1}).select().single();c(r)}x(!1)},C=async t=>{if(a){m(!0),g(!1);try{const r=await U(t,{maxWidth:2400,maxHeight:2400,quality:.75,maxFileSizeMB:25});_(r.previewUrl);const s=`about/${Date.now()}`,z=await y(l,"media",`${s}.jpg`,r.uploadBlob),L=await y(l,"media",`${s}-preview.jpg`,r.previewBlob);c({...a,portrait_image_url:z,portrait_image_preview_url:L})}finally{m(!1)}}},n=(t,r)=>c(s=>s&&{...s,[t]:r}),S=async()=>{a&&(u(!0),await l.from("about_content").update(a).eq("singleton_key",1),u(!1),alert("About section updated successfully!"))};return w?e.jsx("div",{className:"p-20 text-center",children:e.jsx(p,{className:"animate-spin mx-auto text-primary"})}):e.jsxs("section",{className:"mt-20 p-6 max-w-6xl mx-auto space-y-16",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs tracking-[0.4em] uppercase text-primary font-bold",children:"About CMS"}),e.jsxs("h2",{className:"text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic",children:["About ",e.jsx("span",{className:"text-white not-italic",children:"Content"})]}),e.jsx("div",{className:"h-px w-20 bg-primary mt-4 opacity-50"})]}),e.jsxs("div",{className:"grid lg:grid-cols-12 gap-14",children:[e.jsxs("div",{className:"lg:col-span-5 space-y-8",children:[e.jsxs("label",{className:"text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center gap-2",children:[e.jsx(A,{size:14})," Main Portrait"]}),e.jsxs("div",{className:"relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5",children:[(h||(a==null?void 0:a.portrait_image_preview_url))&&e.jsx("img",{src:h||a.portrait_image_preview_url,className:"absolute inset-0 w-full h-full object-cover blur-lg scale-110"}),(a==null?void 0:a.portrait_image_url)&&e.jsx("img",{src:a.portrait_image_url,onLoad:()=>g(!0),className:`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${N?"opacity-100":"opacity-0"}`}),e.jsx("div",{className:"absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center",children:e.jsx(f,{variant:"secondary",onClick:()=>{var t;return(t=b.current)==null?void 0:t.click()},children:"Replace Image"})}),v&&e.jsx("div",{className:"absolute inset-0 bg-black/70 flex items-center justify-center",children:e.jsx(p,{className:"animate-spin text-primary",size:40})})]}),e.jsx("div",{className:"pt-10",children:e.jsxs("div",{className:`\r
      border border-primary/40\r
      rounded-2xl\r
      p-8\r
      bg-primary/5\r
      text-center\r
      space-y-1\r
    `,children:[e.jsx("input",{className:`\r
        bg-transparent\r
        border-b border-primary/30\r
        w-full\r
        text-center\r
        text-primary\r
        font-serif\r
        text-lg\r
        outline-none\r
        tracking-wide\r
      `,value:(a==null?void 0:a.experience_label)||"",onChange:t=>n("experience_label",t.target.value)}),e.jsx("input",{className:`\r
        bg-transparent\r
        w-full\r
        text-center\r
        text-4xl\r
        md:text-5xl\r
        font-serif\r
        outline-none\r
        text-white\r
        leading-tight\r
      `,value:(a==null?void 0:a.experience_years)||"",onChange:t=>n("experience_years",t.target.value)})]})}),e.jsx("div",{className:"pt-10",children:e.jsxs("div",{className:`\r
      border border-primary/40\r
      rounded-2xl\r
      p-8\r
      bg-primary/5\r
      text-center\r
      space-y-1\r
    `,children:[e.jsx("input",{className:`\r
        bg-transparent\r
        border-b border-primary/30\r
        w-full\r
        text-center\r
        text-primary\r
        font-serif\r
        text-lg\r
        outline-none\r
        tracking-wide\r
      `,value:(a==null?void 0:a.weddings_label)||"",onChange:t=>n("weddings_label",t.target.value)}),e.jsx("input",{className:`\r
        bg-transparent\r
        w-full\r
        text-center\r
        text-4xl\r
        md:text-5xl\r
        font-serif\r
        outline-none\r
        text-white\r
        leading-tight\r
      `,value:(a==null?void 0:a.weddings_count)||"",onChange:t=>n("weddings_count",t.target.value)})]})}),e.jsx("input",{ref:b,type:"file",accept:"image/*",className:"hidden",onChange:t=>t.target.files&&C(t.target.files[0])})]}),e.jsxs("div",{className:"lg:col-span-7 space-y-12",children:[e.jsx("div",{className:"space-y-6",children:[["Eyebrow Text","eyebrow_text"],["Main Headline","headline"],["Highlighted Word","highlighted_word"]].map(([t,r])=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("label",{className:"text-[10px] uppercase tracking-widest text-primary/60 font-bold flex items-center gap-2",children:[e.jsx(j,{size:12})," ",t]}),e.jsx("input",{className:d,value:a[r]||"",onChange:s=>n(r,s.target.value)})]},r))}),e.jsx("div",{className:"space-y-8 pt-10 border-t border-white/10",children:[["Story Paragraph I","body_paragraph_1"],["Story Paragraph II","body_paragraph_2"]].map(([t,r])=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("label",{className:"text-[10px] uppercase tracking-widest text-primary/60 font-bold flex items-center gap-2",children:[e.jsx(j,{size:12})," ",t]}),e.jsx("textarea",{rows:4,className:`${d} resize-none scrollbar-hidden leading-relaxed px-5 py-5 scroll-py-4`,value:a[r]||"",onChange:s=>n(r,s.target.value)})]},r))}),e.jsxs("div",{className:"pt-10 border-t border-white/10 space-y-3 text-center",children:[e.jsxs("label",{className:"text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center justify-center gap-2",children:[e.jsx(B,{size:12})," Quote"]}),e.jsx("textarea",{rows:3,className:`${d} italic text-lg text-center resize-none scrollbar-hidden bg-primary/5 border-primary/20 px-6 py-6 scroll-py-4`,value:(a==null?void 0:a.quote_text)||"",onChange:t=>n("quote_text",t.target.value)})]})]})]}),e.jsx("div",{className:"pt-10 flex justify-center",children:e.jsxs(f,{onClick:S,disabled:o,className:"w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10",children:[o?e.jsx(p,{className:"animate-spin",size:20}):e.jsx(M,{size:20}),o?"Deploying...":"Update About Section"]})})]})}export{H as default};
