//src/lib/uploadAvatar.ts
import { supabase } from './supabase';

/**
 * @param userId Supabase Auth user id (UUID)
 * @param uri local uri (from ImagePicker)
 * @returns publicUrl or null
 */
export async function uploadAvatarToSupabase(userId: string, uri: string): Promise<string | null> {
  try {
    if (!uri) return null;
    let fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, { contentType, upsert: true });
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (e: any) {
    console.error('Upload avatar error:', e);
    throw new Error(e?.message ?? 'Failed to upload image');
  }
}