// Save a new URL
export async function saveUrl(original, custom, minutes) {
  const newUrl = { original, custom, minutes };

  try {
    const res = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUrl),
    });

    return await res.json();
  } catch (error) {
    console.error("Error saving URL:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Get all URLs
export async function getAllUrls() {
  try {
    const res = await fetch("/api/urls");
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error in fetching data:", error);
    return [];
  }
}

// Delete a URL
export async function deleteUrl(code) {
  try {
    const res = await fetch(`/api/urls/${code}`, { method: "DELETE" });
    return await res.json();
  } catch (error) {
    console.error("Error deleting URL:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Log a click
export async function logClick(code) {
  try {
    const res = await fetch(`/api/urls/${code}/clicks`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error("Error logging click:", error);
  }
}
