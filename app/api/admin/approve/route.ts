import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";
import {
  apiOk,
  apiBadRequest,
  apiUnauthorized,
  apiNotFound,
  apiServerError,
  apiServiceUnavailable,
} from "@/lib/api-response";
import { ApproveSchema, RejectSchema, SanityDocumentIdSchema } from "@/lib/schemas";

function getWriteClient(token: string) {
  return createClient({
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  const body = await readJsonBody(request);
  if (body === null) return apiBadRequest("Body bukan JSON valid.");

  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  // Sanity drafts always start with `drafts.` — anyone sending the bare id
  // of a published doc is rejected up front to prevent accidental promotion.
  if (!parsed.data.draftId.startsWith("drafts.")) {
    return apiBadRequest("Hanya artikel dengan ID berawalan 'drafts.' yang dapat disetujui.");
  }
  if (!SanityDocumentIdSchema.safeParse(parsed.data.draftId).success) {
    return apiBadRequest("Format ID draft tidak valid.");
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const writeClient = getWriteClient(token);
    const draftDoc = await writeClient.getDocument(parsed.data.draftId);
    if (!draftDoc) return apiNotFound("Artikel draf tidak ditemukan.");

    const publishedId = parsed.data.draftId.replace(/^drafts\./, "");
    await writeClient
      .transaction()
      .createOrReplace({ ...draftDoc, _id: publishedId })
      .delete(parsed.data.draftId)
      .commit();

    return apiOk("Artikel berhasil disetujui dan dipublikasikan.", { publishedId });
  } catch (err: any) {
    return apiServerError("Gagal menyetujui artikel: " + (err?.message ?? "unknown"));
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  const body = await readJsonBody(request);
  if (body === null) return apiBadRequest("Body bukan JSON valid.");

  const parsed = RejectSchema.safeParse(body);
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  if (!SanityDocumentIdSchema.safeParse(parsed.data.draftId).success) {
    return apiBadRequest("Format ID draft tidak valid.");
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const writeClient = getWriteClient(token);
    await writeClient.delete(parsed.data.draftId);
    return apiOk("Artikel draf berhasil dihapus.");
  } catch (err: any) {
    return apiServerError("Gagal menghapus artikel draf: " + (err?.message ?? "unknown"));
  }
}
