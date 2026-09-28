"use client";
import { useEffect, useState } from "react";
import { shippingForCep } from "@/lib/store";
export function useShipping(cep: string) {
  const [state, setState] = useState({
    loading: false,
    frete: null as number | null,
    street: "",
    neighborhood: "",
    location: "",
    message: "",
    invalid: false,
    resolvedCep: "",
  });
  const clean = cep.replace(/\D/g, "");
  useEffect(() => {
    const controller = new AbortController();
    if (clean.length !== 8) {
      setState({
        loading: false,
        frete: null,
        street: "",
        neighborhood: "",
        location: "",
        message: "",
        invalid: false,
        resolvedCep: "",
      });
      return;
    }
    setState({
      loading: true,
      frete: null,
      street: "",
      neighborhood: "",
      location: "",
      message: "",
      invalid: false,
      resolvedCep: "",
    });
    let timeout: ReturnType<typeof setTimeout>;
    const timer = setTimeout(async () => {
      timeout = setTimeout(() => {
        controller.abort();
        setState({
          loading: false,
          frete: shippingForCep(clean),
          street: "",
          neighborhood: "",
          location: "",
          message:
            "A busca demorou mais que o esperado. Confira seu CEP e preencha o endereço manualmente.",
          invalid: false,
          resolvedCep: clean,
        });
      }, 8000);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${clean}/json/`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("CEP indisponível");
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (data.erro) {
          setState({
            loading: false,
            frete: null,
            street: "",
            neighborhood: "",
            location: "",
            message: "CEP não encontrado. Confira os oito números.",
            invalid: true,
            resolvedCep: clean,
          });
          return;
        }
        setState({
          loading: false,
          frete: shippingForCep(clean),
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          location: `${data.localidade} · ${data.uf}`,
          message: "",
          invalid: false,
          resolvedCep: clean,
        });
        try {
          localStorage.setItem("@LojaMadrinha:cep", clean);
        } catch {
          /* Opcional. */
        }
      } catch {
        if (controller.signal.aborted) return;
        setState({
          loading: false,
          frete: shippingForCep(clean),
          street: "",
          neighborhood: "",
          location: "",
          message:
            "A busca de endereço está indisponível. Confira seu CEP e preencha o endereço manualmente. Confirme a entrega com a loja.",
          invalid: false,
          resolvedCep: clean,
        });
      } finally {
        clearTimeout(timeout);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [clean]);
  return state.resolvedCep && state.resolvedCep !== clean
    ? { ...state, frete: null, street: "", neighborhood: "", location: "" }
    : state;
}
export const formatCep = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
