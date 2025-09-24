import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quote, Home, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface CitationData {
  author: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  accessDate?: string;
}

const CitationGenerator = () => {
  const [citationData, setCitationData] = useState<CitationData>({
    author: "",
    title: "",
    year: "",
    publisher: "",
    url: "",
    journal: "",
    volume: "",
    pages: "",
    accessDate: ""
  });

  const [sourceType, setSourceType] = useState<"book" | "website" | "journal">("book");

  const updateField = (field: keyof CitationData, value: string) => {
    setCitationData(prev => ({ ...prev, [field]: value }));
  };

  const generateMLA = () => {
    const { author, title, publisher, year, url, accessDate, journal, volume, pages } = citationData;
    
    if (sourceType === "book") {
      return `${author}. ${title}. ${publisher}, ${year}.`;
    } else if (sourceType === "website") {
      const access = accessDate ? new Date(accessDate).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) : "Date";
      return `${author}. "${title}." Web. ${access}. <${url}>.`;
    } else if (sourceType === "journal") {
      return `${author}. "${title}." ${journal} ${volume} (${year}): ${pages}.`;
    }
    return "";
  };

  const generateAPA = () => {
    const { author, title, publisher, year, url, journal, volume, pages } = citationData;
    
    if (sourceType === "book") {
      return `${author} (${year}). ${title}. ${publisher}.`;
    } else if (sourceType === "website") {
      return `${author} (${year}). ${title}. Retrieved from ${url}`;
    } else if (sourceType === "journal") {
      return `${author} (${year}). ${title}. ${journal}, ${volume}, ${pages}.`;
    }
    return "";
  };

  const generateChicago = () => {
    const { author, title, publisher, year, url, accessDate, journal, volume, pages } = citationData;
    
    if (sourceType === "book") {
      return `${author}. ${title}. ${publisher}, ${year}.`;
    } else if (sourceType === "website") {
      const access = accessDate ? new Date(accessDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }) : "Date";
      return `${author}. "${title}." Accessed ${access}. ${url}.`;
    } else if (sourceType === "journal") {
      return `${author}. "${title}." ${journal} ${volume} (${year}): ${pages}.`;
    }
    return "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Citation copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Intellia</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Quote className="h-8 w-8 text-primary" />
              Citation Generator
            </h1>
            <p className="text-xl text-muted-foreground">
              Create MLA, APA, or Chicago-style references from your sources
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Source Information</CardTitle>
                <CardDescription>
                  Enter details about your source to generate citations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Source Type Selector */}
                <div>
                  <Label>Source Type</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={sourceType === "book" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSourceType("book")}
                    >
                      Book
                    </Button>
                    <Button
                      variant={sourceType === "website" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSourceType("website")}
                    >
                      Website
                    </Button>
                    <Button
                      variant={sourceType === "journal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSourceType("journal")}
                    >
                      Journal
                    </Button>
                  </div>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Smith, John"
                      value={citationData.author}
                      onChange={(e) => updateField("author", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      placeholder="2023"
                      value={citationData.year}
                      onChange={(e) => updateField("year", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder={sourceType === "book" ? "Book Title" : sourceType === "website" ? "Article or Page Title" : "Article Title"}
                    value={citationData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                {/* Conditional Fields */}
                {sourceType === "book" && (
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Publisher Name"
                      value={citationData.publisher}
                      onChange={(e) => updateField("publisher", e.target.value)}
                    />
                  </div>
                )}

                {sourceType === "website" && (
                  <>
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={citationData.url}
                        onChange={(e) => updateField("url", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accessDate">Access Date</Label>
                      <Input
                        id="accessDate"
                        type="date"
                        value={citationData.accessDate}
                        onChange={(e) => updateField("accessDate", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {sourceType === "journal" && (
                  <>
                    <div>
                      <Label htmlFor="journal">Journal Name</Label>
                      <Input
                        id="journal"
                        placeholder="Journal of Science"
                        value={citationData.journal}
                        onChange={(e) => updateField("journal", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="volume">Volume</Label>
                        <Input
                          id="volume"
                          placeholder="15"
                          value={citationData.volume}
                          onChange={(e) => updateField("volume", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pages">Pages</Label>
                        <Input
                          id="pages"
                          placeholder="123-145"
                          value={citationData.pages}
                          onChange={(e) => updateField("pages", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Citations</CardTitle>
                <CardDescription>
                  Citations in MLA, APA, and Chicago formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mla">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mla">MLA</TabsTrigger>
                    <TabsTrigger value="apa">APA</TabsTrigger>
                    <TabsTrigger value="chicago">Chicago</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mla" className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">MLA Format</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateMLA())}
                          disabled={!citationData.author || !citationData.title}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono">{generateMLA() || "Fill in the fields to generate citation"}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="apa" className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">APA Format</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateAPA())}
                          disabled={!citationData.author || !citationData.title}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono">{generateAPA() || "Fill in the fields to generate citation"}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="chicago" className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Chicago Format</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateChicago())}
                          disabled={!citationData.author || !citationData.title}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono">{generateChicago() || "Fill in the fields to generate citation"}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationGenerator;
