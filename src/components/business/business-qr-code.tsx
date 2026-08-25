"use client";

import { Download, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BusinessQrCodeProps = {
  businessName: string;
  slug: string;
  url: string;
};

export function BusinessQrCode({
  businessName,
  slug,
  url,
}: BusinessQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#17211b", light: "#ffffff" },
    }).then((value) => {
      if (active) setDataUrl(value);
    });

    return () => {
      active = false;
    };
  }, [url]);

  return (
    <section className="bg-card rounded-2xl border p-6">
      <div className="flex items-center gap-3">
        <QrCode aria-hidden="true" className="text-primary size-5" />
        <h2 className="text-foreground text-lg font-bold">Código QR</h2>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        Escanéalo para abrir este perfil desde otro dispositivo.
      </p>

      <div className="bg-white mt-5 flex aspect-square items-center justify-center overflow-hidden rounded-xl border p-3">
        {dataUrl ? (
          <Image
            src={dataUrl}
            alt={`Código QR del perfil de ${businessName}`}
            width={320}
            height={320}
            unoptimized
            className="size-full"
          />
        ) : (
          <span className="text-muted-foreground text-sm">Generando QR…</span>
        )}
      </div>

      {dataUrl ? (
        <a
          href={dataUrl}
          download={`${slug}-qr.png`}
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}
        >
          <Download aria-hidden="true" data-icon="inline-start" />
          Descargar QR
        </a>
      ) : null}
    </section>
  );
}
