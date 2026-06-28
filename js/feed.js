import { supabase } from './supabase-client.js';

export async function createPost(authorId, content) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchFeed() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export function subscribeToFeed(callback) {
  return supabase
    .channel('posts-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, callback)
    .subscribe();
}
