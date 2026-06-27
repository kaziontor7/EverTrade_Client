export async function uploadToImgBB(file) {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMG_API; // Replace with your real API key in .env.local

    if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API key is missing. Please set NEXT_PUBLIC_IMG_API in your .env.local file.");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`ImgBB upload failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data && data.success && data.data && data.data.url) {
            return data.data.url; // Returns the direct link to the image
        } else {
            throw new Error(data.error?.message || "Unknown error during ImgBB upload.");
        }
    } catch (error) {
        console.error("Error uploading to ImgBB:", error);
        throw error;
    }
}
