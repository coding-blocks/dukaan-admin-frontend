import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import config from "../config";


const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        marginBottom: 10
    },
    media: {
        objectFit: 'cover',
    },
});

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

    const classes = useStyles();

    return (
        <div className={"d-flex col-md-11 offset-1"}>

        <Card className={classes.root} style={{width: '100%'}}>
            <CardActionArea>
              <CardContent>

                  <div class="img-desc pb-3">
                      <div class="col-3 col-sm-2 col-lg-3 pl-0">
                          <Avatar src={product.image_url} alt=""  className={classes.large}/>
                      </div>
                      <div class="description">
                          <div>
                              <div class="font-md extra-bold">
                                  {product.description}
                              </div>
                          </div>
                          <div>
                          </div>
                      </div>
                  </div>

                  <div class="divider-h mt-4 mb-4"></div>

                  <div class="row justify-content-between font-md ml-2">
                      <div>Discount</div>
                      <div class="bold mr-5"> {calculatedAmountDetails.discount} </div>
                  </div>

                  <div class="row justify-content-between font-md ml-2">
                      <div>Taxes</div>
                      <div class="bold mr-5"> {calculatedAmountDetails.tax/100} </div>
                  </div>

                  <div class="row justify-content-between font-md ml-2">
                      <div>Credits</div>
                      <div class="bold mr-5"> {calculatedAmountDetails.creditsApplied/100} </div>
                  </div>

                  <div class="row justify-content-between font-md ml-2">
                      <div>Amount</div>
                      <div class="bold mr-5"> {calculatedAmountDetails.amount/100} </div>
                  </div>

                  <div class="row justify-content-between font-md ml-2">
                      <div>Type</div>
                      <div class="bold red mr-5"> {product.type} </div>
                  </div>

                  <div class="divider-h mt-4 mb-4"></div>

                  <div class="row">
                      <div class="col-lg-10">
                          {link}
                      </div>

                      <div class="col-lg-2">
                          <CopyToClipboard text={link}>
                                <Button onClick={handleClick} title="copy to clipboard">
                                  <FileCopyOutlinedIcon />
                                </Button>
                          </CopyToClipboard>
                      </div>
                  </div>

                  <div class="divider-h mt-1"></div>

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
              <CardActions>
                  <Button color="primary" className={"ml-auto"} onClick={onSendEmailClick}>
                      Send Email
                      <EmailOutlinedIcon className={"ml-2"} />
                  </Button>
              </CardActions>
            </CardActionArea>
        </Card>
        </div>
    );
}

export default ProductLinkCard;
