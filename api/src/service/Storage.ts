import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createReadStream, createWriteStream } from 'fs'

export class Storage {
  private static client: Storage
  private supabase: SupabaseClient | null

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

    this.supabase = supabaseUrl && supabaseKey
      ? createClient(supabaseUrl, supabaseKey)
      : null
  }

  public static connect(): Storage {
    if (!this.client) {
      this.client = new Storage()
    }
    return this.client
  }

  public isEnabled(): boolean {
    return this.supabase !== null
  }

  /**
   * Upload a file to Supabase Storage
   * @param bucket Bucket name (e.g., 'cached-files')
   * @param path File path in bucket
   * @param localPath Local file path to upload
   */
  public async uploadFile(bucket: string, path: string, localPath: string): Promise<string | null> {
    if (!this.supabase) {
      console.warn('Supabase Storage not configured')
      return null
    }

    try {
      const fileStream = createReadStream(localPath)
      const chunks: Buffer[] = []

      for await (const chunk of fileStream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, buffer, {
          upsert: true,
          contentType: 'application/octet-stream'
        })

      if (error) {
        console.error('Supabase upload error:', error)
        return null
      }

      return data.path
    } catch (error) {
      console.error('Storage upload error:', error)
      return null
    }
  }

  /**
   * Download a file from Supabase Storage
   * @param bucket Bucket name
   * @param path File path in bucket
   * @param localPath Local file path to save to
   */
  public async downloadFile(bucket: string, path: string, localPath: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn('Supabase Storage not configured')
      return false
    }

    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .download(path)

      if (error || !data) {
        console.error('Supabase download error:', error)
        return false
      }

      const buffer = Buffer.from(await data.arrayBuffer())
      const writeStream = createWriteStream(localPath)

      await new Promise((resolve, reject) => {
        writeStream.write(buffer, (err) => {
          if (err) reject(err)
          else {
            writeStream.end()
            resolve(true)
          }
        })
      })

      return true
    } catch (error) {
      console.error('Storage download error:', error)
      return false
    }
  }

  /**
   * Check if a file exists in Supabase Storage
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  public async fileExists(bucket: string, path: string): Promise<boolean> {
    if (!this.supabase) {
      return false
    }

    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list('', {
          search: path
        })

      if (error) {
        return false
      }

      return data.some(file => file.name === path.split('/').pop())
    } catch (error) {
      return false
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  public async deleteFile(bucket: string, path: string): Promise<boolean> {
    if (!this.supabase) {
      return false
    }

    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path])

      return !error
    } catch (error) {
      console.error('Storage delete error:', error)
      return false
    }
  }

  /**
   * Get public URL for a file
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  public getPublicUrl(bucket: string, path: string): string | null {
    if (!this.supabase) {
      return null
    }

    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }
}
