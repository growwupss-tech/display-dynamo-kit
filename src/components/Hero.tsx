import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Edit, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import heroDataImport from "@/data/heroData.json";
import heroImagesData from "@/data/heroImages.json";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface HeroImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  images: HeroImage[];
}

interface Slide {
  id: string;
  image: string;
  tagline: string;
  // optional text color for the tagline (defaults to 'white' when missing)
  textColor?: "white" | "purple";
}

export default function Hero() {
  const { isAuthenticated } = useUser();
  const [heroData, setHeroData] = useState<{ slides: Slide[] }>({ slides: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Function to reset the auto-slide timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isEditing && heroData.slides.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
      }, 5000);
    }
  };

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
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [heroData.slides.length, isEditing]);

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
        textColor: (newSlide as Slide).textColor || "white",
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
    resetTimer(); // Reset timer when manually changing slides
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.slides.length) % heroData.slides.length);
    resetTimer(); // Reset timer when manually changing slides
  };

  if (heroData.slides.length === 0) return null;

  const currentSlideData = isEditing ? editedSlides[currentSlide] : heroData.slides[currentSlide];

  return (
    <section className="relative h-[90vh] md:h-screen overflow-hidden group">
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
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img src={slide.image} alt={slide.tagline} className="w-full h-full object-cover" />
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
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">Text color:</span>
                <Button
                  size="sm"
                  variant={editedSlides[currentSlide]?.textColor === "white" ? "default" : "outline"}
                  onClick={() => handleSlideChange(currentSlide, "textColor", "white")}
                  className="bg-white/90 text-black"
                >
                  White
                </Button>
                <Button
                  size="sm"
                  variant={editedSlides[currentSlide]?.textColor === "purple" ? "default" : "outline"}
                  onClick={() => handleSlideChange(currentSlide, "textColor", "purple")}
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                >
                  Purple
                </Button>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(currentSlide, e)}
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>
          ) : (
            <h1
              className={`text-5xl md:text-7xl font-bold animate-scale-in ${
                (currentSlideData.textColor || "white") === "purple"
                  ? "text-purple-400 [text-shadow:2px_2px_8px_rgba(0,0,0,0.6)]"
                  : "text-white [text-shadow:2px_2px_8px_rgba(0,0,0,0.6)]"
              }`}
            >
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
              index === currentSlide ? "w-8 bg-primary shadow-glow" : "w-2 bg-background/50 hover:bg-background/80"
            }`}
          />
        ))}
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="animate-scale-in max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add New Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Input
              placeholder="Tagline"
              value={newSlide.tagline || ""}
              onChange={(e) => setNewSlide({ ...newSlide, tagline: e.target.value })}
              className="text-lg"
            />

            <div className="space-y-4">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedImage(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select image category" />
                </SelectTrigger>
                <SelectContent>
                  {heroImagesData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCategory && (
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {heroImagesData.categories
                      .find((c) => c.id === selectedCategory)
                      ?.images.map((image) => (
                        <Card
                          key={image.id}
                          className={`cursor-pointer transition-all hover:scale-105 ${
                            selectedImage?.id === image.id ? "ring-2 ring-primary ring-offset-2" : ""
                          }`}
                          onClick={() => {
                            setSelectedImage(image);
                            setNewSlide((prev) => ({
                              ...prev,
                              image: image.url,
                            }));
                          }}
                        >
                          <CardContent className="p-2">
                            <img src={image.url} alt={image.title} className="w-full h-32 object-cover rounded-md" />
                            <div className="mt-2 space-y-1">
                              <h3 className="font-medium text-sm">{image.title}</h3>
                              <p className="text-xs text-muted-foreground">{image.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">Text color:</span>
              <Button
                size="sm"
                variant={!newSlide.textColor || newSlide.textColor === "white" ? "default" : "outline"}
                onClick={() => setNewSlide({ ...newSlide, textColor: "white" })}
                className="bg-white/90 text-black"
              >
                White
              </Button>
              <Button
                size="sm"
                variant={newSlide.textColor === "purple" ? "default" : "outline"}
                onClick={() => setNewSlide({ ...newSlide, textColor: "purple" })}
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white"
              >
                Purple
              </Button>
            </div>

            <Button
              onClick={handleAddSlide}
              className="w-full animate-bounce-in"
              disabled={!newSlide.tagline || !newSlide.image}
            >
              Add Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
