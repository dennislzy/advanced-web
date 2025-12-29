import { createSupabaseServerClient } from "@/config/supabase.server"
import { notFound } from "next/navigation"
import EditPetForm from "./EditPetForm"

const ADMIN_EMAIL = "jeff1050032@gmail.com"

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ pet_id: string }>
}) {
  const { pet_id } = await params
  const supabase = await createSupabaseServerClient()

  // ✅ 必須登入
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return <div style={{ padding: 24 }}>未授權：請先登入</div>
  }

  // ✅ 必須是 Jeff
  if ((user.email ?? "").toLowerCase() !== ADMIN_EMAIL) {
    return <div style={{ padding: 24 }}>Forbidden：你沒有權限修改</div>
  }

  // ✅ 讀取寵物資料
  const { data: pet, error } = await supabase
    .from("pet")
    .select("pet_id, pet_name, gender, variety, shelter_name, pet_image, introduction")
    .eq("pet_id", pet_id)
    .single()

  if (error || !pet) notFound()

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>編輯寵物：{pet.pet_name}</h2>
      <EditPetForm pet={pet} />
    </div>
  )
}
