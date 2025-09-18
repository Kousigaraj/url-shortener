export async function saveUrl(original, custom, minutes) {
  
  let code = custom;
  if(!code){
    code = Math.random().toString(36).substring(2, 7);
    let result = await fetch(`/api/urls/${code}`);
    if (result) {
      code = Math.random().toString(36).substring(2, 7);
    }
  }
  
  const expiry = Date.now() + minutes * 60000;
  const created = Date.now();
  const newUrl = { original, code, created, expiry, clicks: [] };
  try {
    const res = await fetch('/api/urls', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUrl)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function getAllUrls() {
  try {
    const res = await fetch('/api/urls');
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error in fetching data', error);
    return [];
  }
}

export async function deleteUrl(code) {
  try {
    const res = await fetch(`/api/urls/${code}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Error deleting URL', error);
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function logClick(code) {
  try {
    const res = await fetch(`/api/urls/${code}/clicks`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: new Date().toISOString(),
        referrer: document.referrer || "direct"
      })
    });

    return await res.json();
  } catch (error) {
    
  }
}

