"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PropertyCard } from "./PropertyCard";
import MapPreviewWrapper from "./MapPreviewWrapper";
import { Search, MapPin, Building, ArrowLeft, ArrowUpRight, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHome({ properties, districts }: { properties: any[], districts: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "map">("listings");
  const [scrolled, setScrolled] = useState(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyIdFilter, setPropertyIdFilter] = useState("");
  const [landNumber, setLandNumber] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-text",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
    tl.fromTo(".hero-btn",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );

    gsap.utils.toArray(".fade-up-section").forEach((section: any) => {
      gsap.fromTo(section,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          }
        }
      );
    });
  }, { scope: containerRef });

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.includes(searchTerm);
    const matchesDistrict = selectedDistrict ? p.district === selectedDistrict : true;
    const matchesLandNumber = landNumber ? p.parcel_number?.includes(landNumber) : true;
    const matchesId = propertyIdFilter ? p.id.startsWith(propertyIdFilter) : true;
    // Basic price match (since price is text in this current DB schema)
    const matchesPrice = priceRange ? p.price?.includes(priceRange) : true;
    const matchesType = propertyType ? p.property_type === propertyType : true;

    return matchesSearch && matchesDistrict && matchesLandNumber && matchesId && matchesPrice && matchesType;
  });

  return (
    <div ref={containerRef} className="bg-sand text-charcoal min-h-screen relative font-sans" dir="rtl">

      {/* NAVBAR */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl rounded-cinematic transition-all duration-500 flex items-center justify-between px-8 py-4 ${scrolled ? 'bg-cream/80 backdrop-blur-xl border border-charcoal/10 shadow-2xl' : 'bg-transparent'}`}>
        <div className="font-heading font-bold text-2xl tracking-tight text-deep-brown">عقار الأحساء</div>
        <div className="hidden md:flex items-center gap-8 font-heading text-sm font-bold opacity-70">
          <a href="#discover" className="hover:text-deep-brown transition-colors">العروض</a>
          <a href="#map-experience" className="hover:text-deep-brown transition-colors">قائمة الإعلانات</a>
        </div>
        <a href="#discover" className="btn-cinematic px-8 py-3 bg-charcoal text-cream rounded-cinematic font-heading font-bold tracking-wide text-sm flex items-center gap-2">
          <span className="relative z-10">تصفح الآن</span>
        </a>
      </nav>

      {/* HERO */}
      <header className="relative w-full h-[90dvh] flex items-center justify-center px-4 overflow-hidden rounded-b-[4rem]">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549487950-8bda5a3311af?q=80&w=2671&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-charcoal/40 z-10" />

        <div className="relative z-20 max-w-5xl text-center flex flex-col items-center">
          <div className="hero-text mb-12">
            <img
              src="/logo.png"
              alt="عقار الأحساء"
              className="w-48 md:w-64 lg:w-80 h-auto drop-shadow-2xl"
              onError={(e) => {
                // Fallback if image not found during transition
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('h1');
                  fallback.className = "text-6xl md:text-8xl font-heading font-bold text-cream";
                  fallback.innerText = "عقار الأحساء";
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <div className="hero-btn flex justify-center gap-4">
            <a href="#discover" className="btn-cinematic inline-flex items-center justify-center px-12 py-5 bg-sand text-deep-brown rounded-cinematic font-heading font-bold tracking-wide text-lg">
              <span className="relative z-10">ابدأ البحث</span>
            </a>
          </div>
        </div>
      </header>

      {/* SEARCH BAR MODULE (New requirements: district, type, id, price, land number) */}
      <section id="discover" className="relative z-30 -mt-24 px-4 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="bg-cream p-6 md:p-10 rounded-cinematic shadow-2xl border border-charcoal/5">
          <div className="flex items-center gap-3 mb-8 border-b border-charcoal/10 pb-6">
            <div className="p-3 bg-sand rounded-2xl text-deep-brown"><SlidersHorizontal size={24} /></div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">البحث</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search by Name */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">اسم العقار</label>
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <input
                  type="text" placeholder="ابحث بالعنوان..."
                  className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 pr-10 pl-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-heading text-sm"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* District */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">الحي</label>
              <select
                className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-heading text-sm appearance-none cursor-pointer"
                value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">جميع الأحياء</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            {/* Property ID */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">رقم العقار</label>
              <input
                type="text" placeholder="ID..."
                className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-data text-sm"
                value={propertyIdFilter} onChange={(e) => setPropertyIdFilter(e.target.value)}
              />
            </div>

            {/* Land Number */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">رقم الأرض</label>
              <input
                type="text" placeholder="رقم المخطط/القطعة"
                className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-data text-sm"
                value={landNumber} onChange={(e) => setLandNumber(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">نطاق السعر</label>
              <input
                type="text" placeholder="مثال: 500,000"
                className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-data text-sm"
                value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-bold opacity-40 pr-2">نوع العقار</label>
              <select
                className="w-full bg-sand/20 border border-charcoal/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-deep-brown font-heading text-sm appearance-none cursor-pointer"
                value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">الكل</option>
                <option value="land">ارض</option>
                <option value="apartment">شقه</option>
                <option value="building">عمارة</option>
                <option value="shop">محل</option>
                <option value="house">بيت</option>
                <option value="villa">فيلا</option>
                <option value="duplex">دبلكس</option>
                <option value="farm">مزرعة</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* MAP EXPERIENCE */}
      <section id="map-experience" className="py-20 fade-up-section bg-cream rounded-[3rem] mx-4 md:mx-12 overflow-hidden shadow-2xl relative border border-charcoal/5 mb-20">
        <div className="px-8 md:px-16 mb-10 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold uppercase tracking-tight text-charcoal mb-4">قائمة الإعلانات</h2>
            <p className="font-heading opacity-50">تصفح العروض العقارية المتاحة أو استعرضها عبر الخريطة.</p>
          </div>
          <div className="bg-sand p-1 rounded-full flex">
            <button onClick={() => setActiveTab('listings')} className={`px-8 py-3 rounded-full font-heading font-bold text-sm transition-all duration-500 ${activeTab === 'listings' ? 'bg-charcoal text-cream shadow-xl translate-y-[-2px]' : 'text-charcoal hover:bg-black/5'}`}>قائمة العروض</button>
            <button onClick={() => setActiveTab('map')} className={`px-8 py-3 rounded-full font-heading font-bold text-sm transition-all duration-500 ${activeTab === 'map' ? 'bg-charcoal text-cream shadow-xl translate-y-[-2px]' : 'text-charcoal hover:bg-black/5'}`}>عرض الخريطة</button>
          </div>
        </div>

        <div className="px-8 md:px-16 h-[600px] w-full relative z-0">
          <div className={`absolute inset-0 px-8 md:px-16 transition-all duration-1000 ${activeTab === 'map' ? 'opacity-100 translate-y-0 pointer-events-auto z-20' : 'opacity-0 translate-y-10 pointer-events-none z-0'}`}>
            <div className="w-full h-full rounded-cinematic overflow-hidden shadow-inner border border-charcoal/10 relative">
              <MapPreviewWrapper properties={properties} />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] z-50 rounded-cinematic" />
            </div>
          </div>

          <div className={`absolute inset-0 px-8 md:px-16 pb-12 overflow-y-auto transition-all duration-1000 ${activeTab === 'listings' ? 'opacity-100 translate-y-0 pointer-events-auto z-20' : 'opacity-0 translate-y-10 pointer-events-none z-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LATEST LISTINGS ORDERED BY RECENT */}
      <section className="py-20 px-8 md:px-16 max-w-7xl mx-auto fade-up-section">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-charcoal">أحدث الإضافات</h2>
          <div className="h-[2px] flex-1 bg-charcoal/10 mx-8 hidden lg:block opacity-50" />
          <div className="font-data text-sm tracking-widest opacity-40 uppercase">Latest Assets Detected</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* We assume properties are already sorted by created_at in HomePage, so we just slice first results */}
          {properties.slice(0, 6).map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111] text-cream rounded-t-[4rem] px-8 py-20 relative z-40 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-4xl mb-6 tracking-tight text-sand">عقار الأحساء</h3>
            <p className="font-drama italic text-2xl opacity-70 mb-10 max-w-md">   نسعد بخدمتكم</p>
            <div className="flex items-center gap-4 bg-white/5 inline-flex px-8 py-4 rounded-full border border-white/5">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-wider opacity-80">نظام التشغيل نشط</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-sand mb-8 border-b border-white/10 pb-4">تواصل مباشر</h4>
            <div className="space-y-6">
              <div className="group">
                <a href="tel:+966591538123" className="block font-heading text-lg font-bold hover:text-sand transition-colors">ماجد النوبي</a>
                <div className="text-sm font-data opacity-40 mt-1">+966 59 153 8123</div>
              </div>
              <div className="group">
                <a href="tel:+966533463116" className="block font-heading text-lg font-bold hover:text-sand transition-colors">مازن الدريويش</a>
                <div className="text-sm font-data opacity-40 mt-1">+966 53 346 3116</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-sand mb-8 border-b border-white/10 pb-4">الترخيص النظامي</h4>
            <p className="font-heading opacity-50 text-sm mb-2">رقم رخصة فال العقارية:</p>
            <p className="font-data text-2xl text-white font-bold tracking-widest">1100218438</p>
            <div className="mt-16 opacity-30 font-heading text-xs">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <br />ماجد النوبي للعقار
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
