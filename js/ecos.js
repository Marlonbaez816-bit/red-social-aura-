import { supabase } from './supabase-client.js';

export async function createEco(authorId, content, parentId = null) {
  const { data, error } = await supabase
    .from('ecos')
    .insert({ author_id: authorId, content, parent_id: parentId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchEcos() {
  const { data, error } = await supabase
    .from('ecos')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function fetchEcoReplies(parentId) {
  const { data, error } = await supabase
    .from('ecos')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}
