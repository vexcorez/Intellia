import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, BookOpen } from "lucide-react";

const Feed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [publicSets, setPublicSets] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(session.user.id);
    fetchFollowedUsers(session.user.id);
    fetchPublicFlashcards(session.user.id);
  };

  const fetchFollowedUsers = async (userId: string) => {
    const { data } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);
    
    if (data) {
      setFollowedUsers(data.map((f) => f.following_id));
    }
  };

  const fetchPublicFlashcards = async (userId: string) => {
    const { data } = await supabase
      .from("flashcard_sets")
      .select(`
        *,
        profiles!flashcard_sets_user_id_fkey(username, avatar_url)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setPublicSets(data);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${searchQuery}%`)
      .neq("user_id", currentUserId)
      .limit(10);

    if (data) {
      setUsers(data);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: currentUserId, following_id: userId });

    if (error) {
      toast({
        title: "Follow failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFollowedUsers([...followedUsers, userId]);
      toast({
        title: "Followed!",
        description: "You're now following this user.",
      });
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", currentUserId)
      .eq("following_id", userId);

    if (error) {
      toast({
        title: "Unfollow failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFollowedUsers(followedUsers.filter((id) => id !== userId));
      toast({
        title: "Unfollowed",
        description: "You've unfollowed this user.",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Feed</h1>
          <p className="text-muted-foreground">Discover and follow other students</p>
        </div>

        {/* Search Users */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Students</CardTitle>
            <CardDescription>Search for users to follow and see their study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
              />
              <Button onClick={searchUsers}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {users.length > 0 && (
              <div className="mt-4 space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
                      </div>
                    </div>
                    {followedUsers.includes(user.user_id) ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnfollow(user.user_id)}>
                        Unfollow
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleFollow(user.user_id)}>
                        Follow
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Public Flashcard Sets */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Public Study Sets</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicSets.map((set) => (
              <Card key={set.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={set.profiles?.avatar_url} />
                      <AvatarFallback>{set.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">@{set.profiles?.username}</span>
                  </div>
                  <CardTitle className="line-clamp-1">{set.title}</CardTitle>
                  {set.description && (
                    <CardDescription className="line-clamp-2">{set.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Public flashcard set</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {publicSets.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No public study sets yet. Be the first to share!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
