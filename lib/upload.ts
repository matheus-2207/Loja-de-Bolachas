import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Configura o Cloudinary apenas se as variáveis de ambiente estiverem presentes
const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/**
 * Realiza o upload de uma imagem.
 * Se as credenciais do Cloudinary estiverem disponíveis, envia para a nuvem.
 * Caso contrário, salva localmente na pasta /public/uploads.
 * 
 * @param foto O arquivo de imagem (File) enviado pelo formulário.
 * @returns A URL pública da imagem (ou caminho local) ou null se nenhum arquivo for enviado.
 */
export async function uploadImagem(foto: File | null): Promise<string | null> {
  if (!foto || foto.size === 0) {
    return null
  }

  const arrayBuffer = await foto.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (useCloudinary) {
    // Upload para o Cloudinary (Produção)
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'loja-de-bolachas',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Erro no upload para o Cloudinary:', error)
              reject(error)
            } else {
              resolve(result)
            }
          }
        ).end(buffer)
      }) as any

      return uploadResult.secure_url
    } catch (err) {
      console.error('Falha ao subir imagem para o Cloudinary. Tentando fallback local...', err)
    }
  }

  // Upload local (Desenvolvimento)
  const filename = `${Date.now()}-${foto.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filepath = path.join(uploadDir, filename)
  fs.writeFileSync(filepath, buffer)

  return `/uploads/${filename}`
}
