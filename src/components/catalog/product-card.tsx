import { ImageIcon } from "lucide-react";
import Image from "next/image";

export type ProductCardData = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  isAvailable: boolean;
};

type ProductCardProps = {
  product: ProductCardData;
};

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        ) : (
          <div className="text-muted-foreground/60 flex h-full items-center justify-center">
            <ImageIcon aria-hidden="true" className="size-10" />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
            product.isAvailable
              ? "bg-emerald-100 text-emerald-800"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {product.isAvailable ? "Disponible" : "Agotado"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground font-semibold text-balance">
          {product.name}
        </h3>
        {product.description ? (
          <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
            {product.description}
          </p>
        ) : null}
        <p className="text-primary mt-auto pt-4 text-lg font-bold">
          {moneyFormatter.format(Number(product.price))}
        </p>
      </div>
    </article>
  );
}
