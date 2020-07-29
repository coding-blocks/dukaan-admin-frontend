import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import config from "../config";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


const ProductLinkCard = ({ link,  product, user, onSendEmailClick, calculatedAmountDetails }) => {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

      setOpen(false);
    }

    return (
        <Card style={{width: '100%'}}>
            <CardActionArea>
              <CardContent>

                <TableContainer>
                      <Typography className={"ml-5 mt-2"} variant="h5" id="tableTitle" component="div">
                          <b> Buy Link </b> 
                          <br/>
                          <p className={"red"}>{product.description}</p>
                      </Typography>

                      <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Product Name</TableCell>
                              <TableCell align="center">Product Mrp</TableCell>
                              <TableCell align="center">Discount</TableCell>
                              <TableCell align="center">Taxes</TableCell>
                              <TableCell align="center">Credits</TableCell>
                              <TableCell align="center">Amount To Pay</TableCell>
                              <TableCell align="center">Type</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow key={product.id}>
                                <TableCell component="th" scope="row" align="center">
                                  {product.name}
                                </TableCell>
                                <TableCell align="center">{calculatedAmountDetails.productMrp / 100}</TableCell>
                                <TableCell align="center">{calculatedAmountDetails.discount / 100}</TableCell>
                                <TableCell align="center">{calculatedAmountDetails.tax /100}</TableCell>
                                <TableCell align="center">{calculatedAmountDetails.applicableCredits /100 }</TableCell>
                                <TableCell align="center" className={"red"}>{calculatedAmountDetails.amountPayable /100}</TableCell>
                                <TableCell align="center" className={"red"}><b>{product.type}</b></TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                  </TableContainer>


                  <div className={"row mt-4"}>
                      <div className={"col-md-2 offset-1"}>
                          <b>Product Buy Link: </b>
                      </div>

                      <div className={"col-md-9"}>
                          <b style={{color: '#509EE3'}}>{link}</b>
                          <CopyToClipboard text={link}>
                                <Button onClick={handleClick} title="copy to clipboard">
                                  <FileCopyOutlinedIcon />
                                </Button>
                          </CopyToClipboard>
                      </div>

                      
                  </div>

                  <div className={"divider-h mt-1"}></div>

                  <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      open={open}
                      autoHideDuration={2000}
                      onClose={handleClose}
                      message="Copied"
                      action={
                        <React.Fragment>
                          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </React.Fragment>
                    }
                  />

                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ProductLinkCard;
