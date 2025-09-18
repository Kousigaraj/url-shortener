import { Snackbar } from "@mui/material"
import MuiAlert from "@mui/material/Alert";


const ToastBox = ({message, open, setOpen}) => {
  return (
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
  )
}

export default ToastBox