"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function str(fd: FormData, k: string, max = 500): string {
  return String(fd.get(k) ?? "").trim().slice(0, max);
}

function num(fd: FormData, k: string, def = 0): number {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : def;
}

function bool(fd: FormData, k: string): boolean {
  return fd.get(k) === "on" || fd.get(k) === "true";
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function saveBlogPost(formData: FormData) {
  await requireAdmin();

  const id = num(formData, "id");
  const title = str(formData, "title", 200);
  if (!title) throw new Error("Tiêu đề bài viết không được để trống");

  let slug = str(formData, "slug", 120);
  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const summary = str(formData, "summary", 600);
  const content = String(formData.get("content") ?? "").trim();
  const coverUrl = str(formData, "coverUrl", 1000);
  const category = str(formData, "category", 60) || "Chia sẻ";
  const rawTags = str(formData, "tags", 300);
  const tagsArray = rawTags
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = JSON.stringify(tagsArray);

  const pinned = bool(formData, "pinned");
  const visible = bool(formData, "visible");
  const order = num(formData, "order", 0);

  if (id > 0) {
    await db.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        content,
        coverUrl,
        category,
        tags,
        pinned,
        visible,
        order,
      },
    });
  } else {
    let finalSlug = slug;
    let counter = 1;
    while (await db.blogPost.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    await db.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        summary,
        content,
        coverUrl,
        category,
        tags,
        pinned,
        visible,
        order,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/blogs");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (id > 0) {
    await db.blogPost.delete({ where: { id } });
  }
  revalidatePath("/");
  revalidatePath("/admin/blogs");
}
