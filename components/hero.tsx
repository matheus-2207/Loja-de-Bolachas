"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
export function Hero() {
  const photo = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    try {
      if (!reduced.matches && !sessionStorage.getItem("madrinha:intro")) {
        setIntro(true);
        sessionStorage.setItem("madrinha:intro", "seen");
      }
    } catch {
      /* A loja continua acessível sem armazenamento. */
    }
    const element = section.current;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType !== "mouse" || !element) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        photo.current?.style.setProperty(
          "--drift-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`,
        );
        photo.current?.style.setProperty(
          "--drift-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`,
        );
      });
    };
    const reset = () => {
      photo.current?.style.setProperty("--drift-x", "0px");
      photo.current?.style.setProperty("--drift-y", "0px");
    };
    element?.addEventListener("pointermove", move);
    element?.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      element?.removeEventListener("pointermove", move);
      element?.removeEventListener("pointerleave", reset);
    };
  }, []);
  useEffect(() => {
    if (!intro) return;
    const timer = setTimeout(() => setIntro(false), 1600);
    return () => clearTimeout(timer);
  }, [intro]);
  return (
    <section
      ref={section}
      className={`hero ${intro ? "hero-enter" : ""}`}
      aria-labelledby="hero-title"
    >
      <div className="hero-photo" ref={photo}>
        <Image
          src="/images/mesa-madrinha.jpg"
          alt="Composição editorial de bolachas de chocolate em relevo, sobre cerâmica e linho"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-wash" />
      <div className="container-pagina hero-content">
        <h1 id="hero-title">
          Um pequeno
          <br />
          ritual.
          <br />
          <em>Muito sabor.</em>
        </h1>
        <p>
          Bolachas artesanais para acompanhar
          <br className="desktop-break" /> os momentos que merecem uma pausa.
        </p>
        <Link className="btn-primario" href="/catalogo">
          Escolher minhas bolachas <Icon name="arrow" />
        </Link>
        <span className="hero-origin">
          Feitas em Curitiba. Para a sua mesa.
        </span>
      </div>
      <div className="hero-foot">
        <a href="#selecao">
          Descubra a Madrinha <span>↓</span>
        </a>
        <span>Composição editorial a partir das nossas bolachas</span>
      </div>
      {intro && (
        <button className="skip-intro" onClick={() => setIntro(false)}>
          Pular animação
        </button>
      )}
    </section>
  );
}
