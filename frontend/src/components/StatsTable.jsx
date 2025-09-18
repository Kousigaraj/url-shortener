import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Chip, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from 'react';

const StatsTable = ({url, handleOpen, handleDelete, handleCopy}) => {
    const [open, setOpen] = useState(false);
    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
        month: "short",   // "Sep"
        day: "2-digit",   // "10"
        year: "numeric",  // "2025"
        hour: "2-digit",  // "02"
        minute: "2-digit",// "12"
        hour12: true      // "PM"
        })
    }

  return (
    <>
        <TableRow
             sx={{
                "& td, & th": { borderBottom: open ? "1px solid rgba(224,224,224,1)" : "0" }
            }}
        >
            <TableCell>
                <Box
                    display={'flex'}
                    justifyContent={'start'}
                    alignItems={'center'}
                    gap={1}
                >
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </IconButton>
                    {url.code}
                </Box>
            </TableCell>
            <TableCell>{url.original}</TableCell>
            <TableCell sx={{color: 'grey'}}>{formatDate(url.created)}</TableCell>
            <TableCell sx={{color: 'grey'}}>{formatDate(url.expiry)}</TableCell>
            <TableCell><Chip label={url.clicks.length} /></TableCell>
            <TableCell>{Date.now() < url.expiry ? <Chip label="Active" size="small" color="success" /> : <Chip label="Expired" size="small" color="error" />}</TableCell>
            <TableCell>
                <Box
                sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                height: "100%",
                minHeight: "100%",
                p: 1
                }}
            >
                <IconButton aria-label="open" size="small" sx={{marginRight: 1}} onClick={() => handleOpen(url.code)}>
                <OpenInNewIcon fontSize="small"/>
                </IconButton>
                <Button variant="outlined" size="small" sx={{marginRight: 1}} startIcon={<ContentCopyOutlinedIcon />} onClick={() => handleCopy(url.code)}>
                copy
                </Button>
                <IconButton color="error" aria-label="delete" size="small" onClick={() => handleDelete(url.code)}>
                <DeleteIcon fontSize="small"/>
                </IconButton>
            </Box>
            </TableCell>
        </TableRow>
        {/* Collapsible row */}
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell 
            style={{ paddingBottom: 0, paddingTop: 0}} 
            colSpan={7}
            >
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={2}>
                <Typography sx={{fontWeight: '600', fontSize: 13}} gutterBottom>
                    Click Details ({url.clicks.length} clicks)
                </Typography>
                {url.clicks.map((click, index) => (
                    <Box
                    key={index}
                    display={'flex'}
                    justifyContent={'space-between'}
                    sx={{
                        p: 1,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        mb: 1
                    }}
                    >
                    <Typography variant="body2">{formatDate(click.time)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Referrer: {click.referrer || "Direct"}
                    </Typography>
                    </Box>
                ))}
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
    </>
  )
}

export default StatsTable