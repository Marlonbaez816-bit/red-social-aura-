import { supabase } from './supabase-client.js';

export async function uploadReel(authorId, file, caption) {
  const ext = file.name.split('.').pop();
  const path = `${authorId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('reels')
    .upload(path, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('reels').getPublicUrl(path);

  const { data, error } = await supabase
    .from('reels')
    .insert({ author_id: authorId, video_url: urlData.publicUrl, caption })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchReels() {
  const { data, error } = await supabase
    .from('reels')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

export async function likeReel(reelId, userId) {
  const { error } = await supabase
    .from('reel_likes')
    .insert({ reel_id: reelId, user_id: userId });
  if (error) throw error;

  await supabase.rpc('increment_reel_likes', { reel_id_input: reelId }).catch(() => {});
}

export async function hasLiked(reelId, userId) {
  const { data } = await supabase
    .from('reel_likes')
    .select('*')
    .eq('reel_id', reelId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}
