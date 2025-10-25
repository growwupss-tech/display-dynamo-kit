import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import sellerData from "@/data/sellerData.json";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleWhatsAppEnquiry = () => {
    const itemsText = cartItems
      .map((item) => {
        const attributesText = Object.entries(item.selectedAttributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        return `${item.name} (${item.quantity}x) - ${attributesText}`;
      })
      .join("\n");

    const message = `Hi! I want to order:\n\n${itemsText}\n\nTotal: ₹${getCartTotal()}\n\nPlease confirm availability and payment details.`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = sellerData.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground animate-float" />
            <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg">
              Add some amazing products to get started!
            </p>
            <Link to="/">
              <Button size="lg" className="animate-bounce-in shadow-glow">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4 animate-fade-in">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Shopping Cart
          </h1>

          <div className="space-y-4 mb-8">
            {cartItems.map((item, index) => (
              <Card
                key={item.productId}
                className="overflow-hidden hover:shadow-elevated transition-smooth animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {Object.entries(item.selectedAttributes).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 hover:scale-110 transition-bounce"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 hover:scale-110 transition-bounce"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold text-primary">
                            ₹{item.price * item.quantity}
                          </p>
                          <Button
                            onClick={() => handleRemove(item.productId)}
                            size="icon"
                            variant="destructive"
                            className="hover:scale-110 transition-bounce animate-glow"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-elevated sticky bottom-4 animate-bounce-in">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-3xl font-bold">
                <span>Total:</span>
                <span className="text-primary">₹{getCartTotal()}</span>
              </div>

              <Button
                onClick={handleWhatsAppEnquiry}
                size="lg"
                className="w-full gap-2 bg-green-500 hover:bg-green-600 shadow-glow hover:shadow-elevated transition-smooth"
              >
                <MessageCircle className="h-5 w-5" />
                Enquiry on WhatsApp
              </Button>

              <Link to="/" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
