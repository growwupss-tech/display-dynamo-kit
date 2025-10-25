import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit, Save, Plus, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/context/UserContext";
import storiesDataImport from "@/data/storiesData.json";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import story3 from "@/assets/story-3.jpg";

const imageMap: Record<string, string> = {
  "story-1.jpg": story1,
  "story-2.jpg": story2,
  "story-3.jpg": story3,
};

interface Story {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface StoriesData {
  visible: boolean;
  title: string;
  stories: Story[];
}

export default function Stories() {
  const { isAuthenticated } = useUser();
  const [storiesData, setStoriesData] = useState<StoriesData>({ visible: true, title: "Our Story", stories: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<StoriesData>({ visible: true, title: "Our Story", stories: [] });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newStory, setNewStory] = useState<Partial<Story>>({});

  useEffect(() => {
    const stored = localStorage.getItem("storiesData");
    if (stored) {
      try {
        setStoriesData(JSON.parse(stored));
      } catch (e) {
        setStoriesData(storiesDataImport);
      }
    } else {
      setStoriesData(storiesDataImport);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...storiesData });
  };

  const handleSave = () => {
    setStoriesData(editedData);
    localStorage.setItem("storiesData", JSON.stringify(editedData));
    setIsEditing(false);
  };

  const toggleVisibility = () => {
    const newData = { ...editedData, visible: !editedData.visible };
    setEditedData(newData);
  };

  const handleAddStory = () => {
    if (newStory.title && newStory.description && newStory.image) {
      const story: Story = {
        id: `story_${Date.now()}`,
        title: newStory.title,
        description: newStory.description,
        image: newStory.image,
      };
      setEditedData({
        ...editedData,
        stories: [...editedData.stories, story],
      });
      setNewStory({});
      setUploadDialogOpen(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("stories-container");
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!storiesData.visible && !isEditing) return null;

  const displayData = isEditing ? editedData : storiesData;
  const visibleStories = displayData.stories.slice(0, isEditing ? displayData.stories.length : Math.min(4, displayData.stories.length));
  const hasMoreStories = displayData.stories.length > 4;

  return (
    <section className="py-16 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          {isEditing ? (
            <Input
              value={editedData.title}
              onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              className="text-4xl font-bold max-w-md"
            />
          ) : (
            <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {displayData.title}
            </h2>
          )}

          {isAuthenticated && !isEditing && (
            <Button onClick={handleEdit} size="icon" className="shadow-elevated animate-bounce-in">
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {isEditing && (
            <div className="flex gap-2 animate-slide-in-right">
              <Button onClick={toggleVisibility} size="icon" variant="outline">
                {editedData.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button onClick={() => setUploadDialogOpen(true)} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={handleSave} size="icon" className="shadow-elevated">
                <Save className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsEditing(false)} size="icon" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative group">
          {hasMoreStories && (
            <>
              <Button
                onClick={() => scroll("left")}
                size="icon"
                variant="secondary"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-smooth shadow-glow"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => scroll("right")}
                size="icon"
                variant="secondary"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-smooth shadow-glow"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div
            id="stories-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayData.stories.map((story, index) => {
              const storyImage = story.image.startsWith("data:")
                ? story.image
                : imageMap[story.image] || story.image;

              return (
                <Card
                  key={story.id}
                  className="flex-shrink-0 w-80 overflow-hidden hover:shadow-elevated transition-smooth group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={storyImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  </div>
                  <CardContent className="p-6">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={story.title}
                          onChange={(e) => {
                            const updated = [...editedData.stories];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setEditedData({ ...editedData, stories: updated });
                          }}
                          placeholder="Title"
                        />
                        <Textarea
                          value={story.description}
                          onChange={(e) => {
                            const updated = [...editedData.stories];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setEditedData({ ...editedData, stories: updated });
                          }}
                          placeholder="Description"
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const updated = [...editedData.stories];
                                updated[index] = { ...updated[index], image: reader.result as string };
                                setEditedData({ ...editedData, stories: updated });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
                          {story.title}
                        </h3>
                        <p className="text-muted-foreground">{story.description}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="animate-scale-in">
            <DialogHeader>
              <DialogTitle>Add New Story</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newStory.title || ""}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newStory.description || ""}
                onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewStory({ ...newStory, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button onClick={handleAddStory} className="w-full animate-bounce-in">
                Add Story
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
