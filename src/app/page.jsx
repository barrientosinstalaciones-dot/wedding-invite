"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Send, Heart, Image as ImageIcon, Gift, Play, Pause, Shirt } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Next.js App Router – Página única
 * Ruta: /app/page.jsx
 * -------------------------------------------------
 * ✅ Hero con borde curvo + sombra (SVG clipPath + drop-shadow)
 * ✅ Onda decorativa inferior (ACCENT)
 * ✅ Cuenta regresiva 21/02/2026 (tarde/noche, -03:00)
 * ✅ RSVP + .ics + Google Calendar
 * ✅ Galería estilo Polaroid
 * ✅ Música de fondo con botón Play/Pause
 */

const EVENT = {
  couple: "Jacqueline & Braian",
  start: new Date("2026-02-21T17:00:00-03:00"),
  end: new Date("2026-02-22T02:00:00-03:00"),
  timezone: "America/Argentina/Buenos_Aires",
  title: "Boda de Jacqueline & Braian",
  location: "Lugar a confirmar, Buenos Aires, Argentina",
  notes: "Este día especial será aún más único con tu compañía.",
};

// Estilo y contenido del HERO 
const ACCENT = "#e5905e"; // durazno/salmón
const QUOTE = "Queremos que seas parte del capítulo más importante de nuestra historia.";
const QUOTE2 = "¡Nos casamos!";
const NAMES = EVENT.couple.split("&").map((s) => s.trim());

// 👉 Reemplazar por tu formulario real
const RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeN676HNrBoiZBcpUEOIPDOuWXZvnEV74snclkI2Fn7DSKLCw/viewform";

// 👉 Portada (podés mover a /public y usar "/cover.jpg")
const COVER_URL = "/IMG_4563.jpg";

// Galería (usando imágenes en /public)
const GALLERY = [
  { type: "image", src: "/IMG_7273.jpg", alt: "Nosotros 1", caption: "Decidimos estar juntos" },
  { type: "image", src: "/77.jpg", alt: "Nosotros 2", caption: "Soñamos con un futuro compartido" },
  { type: "video", src: "/video4.MP4", alt: "Nosotros 3", caption: "Construimos recuerdos en cada viaje" },
  { type: "image", src: "/55.jpg", alt: "Nosotros 4", caption: "Aprendimos a ser equipo en lo bueno y lo difícil" },
  { type: "image", src: "/nueva1.jpg", alt: "Nosotros 5", caption: "Elegimos apoyarnos y crecer lado a lado" },
  { type: "image", src: "/nueva2.jpg", alt: "Nosotros 6", caption: "Descubrimos que el amor está en los pequeños detalles" },
  { type: "video", src: "/video2.MOV", alt: "Nosotros 7", caption: "Compartimos risas, proyectos y sueños" },
  { type: "video", src: "/video3.MOV", alt: "Nosotros 8", caption: "Un día dijimos “sí, para siempre”" },
  { type: "image", src: "/FOTO05.JPG", alt: "Nosotros 9", caption: "Y hoy queremos celebrarlo con vos" },
];

function useCountdown(targetDate) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, finished: diff <= 0 };
}

function toICSDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mi = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cuatrouno//Invitacion Boda//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(EVENT.start)}`,
    `DTEND:${toICSDate(EVENT.end)}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.notes}`,
    `LOCATION:${EVENT.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Boda-Jacqueline-Braian.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function googleCalendarUrl() {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = encodeURIComponent(EVENT.title);
  const dates = `${toICSDate(EVENT.start)}/${toICSDate(EVENT.end)}`;
  const details = encodeURIComponent(EVENT.notes);
  const location = encodeURIComponent(EVENT.location);
  return `${base}&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

export default function Page() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT.start);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const whatsappShare = () => {
    const text = encodeURIComponent(
      `💍 ${EVENT.title}

${EVENT.notes}

📅 ${EVENT.start.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })} – ${EVENT.start.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
📍 ${EVENT.location}

Confirmá tu asistencia: ${RSVP_URL}

${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const ROT = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"];

  // =====================
  // 🎵 Música de fondo
  // =====================
  const AUDIO_SRC = "/music.mp3"; // poné tu archivo en /public
  const [audioEl, setAudioEl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);

  // Crear <audio> y primer intento de autoplay
  useEffect(() => {
  const el = new Audio(AUDIO_SRC);
  el.loop = true;
  el.preload = "auto";
  setAudioEl(el);

  // intento de autoplay
  el.play().then(() => {
    setIsPlaying(true);
    setCanAutoplay(true);
  }).catch(() => {
    // bloqueado por políticas del navegador
    setCanAutoplay(false);
  });

  return () => {
    el.pause();
    setIsPlaying(false);
  };
}, []);

  // En el primer toque/scroll/tecla, tratamos de iniciar si quedó bloqueado
  useEffect(() => {
    if (!audioEl || isPlaying) return;
    const tryStart = () => {
      audioEl.play().then(() => {
        setIsPlaying(true);
        cleanup();
      }).catch(() => {});
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", tryStart, { passive: true });
      window.removeEventListener("keydown", tryStart);
      window.removeEventListener("scroll", tryStart, { passive: true });
    };
    window.addEventListener("pointerdown", tryStart, { passive: true });
    window.addEventListener("keydown", tryStart);
    window.addEventListener("scroll", tryStart, { passive: true });
    return cleanup;
  }, [audioEl, isPlaying]);

  const toggleMusic = async () => {
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioEl.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  const [showGifts, setShowGifts] = useState(false);

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copiado ✔");
  } catch {}
};

  return (
    <div className="min-h-screen bg-[#f6f5ef] text-neutral-800">
      {/* HERO */}
      <section className="relative overflow-hidden">
  <div className="grid min-h-[90dvh] grid-cols-1 md:grid-cols-2">
    {/* FOTO full-bleed con borde curvo y sombra */}
    <div className="relative order-2 md:order-1">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id="clip-curve">
            {/* curva derecha tipo “onda” */}
            <path d="M0,0 H780 Q1000,500 780,1000 H0 Z" />
          </clipPath>
          <filter id="edgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>

        {/* imagen recortada */}
       {/* Imagen para mobile (ajustada para que se vean las caras) */}
            <image
              href="/IMG_4592.jpg"
              width="1200"                 
              height="1200"
              x="-80"
              y="80"                   
              clipPath="url(#clip-curve)"
              preserveAspectRatio="xMidYMin slice"
              className="block md:hidden"
            />

          {/* Imagen para desktop */}
          <image
            href="/IMG_4563.jpg"
            width="1000"
            height="1000"
            clipPath="url(#clip-curve)"
            preserveAspectRatio="xMidYMid slice"
            className="hidden md:block"
          />

        {/* borde + sombra para relieve */}
        <path
          d="M780,0 Q1000,500 780,1000"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="12"
          filter="url(#edgeShadow)"
        />
      </svg>

      {/* Onda decorativa inferior */}
          <svg
            className="pointer-events-none absolute -bottom-6 left-0 h-16 w-[68%]"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C220,120 420,20 650,60 C780,84 890,96 1000,98 L1000,100 L0,100 Z"
              fill={ACCENT}
              opacity="0.85"
            />
          </svg>

          {/* asegura altura en mobile */}
          <div className="pb-[40%] md:pb-0 md:min-h-[90dvh]" />
        </div>


          {/* Lado derecho: fecha, contador, nombres y cita */}
          <div className="relative order-1 flex flex-col items-center justify-center px-8 py-16 text-center md:order-2">
            {/* Decor superior (floral opcional) */}
            {/* <img
              src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop"
              alt="Decor floral"
              className="pointer-events-none absolute -top-6 right-6 hidden h-28 w-auto select-none rounded-xl opacity-90 md:block"
              style={{
                maskImage: "linear-gradient(black, transparent)",
                WebkitMaskImage: "linear-gradient(black, transparent)",
              }}
            /> */}

            {/* Fecha en cajita */}
              <div></div>

            {/* Countdown compacto */}
            <div className="mb-12 grid max-w-xs grid-cols-4 gap-2 text-center">
              {[{ label: "DÍAS", value: days }, { label: "HORAS", value: hours }, { label: "MIN", value: minutes }, { label: "SEG", value: seconds }].map(
                ({ label, value }) => (
                  <div key={label} className="rounded-xl border px-3 py-2" style={{ borderColor: ACCENT }}>
                    <div className="text-xl font-semibold tabular-nums">{value.toString().padStart(2, "0")}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest text-neutral-600">{label}</div>
                  </div>
                )
              )}
            </div>

            {/* Cita */}
              <div className="max-w-xl text-lg text-neutral-700">
                <p className="leading-relaxed italic text-lg font-serif">
                  {QUOTE2}
                </p>
              </div>

            {/* Nombres con ampersand gigante */}
            <div className="relative flex flex-col items-center text-center">
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ color: ACCENT, opacity: 0.35, fontSize: "10rem", lineHeight: 1 }}
              >
                &
              </span>
              <h1 className="relative z-10 font-serif text-6xl leading-none sm:text-7xl md:text-8xl">{NAMES[0]}</h1>
              <h1 className="relative z-10 mt-2 font-serif text-6xl leading-none sm:text-7xl md:text-8xl">{NAMES[1]}</h1>
            </div>

            {/* Cita */}
              <div className="mt-8 mb-8 max-w-xl text-lg text-neutral-700">
                <p className="leading-relaxed italic text-lg font-serif">
                  <span className="text-3xl" style={{ color: ACCENT }}>
                    “
                  </span>
                  {QUOTE}
                  <span className="text-3xl" style={{ color: ACCENT }}>
                    ”
                  </span>
                </p>
              </div>

            {/* Fecha en cajita */}
            <div
              className="mb-4 inline-block rounded-md border-2 bg-white/70 px-4 py-2 font-semibold tracking-widest"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              {(() =>
                EVENT.start
                  .toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
                  .replaceAll("/", "."))()}
            </div>

            

            {/* Acciones: RSVP / Calendar (comentadas por ahora) */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {/* Botones opcionales aquí */}
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mt-4 leading-relaxed text-neutral-600">
              Nuestra historia comenzó casi sin planearlo: un tatuaje, una charla, y de pronto horas que se hicieron días y noches. 
              Descubrimos que estábamos a una cuadra de distancia, pero mucho más cerca en destino. Reímos, viajamos, emprendimos 
              y construimos un mundo en común.
            </p>

            <div className="my-6 text-center text-4xl">💍</div>

            <p className="mt-4 leading-relaxed text-neutral-600">
              En el camino nos comprometimos a amarnos, cuidarnos, acompañarnos y estar siempre el uno para el otro. 
              Y por eso, elegimos dar el siguiente paso: festejar nuestra boda junto a quienes más queremos.
              <span className="inline-flex items-center gap-1 pl-1 text-neutral-800">
                <Heart size={16} />
              </span>
            </p>
          </motion.div>
        </section>

      {/* BANNER de ancho completo */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img
          src="/IMG_4849_anillo.jpg"        
          alt="Banner boda"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* capa de oscurecido opcional */}
      </section>

      {/* GALERÍA POLAROID */}
      <section className="bg-[#f6f5ef] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-6 text-center font-serif text-3xl">Momentos</h3>
          <p className="mx-auto mb-8 max-w-2xl text-center text-neutral-600">
            Algunos recuerdos que queremos compartir con vos. 
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
  {GALLERY.map((item, i) => (
    <div
      key={i}
      className={`group relative mx-auto w-64 rounded-[6px] border border-neutral-200 bg-white px-3 pt-3 pb-10 shadow-lg shadow-neutral-300/50 ${ROT[i % ROT.length]} transition-transform duration-300 hover:rotate-0`}
    >
      <span className="absolute left-1/2 top-1 h-5 w-16 -translate-x-1/2 rotate-[-6deg] rounded-sm bg-neutral-200/80" />
      
      {item.type === "image" ? (
        <img
          src={item.src}
          alt={item.alt}
          className="h-64 w-full rounded-[4px] object-cover"
        />
      ) : (
        <video
          src={item.src}
          className="h-64 w-full rounded-[4px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      <div className="mt-3 text-center">
        <span className="text-sm font-medium text-neutral-700">{EVENT.couple}</span>
        <div className="mt-1 text-[12px] italic text-neutral-600">
    {item.caption}
  </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* INFO DEL EVENTO */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-700">
              <Calendar size={18} /> Fecha
            </div>
            <p className="mt-2 text-lg">Sábado 21 de febrero de 2026</p>
            <p className="text-sm text-neutral-500">Horario: 17:00 hs</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-700">
              <MapPin size={18} /> Lugar
            </div>
            <p className="mt-2 text-lg">A confirmar</p>
            <p className="text-sm text-neutral-500">Te avisamos por whatsapp. ¡Asi que es importante que pongas tu contacto!</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-700">
              <Shirt size={18} /> Dress code 
            </div>
            <p className="mt-2 text-lg">Elegante Sport</p>
            <p className="text-sm text-neutral-500">Vestimenta elegante, sin perder comodidad.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
  <div className="flex items-center gap-2 text-neutral-700">
    <Gift size={18} /> Regalos
  </div>

  <p className="mt-2 text-lg">Tu presencia es el mejor regalo</p>
  <p className="text-sm text-neutral-500">
    Si aun así deseás hacernos un obsequio especial, te dejamos una opción para acompañarnos en esta nueva etapa.
  </p>

  {/* Toggle para mobile/desktop */}
  <button
    type="button"
    onClick={() => setShowGifts((v) => !v)}
    aria-expanded={showGifts}
    className="mt-3 text-sm font-medium text-neutral-700 underline underline-offset-4"
  >
    Ver más
  </button>

  {/* Panel colapsable */}
  <div
    className={`overflow-hidden transition-all duration-300 ${
      showGifts ? "max-h-40 mt-3" : "max-h-0"
    }`}
  >
    <div className="rounded-lg bg-neutral-900 p-4 text-white shadow">
      <p className="text-sm">
        <span className="opacity-80">CBU:</span>{" "}
        <span className="font-mono">1430001713025578390018</span>
        <button
          onClick={() => copy("1430001713025578390018")}
          className="ml-2 rounded-md bg-white/10 px-2 py-0.5 text-xs"
        >
          Copiar
        </button>
      </p>
      <p className="mt-1 text-sm">
        <span className="opacity-80">ALIAS:</span>{" "}
        <span className="font-mono">jacquiBrai</span>
        <button
          onClick={() => copy("jacquiBrai")}
          className="ml-2 rounded-md bg-white/10 px-2 py-0.5 text-xs"
        >
          Copiar
        </button>
      </p>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* VIDEO HORIZONTAL FULL-WIDTH */}
      <section className="relative w-full overflow-hidden aspect-[16/9] mb-20">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/0915.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-3xl bg-neutral-900 p-8 text-white">
          <h3 className="font-serif text-2xl">Este día especial será aún más único con tu compañía</h3>
          <p className="mt-2 text-neutral-300">Por favor, confirmá asistencia para organizar todo con amor y detalle.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Acciones: RSVP / Calendar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("rsvp");
                  if (!target) return;

                  const start = window.scrollY;
                  const end = target.offsetTop;
                  const duration = 800;
                  let startTime = null;

                  const animate = (time) => {
                    if (!startTime) startTime = time;
                    const progress = Math.min((time - startTime) / duration, 1);
                    const ease = progress < 0.5
                      ? 4 * progress * progress * progress
                      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    window.scrollTo(0, start + (end - start) * ease);
                    if (progress < 1) requestAnimationFrame(animate);
                  };

                  requestAnimationFrame(animate);
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 font-medium text-white shadow hover:scale-[1.01] active:scale-[.99]"
              >
                <Send size={18} /> Confirmar asistencia
              </a>

              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-400 bg-white px-5 py-3 font-medium text-neutral-800 hover:bg-neutral-50"
              >
                <Calendar size={18} /> Agenda en Google Calendar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP – Google Form embebido */}
      <section id="rsvp" className="w-full px-0 py-16">
        <h2 className="mb-8 text-center font-serif text-3xl text-neutral-800">
          Confirmá tu asistencia
        </h2>

        <div className="w-full overflow-hidden rounded-none shadow ring-1 ring-neutral-200">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeN676HNrBoiZBcpUEOIPDOuWXZvnEV74snclkI2Fn7DSKLCw/viewform?embedded=true"
            width="100%"
            height="950"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="w-full"
          >
            Cargando…
          </iframe>
        </div>
      </section>

      {/* Botón flotante de música */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-neutral-900 p-3 text-white shadow-lg hover:scale-[1.03] active:scale-[.98] transition"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <footer className="pb-10 text-center text-xs text-neutral-400">© 2026 {EVENT.couple} — Hecho con ♥</footer>
    </div>
  );
}
