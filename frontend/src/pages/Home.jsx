import { TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import { useState } from "react";
import { saveUrl } from "../utils/utils";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import MuiAlert from "@mui/material/Alert";

function Home() {
  const [url, setUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [expiry, setExpiry] = useState(30);
  const [shortUrl, setShortUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!url.startsWith("http")) {
      alert("Enter a valid URL");
      return;
    }
    const result = await saveUrl(url, custom, expiry);
    if (result.success) {
      setShortUrl(window.location.origin + "/" + result.data.code);
      setUrl("");
      setCustom("");
      setExpiry(30);
      setMessage({ success: true, message :"URL has been shortened successfully." });
      setOpen(true);
    } else {
      setMessage(result);
      setOpen(true);
    }
  };

   const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setMessage({ success: true, message :"URL copied to clipboard!" })
        setOpen(true)
      })
      .catch(err => {
        console.error("Copy failed", err)
        setMessage({ success: false, message :"Copy failed" })
        setOpen(true)
      });
  };

  return (
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ height: "100vh" }}
    >
        <Card sx={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }} className="card">
            <CardContent>
                <Typography variant="h5" sx={{fontWeight: '600'}} gutterBottom>Shorten Your URL</Typography>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <TextField label="Original URL" fullWidth  margin="normal" value={url} onChange={e => setUrl(e.target.value)} required/>
                  <TextField label="Custom Code (optional)" fullWidth  margin="normal" value={custom} onChange={e => setCustom(e.target.value)} />
                  <TextField label="Expiry (minutes)" type="number" fullWidth  margin="normal" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <Button variant="contained" type="submit" style={{width: '100%', marginTop: '20px', padding: '10px 0'}}>Shorten</Button>
                </form>
            </CardContent>
        </Card>
      {shortUrl && (
        <Card sx={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }} className="card">
          <CardContent >
            <Typography variant="h5" sx={{fontWeight: '600'}} gutterBottom>Your shortened URL is ready!</Typography>
            <Box 
              display="flex"
              justifyContent="space-between"
              gap={2}
              paddingTop={2}
            >
              <Typography sx={{ border: '1px solid #d3d3d3', padding: 1, borderRadius: 1, width: '100%', overflow: 'auto'}}>
                {shortUrl}
              </Typography>
              <Button variant="outlined" sx={{height: "40px"}} startIcon={<ContentCopyOutlinedIcon />} onClick={handleCopy}>
                copy
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setOpen(false)}
          severity={message.success ? "success" : "error"}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {message.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}


export default Home