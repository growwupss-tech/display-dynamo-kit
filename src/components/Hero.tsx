import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import heroDataImport from "@/data/heroData.json";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const imageMap: Record<string, string> = {
  "hero-1.jpg": hero1,
  "hero-2.jpg": hero2,
  "hero-3.jpg": hero3,
};

interface Slide {
  id: string;
  image: string;
  tagline: string;
}

export default function Hero() {
  const { isAuthenticated } = useUser();
  const [heroData, setHeroData] = useState<{ slides: Slide[] }>({ slides: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({});

  useEffect(() => {
    const stored = localStorage.getItem("heroData");
    if (stored) {
      try {
        setHeroData(JSON.parse(stored));
      } catch (e) {
        setHeroData(heroDataImport);
      }
    } else {
      setHeroData(heroDataImport);
    }
  }, []);

  useEffect(() => {
    if (heroData.slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroData.slides.length]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSlides([...heroData.slides]);
  };

  const handleSave = () => {
    const newData = { slides: editedSlides };
    setHeroData(newData);
    localStorage.setItem("heroData", JSON.stringify(newData));
    setIsEditing(false);
  };

  const handleSlideChange = (index: number, field: keyof Slide, value: string) => {
    const updated = [...editedSlides];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSlides(updated);
  };

  const handleAddSlide = () => {
    if (newSlide.tagline && newSlide.image) {
      const slide: Slide = {
        id: `slide_${Date.now()}`,
        image: newSlide.image,
        tagline: newSlide.tagline,
      };
      setEditedSlides([...editedSlides, slide]);
      setNewSlide({});
      setUploadDialogOpen(false);
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSlideChange(index, "image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.slides.length) % heroData.slides.length);
  };

  if (heroData.slides.length === 0) return null;

  const currentSlideData = isEditing ? editedSlides[currentSlide] : heroData.slides[currentSlide];
  const currentImage = currentSlideData.image.startsWith("data:") 
    ? currentSlideData.image 
    : imageMap[currentSlideData.image] || currentSlideData.image;

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden group">
      {isAuthenticated && !isEditing && (
        <Button
          onClick={handleEdit}
          size="icon"
          className="absolute top-4 right-4 z-10 shadow-elevated animate-bounce-in hover:animate-glow"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {isEditing && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 animate-slide-in-right">
          <Button onClick={() => setUploadDialogOpen(true)} size="icon" variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} size="icon" className="shadow-elevated animate-glow">
            <Save className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsEditing(false)} size="icon" variant="outline">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="relative h-full">
        {heroData.slides.map((slide, index) => {
          const slideImage = slide.image.startsWith("data:") 
            ? slide.image 
            : imageMap[slide.image] || slide.image;
          
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={slideImage}
                alt={slide.tagline}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 animate-fade-in">
          {isEditing ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <Input
                value={editedSlides[currentSlide]?.tagline || ""}
                onChange={(e) => handleSlideChange(currentSlide, "tagline", e.target.value)}
                className="text-4xl md:text-6xl font-bold text-center bg-background/50 backdrop-blur-sm"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(currentSlide, e)}
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent drop-shadow-lg animate-scale-in">
              {currentSlideData.tagline}
            </h1>
          )}
        </div>
      </div>

      <Button
        onClick={prevSlide}
        size="icon"
        variant="secondary"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110 shadow-glow"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        onClick={nextSlide}
        size="icon"
        variant="secondary"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110 shadow-glow"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroData.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-smooth ${
              index === currentSlide
                ? "w-8 bg-primary shadow-glow"
                : "w-2 bg-background/50 hover:bg-background/80"
            }`}
          />
        ))}
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Add New Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tagline"
              value={newSlide.tagline || ""}
              onChange={(e) => setNewSlide({ ...newSlide, tagline: e.target.value })}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewSlide({ ...newSlide, image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button onClick={handleAddSlide} className="w-full animate-bounce-in">
              Add Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
