import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, User, ShoppingCart, Star, Ruler, UploadCloud, Minus, Plus, Zap, Truck, Repeat, ShieldCheck,
  ChevronLeft, ChevronRight, Check, Play, Layers, PenTool, Shield, Feather, ArrowRight,
} from "lucide-react";
import { JacketViewer } from "@/components/product/JacketViewer";
import front from "@/assets/jacket-front.png.asset.json";
import back from "@/assets/jacket-back.png.asset.json";
import cuff from "@/assets/cuff.png.asset.json";
import sleeve from "@/assets/sleeve.png.asset.json";
import buttons from "@/assets/buttons.png.asset.json";
import fabric from "@/assets/fabric.png.asset.json";
import patch from "@/assets/patch.png.asset.json";
import modelThumb from "@/assets/model-thumb.png.asset.json";
import lifestyle from "@/assets/lifestyle-model.png.asset.json";
import fabricWide from "@/assets/fabric-wide.png.asset.json";
import relBlack from "@/assets/rel-black.png.asset.json";
import relNavy from "@/assets/rel-navy.png.asset.json";
import relMaroon from "@/assets/rel-maroon.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Custom Varsity Jacket | A.N.J. Designs" },
      { name: "description", content: "Personalize a premium fleece varsity jacket with your initials, name and logo. 360° preview." },
      { property: "og:title", content: "Custom Varsity Jacket | A.N.J. Designs" },
      { property: "og:description", content: "Make it yours. Wear your identity. Custom varsity jacket from ₹2,499." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const gallery = [
  { src: undefined as string | undefined, thumb: front.url, alt: "Front" },
  { src: back.url, thumb: back.url, alt: "Back" },
  { src: cuff.url, thumb: cuff.url, alt: "Ribbed cuff" },
  { src: sleeve.url, thumb: sleeve.url, alt: "Sleeve" },
  { src: buttons.url, thumb: buttons.url, alt: "Buttons" },
  { src: fabric.url, thumb: fabric.url, alt: "Fleece fabric" },
  { src: patch.url, thumb: patch.url, alt: "Embroidered initials" },
  { src: modelThumb.url, thumb: modelThumb.url, alt: "Worn by model", video: true },
];
const colors = [
  { name: "Black", cls: "bg-swatch-black" },
  { name: "Navy", cls: "bg-swatch-navy" },
  { name: "Maroon", cls: "bg-swatch-maroon" },
  { name: "Green", cls: "bg-swatch-green" },
];
const sizes = ["S", "M", "L", "XL", "XXL"];
const features = [
  { icon: Layers, t: "Premium Fleece Fabric", d: "Soft, warm and long-lasting" },
  { icon: PenTool, t: "Custom Embroidery", d: "Your name, initials or logo" },
  { icon: Layers, t: "Double Stripe Ribbed Cuffs", d: "Classic varsity look and perfect fit" },
  { icon: Shield, t: "Durable Button Closure", d: "High-quality metal snaps" },
  { icon: Feather, t: "Comfortable Fit", d: "Relaxed and stylish for everyday wear" },
];
const tabs = ["Description", "Fabric & Care", "Size Guide", "Shipping & Returns"];
const tabContent: Record<string, { p: string; list: string[] }> = {
  Description: { p: "A classic varsity jacket with a modern fit, crafted from premium fleece. Personalize it with your name, initials, or logo for a unique look.", list: ["Front button closure", "Ribbed collar, cuffs and hem", "Custom embroidery (name / initials)", "Perfect for college, teams, events & brands"] },
  "Fabric & Care": { p: "Premium fleece body and sleeves with knitted rib trims.", list: ["Machine wash cold, inside out", "Do not bleach", "Tumble dry low", "Do not iron on embroidery"] },
  "Size Guide": { p: "Relaxed fit. Chest measurements (inches):", list: ["S – 38", "M – 40", "L – 42", "XL – 44, XXL – 46"] },
  "Shipping & Returns": { p: "Made to order and dispatched within 5–7 days.", list: ["Free shipping on orders above ₹1,999", "Easy exchange within 7 days", "Secure, 100% safe payment"] },
};
const reviews = [
  { n: "Rohan S.", t: "Amazing quality and perfect fit! The customization looks premium.", img: patch.url },
  { n: "Akash P.", t: "Loved the fabric and finish. The name embroidery is super clean.", img: back.url },
];
const related = [
  { n: "Varsity Jacket – Black", img: relBlack.url },
  { n: "Varsity Jacket – Navy", img: relNavy.url },
  { n: "Varsity Jacket – Maroon", img: relMaroon.url },
];

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="flex text-star">
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`${className} fill-current`} />)}
    </span>
  );
}

function ProductPage() {
  const [active, setActive] = useState(0);
  const [initials, setInitials] = useState("KJ");
  const [backName, setBackName] = useState("KABIR");
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [logo, setLogo] = useState<string | null>(null);
  const [cart, setCart] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-[52px] max-w-[1536px] items-center gap-6 px-4 lg:px-[70px]">
          <a href="/" className="shrink-0 text-xl font-black tracking-tight sm:text-[26px]">A.N.J. DESIGNS<sup className="text-[10px]">™</sup></a>
          <nav className="mx-auto hidden gap-10 text-[15px] font-semibold md:flex">
            {["Home", "Shop", "Custom Design", "Bulk Orders", "About Us"].map((n) => <a key={n} href="#" className="hover:text-select">{n}</a>)}
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <label className="hidden h-8 w-60 items-center gap-2 rounded-md border bg-background px-3 text-sm lg:flex">
              <Search className="h-4 w-4" />
              <input placeholder="Search jackets..." className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
            </label>
            <User className="h-6 w-6" />
            <span className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cart}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1536px] px-3 py-3 lg:px-[14px]">
        {/* top: viewer + panel */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,62fr)_minmax(0,38fr)]">
          <div className="min-w-0">
            <JacketViewer image={gallery[active]?.src} key={active} />
            <div className="mt-3 flex items-center gap-2 sm:gap-3">
              <button onClick={() => setActive((a) => (a - 1 + gallery.length) % gallery.length)} aria-label="Previous" className="mx-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border"><ChevronLeft className="h-4 w-4" /></button>
              <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto py-1">
                {gallery.map((g, i) => (
                  <button key={g.alt} onClick={() => setActive(i)} className={`relative aspect-[87/82] w-[72px] shrink-0 overflow-hidden rounded-md bg-muted sm:w-auto sm:flex-1 ${active === i ? "ring-2 ring-select ring-offset-2" : ""}`}>
                    <img src={g.thumb} alt={g.alt} className="h-full w-full object-cover" />
                    {g.video && <span className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-3.5 w-3.5 fill-current" /></span>}
                  </button>
                ))}
              </div>
              <button onClick={() => setActive((a) => (a + 1) % gallery.length)} aria-label="Next" className="mx-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="min-w-0 lg:pr-4">
            <span className="rounded bg-accent px-2 py-0.5 text-[13px] font-semibold text-accent-foreground">Customizable</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-[31px]">Custom Varsity Jacket</h1>
            <p className="mt-1 text-[16px] text-muted-foreground">Make it yours. Wear your identity.</p>
            <div className="mt-1 flex items-center gap-2 text-sm"><Stars /> 4.9 (128 Reviews)</div>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-3xl font-extrabold">₹2,499</span>
              <span className="text-lg font-semibold text-muted-foreground line-through">₹3,499</span>
              <span className="rounded bg-sale px-3 py-1 text-sm font-bold text-sale-foreground">29% OFF</span>
            </div>

            <h2 className="mt-5 text-[16px] font-bold">Personalize Your Jacket</h2>
            <div className="mt-2 grid grid-cols-2 gap-10">
              <label className="text-[13px] font-semibold">Front Initials <span className="text-sale">*</span>
                <input value={initials} maxLength={3} onChange={(e) => setInitials(e.target.value.toUpperCase())} className="mt-1 block h-8 w-full rounded border border-input px-3 text-sm font-semibold outline-none focus:border-select" />
              </label>
              <label className="text-[13px] font-semibold">Back Name <span className="text-sale">*</span>
                <input value={backName} maxLength={12} onChange={(e) => setBackName(e.target.value.toUpperCase())} className="mt-1 block h-8 w-full rounded border border-input px-3 text-sm font-semibold outline-none focus:border-select" />
              </label>
            </div>

            <p className="mt-3 text-[13px] font-semibold">Jacket Color</p>
            <div className="mt-1.5 flex gap-4">
              {colors.map((c, i) => (
                <button key={c.name} aria-label={c.name} onClick={() => setColor(i)} className={`relative h-10 w-10 rounded-lg ${c.cls} ${color === i ? "ring-2 ring-select ring-offset-2" : ""}`}>
                  {color === i && <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-background text-foreground"><Check className="h-3 w-3" /></span>}
                </button>
              ))}
            </div>

            <p className="mt-3 text-[13px] font-semibold">Size</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              {sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`h-7 min-w-11 rounded border px-3 text-sm font-semibold ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{s}</button>
              ))}
              <button onClick={() => setTab("Size Guide")} className="ml-auto flex items-center gap-2 text-sm"><Ruler className="h-4 w-4" /> Size Guide</button>
            </div>

            <p className="mt-3 text-[13px] font-semibold">Upload Logo (Optional)</p>
            <label className="mt-1.5 flex h-14 cursor-pointer items-center justify-center gap-3 rounded border border-dashed border-input">
              {logo ? <img src={logo} alt="Your logo" className="h-10 object-contain" /> : <UploadCloud className="h-6 w-6" />}
              <span className="text-xs font-medium">{logo ? "Logo added — click to change" : "Click to upload your logo"}<br /><span className="text-muted-foreground">PNG, JPG, SVG (Max 5MB)</span></span>
              <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 5 * 1024 * 1024) setLogo(URL.createObjectURL(f)); }} />
            </label>

            <div className="mt-5 grid grid-cols-[auto_1fr_1fr] gap-3 sm:gap-4">
              <div className="flex h-10 items-center rounded border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3" aria-label="Increase"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => setCart((c) => c + qty)} className="flex h-10 items-center justify-center gap-2 rounded bg-primary text-sm font-bold text-primary-foreground sm:text-[15px]"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
              <button className="flex h-10 items-center justify-center gap-2 rounded border-2 border-primary text-sm font-bold sm:text-[15px]"><Zap className="h-4 w-4" /> Buy Now</button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[{ i: Truck, t: "Free Shipping", d: "On orders above ₹1,999" }, { i: Repeat, t: "Easy Exchange", d: "Within 7 days" }, { i: ShieldCheck, t: "Secure Payment", d: "100% safe & secure" }].map((b) => (
                <div key={b.t} className="flex items-center gap-2">
                  <b.i className="h-6 w-6 shrink-0" />
                  <div className="min-w-0 text-xs"><p className="font-semibold">{b.t}</p><p className="text-muted-foreground">{b.d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* middle: lifestyle, features, tabs */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,475fr)_minmax(0,300fr)_minmax(0,680fr)]">
          <div className="relative min-h-56 overflow-hidden rounded-lg bg-stage">
            <img src={lifestyle.url} alt="Model wearing the KJ varsity jacket" className="absolute inset-y-0 right-0 h-full w-[61%] object-cover" />
            <div className="relative flex h-full flex-col justify-center p-8 text-stage-foreground">
              <h2 className="text-3xl font-black leading-none sm:text-[32px]">Classic<br />Varsity<br />Style</h2>
              <p className="mt-4 text-sm">Personalized for you.</p>
              <span className="mt-3 h-0.5 w-8 bg-stage-foreground" />
            </div>
          </div>

          <div className="lg:pl-6">
            <h2 className="text-xl font-bold">Key Features</h2>
            <ul className="mt-3 space-y-3">
              {features.map((f) => (
                <li key={f.t} className="flex items-center gap-4">
                  <f.icon className="h-6 w-6 shrink-0" />
                  <div className="text-xs"><p className="text-[13px] font-semibold">{f.t}</p><p className="text-muted-foreground">{f.d}</p></div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-2 gap-3 border-b p-2 sm:grid-cols-4">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded py-1.5 text-[13px] font-medium ${tab === t ? "bg-primary text-primary-foreground" : "border"}`}>{t}</button>
              ))}
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-[1fr_210px]">
              <div className="text-[13px]">
                <p>{tabContent[tab]!.p}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5">{tabContent[tab]!.list.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
              <img src={fabricWide.url} alt="Black fleece fabric close-up" className="h-36 w-full rounded-lg object-cover" />
            </div>
          </div>
        </section>

        {/* bottom: reviews + related */}
        <section className="mt-4 grid gap-6 pb-6 lg:grid-cols-2">
          <div className="lg:border-r lg:pr-10">
            <h2 className="flex items-center gap-4 px-4 text-lg font-bold">Customer Reviews (128) <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-star text-star" /> 4.9/5</span></h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              {reviews.map((r) => (
                <div key={r.n} className="grid grid-cols-[minmax(0,1fr)_70px] gap-3 rounded border p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{r.n[0]}</span>
                      <div><p className="text-sm font-semibold">{r.n}</p><Stars className="h-3 w-3" /></div>
                    </div>
                    <p className="mt-2 text-[13px]">{r.t}</p>
                  </div>
                  <img src={r.img} alt="Customer photo" className="h-16 w-16 rounded-md object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Related Products</h2>
              <a href="#" className="flex items-center gap-1 text-sm text-select">View All <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {related.map((p) => (
                <a key={p.n} href="#" className="overflow-hidden rounded bg-muted">
                  <img src={p.img} alt={p.n} className="h-14 w-full object-cover object-top" />
                  <div className="px-2 py-1.5 text-xs"><p className="font-semibold">{p.n}</p><p><b>₹2,499</b> <span className="text-muted-foreground line-through">₹3,499</span></p></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
