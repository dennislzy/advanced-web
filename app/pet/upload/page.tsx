"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { supabase } from "@/config/supabase.client"; // ✅ 一定要有這行

export default function PetUploadPage() {
  const router = useRouter();

  // 對應資料庫欄位
  const [petName, setPetName] = useState("");
  const [gender, setGender] = useState<"公" | "母" | "未知" | "">("");
  const [variety, setVariety] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [introduction, setIntroduction] = useState("");

  // 圖片檔案 & 預覽
  const [petImageFile, setPetImageFile] = useState<File | null>(null);
  const [petImagePreview, setPetImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPetImageFile(file);
    if (file) {
      setPetImagePreview(URL.createObjectURL(file));
    } else {
      setPetImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!petImageFile) {
        throw new Error("請選擇一張寵物照片");
      }

      // 1️⃣ 先把圖片上傳到 Supabase Storage
      const fileExt = petImageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `pets/${fileName}`;

      // ⚠️ bucket 名稱請改成你在 Supabase 建的，例如 pet-images
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pet-images")
        .upload(filePath, petImageFile);

      if (uploadError || !uploadData) {
        console.error(uploadError);
        throw new Error("上傳圖片失敗，請稍後再試");
      }

      // 取得公開網址（也可以只存 path，看你後端怎麼用）
      const { data: publicUrlData } = supabase.storage
        .from("pet-images")
        .getPublicUrl(uploadData.path);

      const imageUrl = publicUrlData.publicUrl; // 這個就是可以直接丟到 <img src> 的網址

      // 2️⃣ 再把寵物資料寫進 /api/pets（寫入 Supabase DB）
      const payload = {
        pet_name: petName,
        pet_image: imageUrl, // 或者只存 uploadData.path 也可以
        gender,
        variety,
        shelter_name: shelterName,
        introduction,
        adopt_status: "否", // 上架時預設可領養
      };

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      console.log("POST /api/pet status:", res.status);
      console.log("POST /api/pet response:", raw);

      if (!res.ok) {
        let data: unknown = null;
        try {
          data = JSON.parse(raw) as unknown;
        } catch {}

        type ErrorResponse = {
          message?: string;
          error?: string;
          detail?: string;
          [key: string]: unknown;
        };

        const msg =
          typeof data === "object" && data !== null
            ? ("message" in data &&
                typeof (data as ErrorResponse).message === "string" &&
                (data as ErrorResponse).message) ||
              ("error" in data &&
                typeof (data as ErrorResponse).error === "string" &&
                (data as ErrorResponse).error) ||
              ("detail" in data &&
                typeof (data as ErrorResponse).detail === "string" &&
                (data as ErrorResponse).detail) ||
              raw
            : raw;

        throw new Error(`上架失敗（${res.status}）：${raw.slice(0, 300)}`);
      }

      setSuccess("寵物已成功上架！");

      setTimeout(() => {
        router.push("/pet");
      }, 1000);
    } catch (err: unknown) {
      console.error("上架寵物失敗：", err);
      if (err instanceof Error) {
        setError(err.message || "上架寵物失敗，請稍後再試");
      } else {
        setError("上架寵物失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          {/* 標題區塊 */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              上架寵物
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請填寫完整的寵物資訊，幫助牠們更快找到幸福的家 🐾
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* 表單 */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="寵物名字"
                fullWidth
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="品種"
                  fullWidth
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="例如：黃金獵犬、米克斯、英國短毛貓…"
                  required
                />

                <TextField
                  label="性別"
                  fullWidth
                  select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "公" | "母" | "未知")
                  }
                  required
                >
                  <MenuItem value="公">公</MenuItem>
                  <MenuItem value="母">母</MenuItem>
                  <MenuItem value="未知">未知</MenuItem>
                </TextField>
              </Stack>

              <TextField
                label="收容所名稱"
                fullWidth
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                placeholder="例如：台北市動物之家內湖站"
                required
              />

              {/* 圖片選擇 */}
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  選擇寵物照片
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                >
                  {petImageFile ? petImageFile.name : "尚未選擇檔案"}
                </Typography>

                {petImagePreview && (
                  <Box
                    sx={{
                      mt: 2,
                      width: 200,
                      height: 200,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      component="img"
                      src={petImagePreview}
                      alt="預覽圖片"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Box>

              <TextField
                label="寵物介紹"
                fullWidth
                multiline
                minRows={4}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="性格、習慣、是否親人、注意事項等……"
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => router.push("/pet")}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 140 }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "white" }} />
                  ) : (
                    "確認上架"
                  )}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
