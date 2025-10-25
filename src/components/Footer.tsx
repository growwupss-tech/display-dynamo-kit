import { Mail, Phone, MapPin } from "lucide-react";
import sellerData from "@/data/sellerData.json";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted mt-20 py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {sellerData.businessName}
            </h3>
            <p className="text-muted-foreground">
              Your destination for premium fashion and style.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2 hover:text-primary transition-smooth cursor-pointer">
                <Phone className="h-4 w-4" />
                <span>{sellerData.phone}</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-smooth cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>{sellerData.email}</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-smooth cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>{sellerData.workAddress}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="text-lg font-semibold">Business Info</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Business Type: {sellerData.businessType}</p>
              <p>Owner: {sellerData.name}</p>
              <p className="text-xs">Site ID: {sellerData.siteId}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {sellerData.businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
