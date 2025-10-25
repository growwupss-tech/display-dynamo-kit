import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import sellerData from "@/data/sellerData.json";

interface WhatsAppPopupProps {
  productName: string;
  quantity: number;
  attributes: Record<string, string>;
}

export default function WhatsAppPopup({ productName, quantity, attributes }: WhatsAppPopupProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const generateMessage = () => {
    const attributesText = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    return `Hi! I'm interested in:\n\nProduct: ${productName}\nQuantity: ${quantity}\n${attributesText}\n\nPlease let me know the availability and payment details.`;
  };

  const handleOpen = () => {
    setMessage(generateMessage());
    setOpen(true);
  };

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = sellerData.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-full gap-2 shadow-glow hover:shadow-elevated transition-smooth animate-bounce-in"
        size="lg"
      >
        <MessageCircle className="h-5 w-5" />
        Enquiry on WhatsApp
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Send WhatsApp Message
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="resize-none"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleSend}
                className="flex-1 gap-2 bg-green-500 hover:bg-green-600 animate-bounce-in"
              >
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
