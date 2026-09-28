"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Icon } from "@/components/icon";
const links = [
  { href: "/catalogo", label: "Nossas bolachas" },
  { href: "/monte-sua-caixa", label: "Sua seleção" },
  { href: "/#historia", label: "À mesa da Madrinha" },
];
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { totalItens } = useCart();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  if (pathname.startsWith("/admin")) return null;
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="Loja da Madrinha — início"
        >
          <span>loja da</span>
          <strong>
            Madrinha<span className="wordmark-dot">.</span>
          </strong>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/carrinho"
            className="basket-link"
            aria-label={`Ver carrinho, ${totalItens} itens`}
          >
            <Icon name="basket" />
            <span className="basket-label">Sua cesta</span>
            <span className="basket-count">{totalItens}</span>
          </Link>
          <button
            ref={toggle}
            className="icon-button menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Navegação mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <Icon name="arrow" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
