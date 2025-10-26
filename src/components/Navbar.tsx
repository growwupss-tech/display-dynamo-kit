import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import sellerData from "@/data/sellerData.json";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-smooth">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group pl-0">
            <div className="w-12 h-12 rounded-full bg-gradient-hero p-1 shadow-glow group-hover:scale-110 transition-bounce">
              <img
                src={logo}
                alt={sellerData.businessName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-purple-500 hover:text-purple-600 transition-colors">
              {sellerData.businessName}
            </span>
          </Link>

          <Link to="/cart" className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative hover:bg-primary hover:text-primary-foreground transition-smooth group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-bounce" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 animate-bounce-in"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
