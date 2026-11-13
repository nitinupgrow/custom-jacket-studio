import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search, User, ShoppingCart, Star, Ruler, UploadCloud, Minus, Plus, Zap, Truck, Repeat, ShieldCheck,
  ChevronLeft, ChevronRight, Check, Play, Layers, PenTool, Shield, Feather, ArrowRight, Box, X, Trash2, Heart, Share2, Lock, Expand,
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
  { src: undefined as string | undefined, thumb: front.url, alt: "3D 360° view", is3d: true },
  { src: front.url, thumb: front.url, alt: "Front" },
  { src: back.url, thumb: back.url, alt: "Back" },
  { src: cuff.url, thumb: cuff.url, alt: "Ribbed cuff" },
  { src: sleeve.url, thumb: sleeve.url, alt: "Sleeve" },
  { src: buttons.url, thumb: buttons.url, alt: "Buttons" },
  { src: fabric.url, thumb: fabric.url, alt: "Fleece fabric" },
  { src: patch.url, thumb: patch.url, alt: "Embroidered initials" },
  { src: modelThumb.url, thumb: modelThumb.url, alt: "Worn by model" },
  { src: lifestyle.url, thumb: lifestyle.url, alt: "Lifestyle" },
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

type Item = { id: string; initials: string; backName: string; color: string; size: string; qty: number };
const PRICE = 2499;
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function ZoomImage({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) {
  const [o, setO] = useState<string | null>(null);
  return (
    <button onClick={onOpen} aria-label={`Open ${alt}`} className="group relative h-full w-full cursor-zoom-in overflow-hidden bg-muted"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setO(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}
      onMouseLeave={() => setO(null)}>
      <img src={src} alt={alt} draggable={false} className="h-full w-full object-contain transition-transform duration-200" style={{ transform: o ? "scale(1.8)" : "scale(1)", transformOrigin: o ?? "center" }} />
      <span className="glass-chip absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"><Expand className="h-3.5 w-3.5" /> Click to enlarge</span>
    </button>
  );
}

function ProductPage() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [initials, setInitials] = useState("KJ");
  const [backName, setBackName] = useState("KABIR");
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [logo, setLogo] = useState<string | null>(null);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wish, setWish] = useState(false);
  const [section, setSection] = useState<string>("Description");

  const imgs = gallery.map((g, i) => ({ ...g, i })).filter((g) => g.src);
  const lbIdx = lightbox === null ? -1 : imgs.findIndex((g) => g.i === lightbox);
  useEffect(() => {
    if (lightbox === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox(imgs[(lbIdx + 1) % imgs.length]!.i);
      if (e.key === "ArrowLeft") setLightbox(imgs[(lbIdx - 1 + imgs.length) % imgs.length]!.i);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [lightbox, lbIdx, imgs]);

  const valid = initials.trim().length > 0 && backName.trim().length > 0;
  const addToCart = (open = true) => {
    if (!valid) { toast.error("Please enter front initials and back name"); return false; }
    const id = `${initials}-${backName}-${colors[color]!.name}-${size}`;
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      if (ex) return c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
      return [...c, { id, initials, backName, color: colors[color]!.name, size, qty }];
    });
    toast.success("Added to cart", { description: `${qty} × Custom Varsity Jacket (${size})` });
    if (open) setCartOpen(true);
    return true;
  };
  const buyNow = () => { if (addToCart(false)) setCartOpen(true); };
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const subtotal = cart.reduce((a, b) => a + b.qty * PRICE, 0);
  const g = gallery[active]!;

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground lg:pb-0">
      <Toaster position="top-center" />
      <div className="bg-primary py-2 text-center text-xs font-semibold tracking-wide text-primary-foreground">FREE SHIPPING ON ORDERS ABOVE ₹1,999 · EASY 7-DAY EXCHANGE</div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 lg:px-8">
          <a href="/" className="shrink-0 text-xl font-black tracking-tight sm:text-2xl">A.N.J. DESIGNS<sup className="text-[10px]">™</sup></a>
          <nav className="mx-auto hidden gap-8 text-sm font-semibold md:flex">
            {["Home", "Shop", "Custom Design", "Bulk Orders", "About Us"].map((n) => <a key={n} href="#" className="transition-colors hover:text-select">{n}</a>)}
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <label className="hidden h-9 w-56 items-center gap-2 rounded-full border bg-secondary px-3 text-sm lg:flex">
              <Search className="h-4 w-4" />
              <input placeholder="Search jackets..." className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
            </label>
            <User className="h-6 w-6" />
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-sale text-[10px] font-bold text-sale-foreground">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <nav className="py-4 text-xs text-muted-foreground">Home / Shop / Jackets / <span className="text-foreground">Custom Varsity Jacket</span></nav>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] xl:gap-12">
          {/* LEFT: gallery */}
          <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <div className="flex flex-col-reverse gap-3 md:flex-row">
              <div className="flex gap-2 overflow-x-auto md:max-h-[640px] md:w-[84px] md:flex-col md:overflow-y-auto md:overflow-x-visible">
                {gallery.map((it, i) => (
                  <button key={it.alt} onClick={() => setActive(i)} aria-label={it.alt}
                    className={`relative aspect-square w-[68px] shrink-0 overflow-hidden rounded-lg border-2 bg-muted md:w-full ${active === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"}`}>
                    <img src={it.thumb} alt={it.alt} className="h-full w-full object-cover" />
                    {"is3d" in it && it.is3d && <span className="absolute inset-0 grid place-items-center bg-stage/50 text-[11px] font-bold text-stage-foreground"><span className="flex flex-col items-center"><Box className="h-5 w-5" />3D</span></span>}
                  </button>
                ))}
              </div>
              <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl md:aspect-auto md:h-[640px]">
                {g.src ? <ZoomImage src={g.src} alt={g.alt} onOpen={() => setLightbox(active)} /> : <JacketViewer />}
                <button onClick={() => setActive((a) => (a - 1 + gallery.length) % gallery.length)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background shadow md:grid" style={{ display: g.src ? undefined : "none" }}><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setActive((a) => (a + 1) % gallery.length)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background shadow" style={{ display: g.src ? undefined : "none" }}><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>

          {/* RIGHT: details */}
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Customizable</span>
              <div className="flex gap-2">
                <button onClick={() => setWish((w) => !w)} aria-label="Wishlist" className="grid h-9 w-9 place-items-center rounded-full border"><Heart className={`h-4 w-4 ${wish ? "fill-sale text-sale" : ""}`} /></button>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link copied"); }} aria-label="Share" className="grid h-9 w-9 place-items-center rounded-full border"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Custom Varsity Jacket</h1>
            <p className="mt-1 text-muted-foreground">Make it yours. Wear your identity.</p>
            <a href="#reviews" className="mt-2 flex items-center gap-2 text-sm"><Stars /> 4.9 <span className="text-muted-foreground underline">(128 reviews)</span></a>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-extrabold">{inr(PRICE)}</span>
              <span className="text-lg text-muted-foreground line-through">₹3,499</span>
              <span className="rounded bg-sale px-2.5 py-1 text-xs font-bold text-sale-foreground">SAVE 29%</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes. Made to order in 5–7 days.</p>

            <div className="mt-6 space-y-5 border-t pt-6">
              <div>
                <h2 className="font-bold">Personalize Your Jacket</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <label className="text-xs font-semibold">Front Initials <span className="text-sale">*</span>
                    <input value={initials} maxLength={3} onChange={(e) => setInitials(e.target.value.toUpperCase())} className="mt-1 block h-11 w-full rounded-md border border-input px-3 text-sm font-semibold outline-none focus:border-select" />
                    <span className="mt-1 block font-normal text-muted-foreground">{initials.length}/3</span>
                  </label>
                  <label className="text-xs font-semibold">Back Name <span className="text-sale">*</span>
                    <input value={backName} maxLength={12} onChange={(e) => setBackName(e.target.value.toUpperCase())} className="mt-1 block h-11 w-full rounded-md border border-input px-3 text-sm font-semibold outline-none focus:border-select" />
                    <span className="mt-1 block font-normal text-muted-foreground">{backName.length}/12</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Color: <span className="font-normal text-muted-foreground">{colors[color]!.name}</span></p>
                <div className="mt-2 flex gap-3">
                  {colors.map((c, i) => (
                    <button key={c.name} aria-label={c.name} onClick={() => setColor(i)} className={`relative h-10 w-10 rounded-full ${c.cls} ${color === i ? "ring-2 ring-select ring-offset-2" : ""}`}>
                      {color === i && <Check className="absolute inset-0 m-auto h-4 w-4 text-background" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Size: <span className="font-normal text-muted-foreground">{size}</span></p>
                  <button onClick={() => { setSection("Size Guide"); document.getElementById("details")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-1.5 text-xs underline"><Ruler className="h-4 w-4" /> Size Guide</button>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`h-11 rounded-md border text-sm font-semibold transition-colors ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Upload Logo <span className="font-normal text-muted-foreground">(optional)</span></p>
                <label className="mt-2 flex h-16 cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-input hover:border-primary">
                  {logo ? <img src={logo} alt="Your logo" className="h-10 object-contain" /> : <UploadCloud className="h-6 w-6" />}
                  <span className="text-xs font-medium">{logo ? "Logo added — click to change" : "Click to upload your logo"}<br /><span className="text-muted-foreground">PNG, JPG, SVG (Max 5MB)</span></span>
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 5 * 1024 * 1024) setLogo(URL.createObjectURL(f)); else if (f) toast.error("File is larger than 5MB"); }} />
                </label>
              </div>

              <div>
                <p className="text-sm font-semibold">Quantity</p>
                <div className="mt-2 flex h-11 w-32 items-center justify-between rounded-md border">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                  <span className="text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="px-3" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => addToCart()} className="flex h-12 w-full items-center justify-center gap-2 rounded-md border-2 border-primary text-[15px] font-bold transition-colors hover:bg-secondary"><ShoppingCart className="h-4 w-4" /> Add to Cart · {inr(PRICE * qty)}</button>
                <button onClick={buyNow} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-[15px] font-bold text-primary-foreground transition-opacity hover:opacity-90"><Zap className="h-4 w-4" /> Buy It Now</button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Secure checkout · UPI, Cards, Net Banking, COD</p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary p-3">
                {[{ i: Truck, t: "Free Shipping", d: "Above ₹1,999" }, { i: Repeat, t: "Easy Exchange", d: "Within 7 days" }, { i: ShieldCheck, t: "Secure Payment", d: "100% safe" }].map((b) => (
                  <div key={b.t} className="flex flex-col items-center gap-1 text-center">
                    <b.i className="h-5 w-5" />
                    <p className="text-xs font-semibold">{b.t}</p><p className="text-[11px] text-muted-foreground">{b.d}</p>
                  </div>
                ))}
              </div>

              <div id="details">
                <Accordion type="single" collapsible value={section} onValueChange={setSection}>
                  {tabs.map((t) => (
                    <AccordionItem key={t} value={t}>
                      <AccordionTrigger className="text-sm font-bold">{t}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        <p>{tabContent[t]!.p}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5">{tabContent[t]!.list.map((l) => <li key={l}>{l}</li>)}</ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative min-h-72 overflow-hidden rounded-2xl bg-stage">
            <img src={lifestyle.url} alt="Model wearing the KJ varsity jacket" className="absolute inset-y-0 right-0 h-full w-[60%] object-cover" />
            <div className="relative flex h-full flex-col justify-center p-10 text-stage-foreground">
              <h2 className="text-4xl font-black leading-none">Classic<br />Varsity<br />Style</h2>
              <p className="mt-4 text-sm">Personalized for you.</p>
              <span className="mt-3 h-0.5 w-8 bg-stage-foreground" />
            </div>
          </div>
          <div className="rounded-2xl border p-8">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f.t} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary"><f.icon className="h-5 w-5" /></span>
                  <div><p className="text-sm font-semibold">{f.t}</p><p className="text-xs text-muted-foreground">{f.d}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reviews" className="mt-16">
          <h2 className="flex items-center gap-4 text-2xl font-bold">Customer Reviews <span className="flex items-center gap-1 text-base font-semibold"><Star className="h-5 w-5 fill-star text-star" /> 4.9/5 · 128 reviews</span></h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.n} className="grid grid-cols-[minmax(0,1fr)_90px] gap-4 rounded-xl border p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-bold text-accent-foreground">{r.n[0]}</span>
                    <div><p className="font-semibold">{r.n} <span className="ml-1 text-xs font-normal text-muted-foreground">Verified buyer</span></p><Stars className="h-3.5 w-3.5" /></div>
                  </div>
                  <p className="mt-3 text-sm">{r.t}</p>
                </div>
                <img src={r.img} alt="Customer photo" className="h-[90px] w-[90px] rounded-lg object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <a href="#" className="flex items-center gap-1 text-sm font-semibold text-select">View All <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {related.map((p) => (
              <a key={p.n} href="#" className="group overflow-hidden rounded-xl border">
                <div className="aspect-square overflow-hidden bg-muted"><img src={p.img} alt={p.n} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105" /></div>
                <div className="p-3 text-sm"><p className="font-semibold">{p.n}</p><p className="mt-1"><b>₹2,499</b> <span className="text-muted-foreground line-through">₹3,499</span></p></div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary py-8 text-center text-xs text-muted-foreground">© 2026 A.N.J. Designs. All rights reserved.</footer>

      {/* mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t bg-background p-3 lg:hidden">
        <button onClick={() => addToCart()} className="h-11 flex-1 rounded-md border-2 border-primary text-sm font-bold">Add to Cart</button>
        <button onClick={buyNow} className="h-11 flex-1 rounded-md bg-primary text-sm font-bold text-primary-foreground">Buy Now · {inr(PRICE * qty)}</button>
      </div>

      {/* lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-none bg-background p-0">
          <DialogTitle className="sr-only">Product image</DialogTitle>
          {lbIdx >= 0 && (
            <div className="relative">
              <img src={imgs[lbIdx]!.src} alt={imgs[lbIdx]!.alt} className="max-h-[85vh] w-full rounded-lg object-contain" />
              <button onClick={() => setLightbox(imgs[(lbIdx - 1 + imgs.length) % imgs.length]!.i)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background shadow"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setLightbox(imgs[(lbIdx + 1) % imgs.length]!.i)} aria-label="Next" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background shadow"><ChevronRight className="h-5 w-5" /></button>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold">{imgs[lbIdx]!.alt} · {lbIdx + 1}/{imgs.length}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* cart drawer */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader><SheetTitle>Your Cart ({count})</SheetTitle></SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {cart.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Your cart is empty.</p>}
            {cart.map((it) => (
              <div key={it.id} className="flex gap-3 border-b pb-4">
                <img src={front.url} alt="" className="h-20 w-20 rounded-md bg-muted object-cover" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">Custom Varsity Jacket</p>
                  <p className="text-xs text-muted-foreground">{it.color} · {it.size} · "{it.initials}" / "{it.backName}"</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex h-8 items-center rounded border">
                      <button className="px-2" aria-label="Decrease" onClick={() => setCart((c) => c.map((x) => (x.id === it.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-xs font-semibold">{it.qty}</span>
                      <button className="px-2" aria-label="Increase" onClick={() => setCart((c) => c.map((x) => (x.id === it.id ? { ...x, qty: x.qty + 1 } : x)))}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-semibold">{inr(it.qty * PRICE)}</span>
                  </div>
                </div>
                <button aria-label="Remove" onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">{inr(subtotal)}</span></div>
              <p className="text-xs text-muted-foreground">{subtotal >= 1999 ? "You've unlocked free shipping!" : "Shipping calculated at checkout."}</p>
              <button onClick={() => toast("Checkout is coming soon", { description: "Online payment isn't connected yet." })} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground"><Lock className="h-4 w-4" /> Checkout</button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
