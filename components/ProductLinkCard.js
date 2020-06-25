import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import config from "../config";


const useStyles = makeStyles({
    root: {
        maxWidth: 400,
    },
    media: {
        objectFit: 'cover',
    },
});

const ProductLinkCard = ({  product, user, useCredits }) => {
    
    const [open, setOpen] = React.useState(false);

    const generatedLink = useCredits 
                          ? `${config.domain}buy?productId=${product.id}&oneauthId=${user.oneauth_id}&userCredits=true`
                          :  `${config.domain}buy?productId=${product.id}&oneauthId=${user.oneauth_id}`
 
    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    };

    const classes = useStyles();

    return (
        <div className={"d-flex col-md-8 offset-1 mt-5"}>

        <Card className={classes.root} style={{width: '100%'}}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                component="img"
                alt=""
                height="180"
                image={product.image_url}
                title="Link"
              />
              <CardContent>
                  <Grid container wrap="wrap" spacing={2}>
                      <Grid item xs={6}>
                       <b> Product </b>
                        <ul>
                            <li> Name: {product.name} </li>
                            <li> Mrp: {product.mrp / 100}</li>
                            <li> Description: {product.description} </li>

                        </ul>
                      </Grid>
                      <Grid item xs={6}>
                          <b> User </b>
                          <ul>
                              <li>UserName: {user.username}</li>
                              <li>OneauthId: {user.oneauth_id}</li>
                              <li>Email: {user.email}</li>
                              <li>Wallet Amount: {user.wallet_amount / 100}</li>
                          </ul>
                      </Grid>
                  </Grid>        
                  <hr/>
                  <Grid container wrap="wrap">
                        <Grid item xs={10}>
                            <Typography>
                              {generatedLink}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <CopyToClipboard text={generatedLink}>
                                  <Button onClick={handleClick} title="copy to clipboard">
                                    <FileCopyIcon />
                                  </Button>
                            </CopyToClipboard>
                        </Grid>
                  </Grid>
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
        </div>
    );
}

export default ProductLinkCard;
