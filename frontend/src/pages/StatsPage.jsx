import { deleteUrl, getAllUrls } from "../utils/utils";
import MuiAlert from "@mui/material/Alert";
import { Card, CardContent, Container, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StatsTable from "../components/StatsTable";
import ToastBox from "../components/ToastBox";

export default function StatsPage() {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState([]);
  const [message, setMessage] = useState({});

  useEffect(() => {
    const fetchUrls = async() => {
      const data = await getAllUrls();
      setUrls(data);
    }

    fetchUrls();

    const interval = setInterval(fetchUrls, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(window.location.origin + "/" + code).
    then(() => {
      setMessage({ success: true, message: "URL copied to clipboard!" });
      setOpen(true)
    }).
    catch(err => {
      console.error("Copy failed", err)
      setMessage({ success: false, message: "Copy failed" });
      setOpen(true)
    });
  }

  const handleOpen = (code) => {
    window.open(window.location.origin + "/" + code, "_blank");
  }

  const handleDelete = async(code) => {
    const result = await deleteUrl(code);
    if(result.success){
      setMessage({ success: true, message: "URL has been deleted successfully."});
      setOpen(true);
      setUrls((prev) => prev.filter(url => url.code != code));
    } else{
      setMessage({ success: false, message : result.message});
      setOpen(true);
    }
  }

  return (
    <Container maxWidth>
      <Card sx={{marginTop: '100px' , boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }}>
        <CardContent>
          
          <Typography variant="h5" sx={{fontWeight: '600'}} gutterBottom>Your Shortened URLs</Typography>
          {urls.length === 0 ? (
            <Typography sx={{ textAlign: "center", p: 3, color: "grey" }}>
              No shortened URL's yet.
            </Typography>
          ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right" sx={{ fontWeight: "bold"}}>Short URL</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Original URL</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Created</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Expires</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Clicks</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold"}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url, index) => (
                  <StatsTable key={index} url={url} handleCopy={handleCopy} handleOpen={handleOpen} handleDelete={handleDelete}/>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </CardContent>
      </Card>
      <ToastBox open={open} setOpen={setOpen} message={message}/>
    </Container>
  );
}
