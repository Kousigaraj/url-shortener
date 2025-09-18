import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logClick } from "../utils/utils";
import { Alert, Box, Card, CardContent, CircularProgress, Link, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function RedirectPage() {
  const { code } = useParams();
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [url, setUrl] = useState("");


  useEffect(() => {
  const fetchUrl = async () => {
    try {
      const res = await fetch(`/api/urls/${code}`);
      const result = await res.json();
      const entry = result.data;

      if (!entry) {
        setMessage("invalid");
        return;
      }

      setUrl(entry.original);

      const now = Date.now();
      if (now > entry.expiry) {
        setMessage("expired");
        return;
      }

      setMessage("redirect");
      setCountdown(3);
    } catch (error) {
      console.error("Error fetching URL:", error);
      setMessage("invalid");
    }
  };

  fetchUrl();
}, [code]);

// Countdown effect
useEffect(() => {
  if (message !== "redirect") return;

  if (countdown === 0) {
    logClick(code);
    window.location.href = url;
    return;
  }

  const timer = setTimeout(() => {
    setCountdown(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [countdown, message, code, url]);


  return (
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh" }}
    >
       <Card sx={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'}} className="redirect-card">
          {message === "redirect" && <CardContent sx={{padding: 3}}>
            <Box
              margin={'10px auto'}
              height={60}
              width={60}
              borderRadius={50}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={"rgba(0, 128, 0, 0.1)"}
            >
              <OpenInNewIcon color="success" sx={{fontSize: 30}}/>
            </Box>
            <Typography variant="h5" sx={{fontWeight: '600'}} gutterBottom textAlign={'center'}>Redirecting...</Typography>
            <Typography color="grey" textAlign={'center'} >You will be redirected to your destination in {countdown} seconds.</Typography>
            <Box
              marginTop={3}
              padding={2}
              border={'1px solid #d4d4d4'}
              borderRadius={3}
              bgcolor={'rgba(0,0,0,0.1)'}
            >
              <Typography color="grey" fontSize={13} textAlign={'center'} >Destination:</Typography>
              <Typography fontSize={13} textAlign={'center'} >{url}</Typography>
            </Box>
            <Box 
              display={"flex"}
              width={'100%'}
              alignItems="center"
              justifyContent="center"
              gap={2}
              margin={2}
            >
              <CircularProgress color="success"/>
              <Typography variant="h5" color="success">{countdown}</Typography>
            </Box>
            <Typography textAlign={'center'}>If you're not redirected automatically, <Link href={url} underline="none">click here</Link></Typography>
          </CardContent>}
          {message === "invalid" && <CardContent sx={{padding: 3}} >
            <Box
              margin={'10px auto'}
              height={60}
              width={60}
              borderRadius={50}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={"rgba(128, 0, 0, 0.1)"}
            >
              <ErrorOutlineIcon color="error" sx={{fontSize: 35}}/>
            </Box>
            <Typography variant="h5" color="error" sx={{fontWeight: '600'}} gutterBottom textAlign={'center'}>Invalid Link</Typography>
            <Typography color="grey" textAlign={'center'} >The link you're trying to access doesn't exist or has been removed.</Typography>
            <Alert severity="error" sx={{textAlign: 'center', margin: 3}}>This short URL is not valid. Please check the link and try again.</Alert>
          </CardContent>}
           {message === "expired" && <CardContent sx={{padding: 3}} >
            <Box
              margin={'10px auto'}
              height={60}
              width={60}
              borderRadius={50}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={"rgba(255, 193, 7, 0.1)"}
            >
              <WarningAmberIcon color="warning" sx={{fontSize: 35}}/>
            </Box>
            <Typography variant="h5" color="warning" sx={{fontWeight: '600'}} gutterBottom textAlign={'center'}>Link Expired</Typography>
            <Typography color="grey" textAlign={'center'} >This short URL has expired and is no longer accessible.</Typography>
            <Alert severity="warning" sx={{textAlign: 'center', margin: 3}}>The link has passed its expiry date and cannot be accessed anymore.</Alert>
          </CardContent>}
       </Card>
    </Box>
  );
}
