import { supabase } from './supabase-client.js';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function follow(followerId, followingId) {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });
  if (error) throw error;
}

export async function unfollow(followerId, followingId) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  if (error) throw error;
}

export async function isFollowing(followerId, followingId) {
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  return !!data;
}

// "Red de interacción": lista real de gente que sigues y te sigue
export async function fetchNetwork(userId) {
  const { data: following } = await supabase
    .from('follows')
    .select('profiles:following_id(id, username, display_name, avatar_url)')
    .eq('follower_id', userId);

  const { data: followers } = await supabase
    .from('follows')
    .select('profiles:follower_id(id, username, display_name, avatar_url)')
    .eq('following_id', userId);

  return {
    following: (following || []).map(f => f.profiles),
    followers: (followers || []).map(f => f.profiles)
  };
}
