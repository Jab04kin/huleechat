import {useState} from 'react'
import {supabase} from '../../lib/supabase'
import useUser from '../../components/auth/hooks/useUser'

export default function UploadAvatar() {
  const { user, profile, updateProfile } = useUser()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    setUploading(true)

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      alert(uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    await updateProfile({ avatar_url: publicUrl })
    setUploading(false)
  }

  return (
    <div>
      {profile?.avatar_url && (
        <img src={profile.avatar_url} className="w-32 rounded-full" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  )
}