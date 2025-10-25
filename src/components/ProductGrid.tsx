import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ViewToggle from "./ViewToggle";
import productsDataImport from "@/data/productsData.json";

type ViewType = "two" | "three" | "list";

interface Product {
  productId: string;
  name: string;
  price: number;
  images: string[];
  inventory: string;
  description: string;
  specifications: string[];
  attributes: Record<string, string[]>;
  videos: string[];
}

export default function ProductGrid() {
  const [viewType, setViewType] = useState<ViewType>("three");
  const [isMobile, setIsMobile] = useState(false);
  const products = productsDataImport.products as Product[];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && viewType === "three") {
        setViewType("two");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [viewType]);

  const gridClass = {
    two: "grid-cols-1 sm:grid-cols-2",
    three: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    list: "grid-cols-1",
  }[viewType];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Our Collection
          </h2>
          <ViewToggle currentView={viewType} onViewChange={setViewType} />
        </div>

        <div className={`grid ${gridClass} gap-6`}>
          {products.map((product, index) => (
            <div
              key={product.productId}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} viewType={viewType} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
