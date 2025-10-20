import { CircularProgress, Container } from "@mui/material"

const Loading = ()=>{
    return <>
     <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
       <CircularProgress />
      </Container>
    </>
}
export default Loading