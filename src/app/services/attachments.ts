import { Injectable, inject } from '@angular/core';
import { supabase } from './supabase.client';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AttachmentsService {
  private readonly auth = inject(AuthService);

  // Las tareas están en Mongo; los archivos siguen en Supabase Storage.
  async upload(taskId: string, file: File): Promise<string> {
    const uid = this.auth.session()?.user.id;
    if (!uid) throw new Error('Debes iniciar sesión para adjuntar archivos.');

    const safeName = file.name
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/^[.-]+|[.-]+$/g, '')
      .slice(0, 180) || 'adjunto';

    const path = `${uid}/${taskId}/${safeName}`;

    const { error } = await supabase.storage
      .from('attachments')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    return supabase.storage
      .from('attachments')
      .getPublicUrl(path).data.publicUrl;
  }

  async list(taskId: string): Promise<{ name: string; url: string }[]> {
    const uid = this.auth.session()?.user.id;
    if (!uid) return [];

    const path = `${uid}/${taskId}`;
    const bucket = supabase.storage.from('attachments');
    const { data, error } = await bucket.list(path);
    if (error) throw error;

    return (data ?? []).map(file => ({
      name: file.name,
      url: bucket.getPublicUrl(`${path}/${file.name}`).data.publicUrl,
    }));
  }
}
