"use client"

import React, { useMemo, useState } from "react"
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { supabase } from "@/config/supabase.client"

type EditPetPayload = {
  pet_id: string
  pet_name: string
  gender: string
  variety: string
  shelter_name: string
  pet_image: string | null
  introduction: string | null   // ✅ 新增
}

const BUCKET = "pet-images"

export default function EditPetForm({ pet }: { pet: EditPetPayload }) {
  const router = useRouter()
  const [form, setForm] = useState<EditPetPayload>({ ...pet })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // ✅ 圖片預覽：優先顯示新選的，其次顯示原本的
  const previewUrl = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile)
    return form.pet_image || "/placeholder-pet.png"
  }, [selectedFile, form.pet_image])

  const onChange =
    (key: keyof EditPetPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  async function uploadImageIfNeeded(): Promise<string | null> {
    if (!selectedFile) return form.pet_image ?? null

    if (!selectedFile.type.startsWith("image/")) {
      throw new Error("請選擇圖片檔（jpg / png / webp）")
    }

    setUploading(true)
    try {
      const ext = selectedFile.name.split(".").pop() || "png"
      const filePath = `pets/${form.pet_id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, selectedFile, {
          upsert: true,
          contentType: selectedFile.type,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)

    try {
      const imageUrl = await uploadImageIfNeeded()

      const res = await fetch(`/api/pets/${form.pet_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_name: form.pet_name,
          gender: form.gender,
          variety: form.variety,
          shelter_name: form.shelter_name,
          pet_image: imageUrl,
          introduction: form.introduction, // ✅ 一併送出
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? `更新失敗（${res.status}）`)
        return
      }

      router.push(`/pet/${form.pet_id}`)
      router.refresh()
    } catch (e) {
      setError((e as Error).message || "更新失敗，請稍後再試")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* 圖片預覽 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          圖片預覽
        </Typography>

        <Box
          component="img"
          src={previewUrl}
          alt="pet preview"
          sx={{
            width: "100%",
            maxWidth: 480,
            height: 260,
            objectFit: "cover",
            borderRadius: 2,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        />
      </Box>

      {/* 選取圖片 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          選取圖片
        </Typography>
        <input type="file" accept="image/*" onChange={handlePickFile} />
        {uploading && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            圖片上傳中…
          </Typography>
        )}
      </Box>

      <TextField
        label="寵物名稱"
        value={form.pet_name}
        onChange={onChange("pet_name")}
        fullWidth
      />

      <TextField
        label="性別"
        value={form.gender}
        onChange={onChange("gender")}
        select
        fullWidth
      >
        <MenuItem value="公">公</MenuItem>
        <MenuItem value="母">母</MenuItem>
      </TextField>

      <TextField
        label="品種"
        value={form.variety}
        onChange={onChange("variety")}
        fullWidth
      />

      <TextField
        label="收容所"
        value={form.shelter_name}
        onChange={onChange("shelter_name")}
        fullWidth
      />

      {/* ✅ 新增：寵物介紹 */}
      <TextField
        label="寵物介紹"
        value={form.introduction ?? ""}
        onChange={onChange("introduction")}
        fullWidth
        multiline
        minRows={4}
        placeholder="請輸入寵物的個性、背景、照護需求等"
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || uploading}
        >
          {saving ? "儲存中…" : "儲存"}
        </Button>

        <Button variant="outlined" onClick={() => router.back()}>
          取消
        </Button>
      </Box>
    </Box>
  )
}
