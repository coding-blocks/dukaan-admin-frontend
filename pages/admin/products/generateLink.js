import React from 'react'
import Head from '../../../components/head';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Layout from "../../../components/layout";
import ProductLinkForm from "../../../forms/ProductLink";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/products'
import * as userController from '../../../controllers/users'
import ProductLinkCard from "../../../components/ProductLinkCard"
import ErrorHandler from "../../../helpers/ErrorHandler";
import Swal from 'sweetalert2';
import { withStyles } from '@material-ui/core';

const useStyles = theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});

class GenerateLink extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organizationId:'',
            organizations: [],
            centers: [],
            centerId: '',
            productSearchInput: '',
            userSearchInput: '',
            productSearchResults: [],
            userSearchResults: [],
            selectProductOpen: false,
            selectUserOpen: false,
            product:'',
            user:'',
            useCredits:false,
            generatedLink: '',
            generateLinkClicked:false,
            activeCartIframeUrl: '',
            purchasedProductIframeurl: '',
            calculatedAmountDetails: '',
            loading: false,
        }
    }

    componentDidMount() {
        controller.fetchGenerateLinkData({
            user_id: this.state.user_id
        }).then((organizations) => {
            this.setState({
                organizations: organizations.data,
            })
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error fetching resources!",
                text: error
            });
        });
    }

    fetchCenters = () => {
        controller.fetchCenters(this.state.organizationId)
        .then((response) => {
            this.setState({
                centers: response.data,
            })
        }).catch((err) => {
            this.setState({
                centers: []
            })
            ErrorHandler.handle(err)
        })
    }

    onOrganizationChange = (event) => {
        this.setState({
            organizationId: event.target.value,
            centerId: '',
            product: ''
        }, () => {
            this.fetchCenters()
        })
    } 

    onCenterChange = (event) => {
        this.setState({
            centerId: event.target.value,
            productSearchResults: [],
            product: ''
        })
    }

    onAutoCompleteOpen = (param) => {
        if (param === 'user') 
            this.setState({selectUserOpen: true})

        if (param === 'product')
            this.setState({selectProductOpen: true})
    }

    onAutoCompleteClose = (param) => {
        if (param === 'user')
             this.setState({selectUserOpen: false})

        if (param === 'product')
             this.setState({selectProductOpen: false})
    }


    onProductSearchInputChange = (event) => {
        this.setState({
            productSearchInput: event.target.value
        }, () => {
            this.handleProductSearch()
        })

    }

    handleProductSearch =  () => {
        if (this.state.productSearchInput.length > 3) {
            controller.searchProducts({
                organization_id: this.state.organizationId,
                center_id: this.state.centerId,
                description: this.state.productSearchInput
            }).then((response) => {
                this.setState({
                    productSearchResults: response.data,
                })
            }).catch((err) => {
                this.setState({
                    productSearchResults: []
                })
                ErrorHandler.handle(err)
            })
        }
    }

    handleProductChange = async (event, value) => {
        this.setState({
            product: value,
        })

        this.unsetGeneratedLink()
    }


    onUserSearchInputChange = (event) => {
        this.setState({
            userSearchInput: event.target.value
        }, () => {
            this.handleUserSearch()
        })

    }

    handleUserSearch = () => {

        if (this.state.userSearchInput.length > 3) {
            userController.handleGetUserByEmailOrPhone('email', this.state.userSearchInput)
            .then((response) => {
                this.setState({
                    userSearchResults: response.data
                })
            }).catch((error => {
                this.setState({
                    userSearchResults: []
                })
                ErrorHandler.handle(error)
            }))
        }
    }

    handleUserChange =  (event, value) => {

        this.setState({
            user: value,
        })
        this.unsetGeneratedLink()
    }

    onApplyCreditsChange = (event) => {
        this.setState({
            useCredits: !JSON.parse(event.target.value)
        })
        this.unsetGeneratedLink()
    }

    ongenerateLink = (link) => {

        controller.getProductBuyLinkData({
            userId: this.state.user.id,
            oneauthId: this.state.user.oneauth_id,
            productId: this.state.product.id,
            quantity: 1,
            useCredits: this.state.useCredits
        }).then(([ [activeCartDetails, purchasedProductDetails], calculatedAmountDetails]) => {
            this.setState({
                activeCartIframeUrl: activeCartDetails.data.iframeUrl,
                purchasedProductIframeurl: purchasedProductDetails.data.iframeUrl,
                generatedLink: link,
                generateLinkClicked: true,
                calculatedAmountDetails: calculatedAmountDetails.data,
                loading: true
            })
        })
    }

    unsetGeneratedLink = () => {
        this.setState({
            generatedLink: '',
            generateLinkClicked: false
        })
    }

    onSendEmailClick = () => {
        controller.sendBuyLinkEmail({
            user_id: this.state.user.id,
            link: this.state.generatedLink
        }).then((response) => {
            Swal.fire({
              title: "Success",
              text: "Email sent successfully!",    
              icon: "success",
            });
        }).catch((err) => {
            Swal.fire({
                type: "error",
                title: "Error",
                text: "Error sending email!"
            });
        })
    }

    hideSpinner = () => {
        this.setState({
          loading: false
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>


                <Head title="Coding Blocks | Dukaan | Generate Product Link"/>
                <Layout/>
                <CheckLogin>

                    <Backdrop className={classes.backdrop} open={this.state.loading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                        <h2 className={"title"}>Create Buy Link</h2>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-4 pull-left"}>
                            <ProductLinkForm {...this.state}
                                onOrganizationChange={this.onOrganizationChange}
                                onCenterChange={this.onCenterChange}
                                onAutoCompleteClose={this.onAutoCompleteClose}
                                onAutoCompleteOpen={this.onAutoCompleteOpen}
                                onUserSearchInputChange={this.onUserSearchInputChange}
                                onProductSearchInputChange={this.onProductSearchInputChange}
                                handleUserChange={this.handleUserChange}
                                handleProductChange={this.handleProductChange}
                                onApplyCreditsChange={this.onApplyCreditsChange}
                                ongenerateLink={this.ongenerateLink}
                            />
                        </div>

                        <div className={"col-md-8 pull-right mt-5"}>
                            { this.state.generateLinkClicked &&

                                <div className={"mr-5"}>
                                    <iframe
                                        src={this.state.activeCartIframeUrl}
                                        frameBorder="0"
                                        onLoad={this.hideSpinner}
                                        width="100%"
                                        height="400"
                                        allowtransparency='true'
                                        >
                                    </iframe>
                                </div>
                            }
                        </div>
                    </div>

                    { this.state.generateLinkClicked &&

                        <div className={"row mt-5 ml-5"}>

                            <div className={"col-md-8 pull-left"}>
                                    <iframe
                                        src={this.state.purchasedProductIframeurl}
                                        frameBorder="0"
                                        onLoad={this.hideSpinner}
                                        width="100%"
                                        height="350"
                                        allowtransparency='true'
                                        >
                                    </iframe>
                            </div>

                            <div className={"col-md-4 pull-right"}>
                            {!this.state.loading &&
                                <ProductLinkCard
                                    product={this.state.product}
                                    user={this.state.user}
                                    useCredits={this.state.useCredits}
                                    link={this.state.generatedLink}
                                    onSendEmailClick={this.onSendEmailClick}
                                    calculatedAmountDetails={this.state.calculatedAmountDetails}
                                />
                            }
                            </div>
                        </div>
                    }

                </CheckLogin>
            </div>
        )
    }
}

export default withStyles(useStyles)(GenerateLink)
