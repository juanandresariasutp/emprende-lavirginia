type BusinessImage = {
  storage_path: string;
  image_type: string;
};

type StorageClient = {
  storage: {
    from: (bucket: string) => {
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

export function getBusinessCardImages(
  supabase: StorageClient,
  images: BusinessImage[],
) {
  const logo = images.find((item) => item.image_type === "logo");
  const cover = images.find((item) => item.image_type === "cover");

  return {
    logoUrl: logo
      ? supabase.storage.from("business-logos").getPublicUrl(logo.storage_path)
          .data.publicUrl
      : null,
    coverUrl: cover
      ? supabase.storage
          .from("business-images")
          .getPublicUrl(cover.storage_path).data.publicUrl
      : null,
  };
}
