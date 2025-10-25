import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productsData from "@/data/productsData.json";
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

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const product = productsData.products.find((p) => p.productId === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images.map((img) => imageMap[img] || img);

  const handleAddToCart = () => {
    const missingAttributes = Object.keys(product.attributes).filter(
      (key) => !selectedAttributes[key]
    );

    if (missingAttributes.length > 0) {
      toast({
        title: "Please select all options",
        description: `You need to select: ${missingAttributes.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity,
      image: images[0],
      selectedAttributes,
    });

    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name} added to your cart`,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4 animate-fade-in">
        <div className="container mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 hover:scale-105 transition-bounce">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4 animate-slide-in-left">
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-elevated group">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      size="icon"
                      variant="secondary"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      size="icon"
                      variant="secondary"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-smooth hover:scale-110 ${
                        currentImageIndex === index
                          ? "border-primary shadow-glow"
                          : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <Badge
                  variant={product.inventory === "In Stock" ? "default" : "secondary"}
                  className="animate-bounce-in"
                >
                  {product.inventory}
                </Badge>
              </div>

              <p className="text-5xl font-bold text-primary animate-scale-in">₹{product.price}</p>

              <p className="text-muted-foreground text-lg">{product.description}</p>

              {/* Attributes Selection */}
              <Card className="shadow-card">
                <CardContent className="p-6 space-y-4">
                  {Object.entries(product.attributes).map(([key, values]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium">{key}</label>
                      <Select
                        value={selectedAttributes[key] || ""}
                        onValueChange={(value) =>
                          setSelectedAttributes({ ...selectedAttributes, [key]: value })
                        }
                      >
                        <SelectTrigger className="transition-smooth hover:border-primary">
                          <SelectValue placeholder={`Select ${key}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {values.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        size="icon"
                        variant="outline"
                        className="hover:scale-110 transition-bounce"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        onClick={() => setQuantity(quantity + 1)}
                        size="icon"
                        variant="outline"
                        className="hover:scale-110 transition-bounce"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full gap-2 shadow-glow hover:shadow-elevated transition-smooth animate-bounce-in"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                <WhatsAppPopup
                  productName={product.name}
                  quantity={quantity}
                  attributes={selectedAttributes}
                />
              </div>

              {/* Specifications */}
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
