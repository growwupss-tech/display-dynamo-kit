import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const imageMap: Record<string, string> = {
  "product-1.jpg": product1,
  "product-2.jpg": product2,
  "product-3.jpg": product3,
  "product-4.jpg": product4,
  "product-5.jpg": product5,
  "product-6.jpg": product6,
};

interface Product {
  productId: string;
  name: string;
  price: number;
  images: string[];
  inventory: string;
}

interface ProductCardProps {
  product: Product;
  viewType: "two" | "three" | "list";
}

export default function ProductCard({ product, viewType }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images.map((img) => imageMap[img] || img);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (viewType === "list") {
    return (
      <Link to={`/product/${product.productId}`}>
        <Card className="overflow-hidden hover:shadow-elevated transition-smooth group animate-fade-in">
          <div className="flex gap-4 p-4">
            <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
              />
              <Badge
                variant={product.inventory === "In Stock" ? "default" : "secondary"}
                className="absolute top-2 right-2 animate-bounce-in"
              >
                {product.inventory}
              </Badge>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-primary mt-2">₹{product.price}</p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.productId}`}>
      <Card className="overflow-hidden hover:shadow-elevated transition-smooth group animate-scale-in">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
          <Badge
            variant={product.inventory === "In Stock" ? "default" : "secondary"}
            className="absolute top-4 right-4 animate-bounce-in shadow-glow"
          >
            {product.inventory}
          </Badge>
          
          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                size="icon"
                variant="secondary"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextImage}
                size="icon"
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-primary">₹{product.price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
