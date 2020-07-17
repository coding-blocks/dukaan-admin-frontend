import React from 'react'
import Head from '../../../components/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomCouponForm from "../../../forms/CustomCoupon";
import Layout from "../../../components/layout";
import ProductLinkForm from "../../../forms/ProductLink";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/products'
import * as userController from '../../../controllers/users'
import * as couponController from '../../../controllers/v2/couponsV2'
import ProductLinkCard from "../../../components/ProductLinkCard"
import ErrorHandler from "../../../helpers/ErrorHandler";
import Swal from 'sweetalert2';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

class GenerateLink extends React.Component {

    constructor(props) {
        super(props);
        this.buyLinkForm = React.createRef();
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
            coupons: []
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
            coupons: []
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
        
        if (!value) {
            this.setState({
                user: value,
                activeCartIframeUrl: '',
                purchasedProductIframeurl: '',
                loading: false,
                coupons: [],
            })
        } else {
            controller.getUserCartDetailsUrls({
                id: value.id
            }).then(([activeCartDetails, purchasedProductDetails]) => {
                this.setState({
                    user: value,
                    activeCartIframeUrl: activeCartDetails.data.iframeUrl,
                    purchasedProductIframeurl: purchasedProductDetails.data.iframeUrl,
                    loading: true,
                    coupons: [],
                })
            }).catch((error) => {
                ErrorHandler.handle(error)
            })
        }
        
        this.unsetGeneratedLink()
    }

    onApplyCreditsChange = (event) => {
        this.setState({
            useCredits: !JSON.parse(event.target.value)
        })
        this.unsetGeneratedLink()
    }

    handleCategoryChange = (category) => {
        
        if (!category) {
            this.setState({
                coupons: []
            })
            return
        }

        couponController.fetchCouponsApplicableForAUserAndProduct({
            user_id: this.state.user.id,
            product_id: this.state.product.id,
            category: category,
            organization_id: this.state.organizationId
        }).then((response) => {
            this.setState({
                coupons: response.data
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    ongenerateLink = (link) => {
        controller.getProductBuyLinkData({
            oneauthId: this.state.user.oneauth_id,
            productId: this.state.product.id,
            quantity: 1,
            useCredits: this.state.useCredits
        }).then((calculatedAmountDetails) => {
            this.setState({
                generatedLink: link,
                generateLinkClicked: true,
                calculatedAmountDetails: calculatedAmountDetails.data,
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

    handleLoading = () => {
        this.setState({
          loading: false
        });
    };

    

    onCustomCouponClick = async () => {

        await ReactSwal.fire({
            title: "Create Custom coupon",
            html: <CustomCouponForm handleAddCustomCoupon={this.handleAddCustomCoupon}/>,
            heightAuto:false,
            width: 500,
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: false
        })
    }

    onCustomCouponCreation = async (coupon) => {
        this.setState({
            coupon: coupon,
        })
        await this.buyLinkForm.current.handleCustomCouponCreation(coupon);
    }

    handleAddCustomCoupon = (data) => {
        couponController.handleAddCustomCoupon({
            user_id: this.state.user.id,
            product_id: this.state.product.id,
            organization_id: this.state.organizationId,
            percentage: data.percentage,
            expiration: data.expiration
        }).then((response) => {
            Swal.fire({
              title: "Success",
              text: `Coupon ${response.data.code} created successfully!`,    
              icon: "success",
            });
            this.onCustomCouponCreation(response.data)
        }).catch((error) => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error adding custom coupon!",
                text: error
            });
        })
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Generate Product Link"/>
                <Layout/>
                <CheckLogin>

                    <div className={"row"}>
                        <div className={"col-md-3 pull-left"}>
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
                                handleCategoryChange={this.handleCategoryChange}
                                onCustomCouponClick={this.onCustomCouponClick}
                                ref={this.buyLinkForm}
                            />
                        </div>

                            <div className={"col-md-9 pull-right mt-5"}>

                                {!this.state.loading && this.state.user &&
                                    
                                    <div className={"row mr-5"}>
                                        <TableContainer component={Paper}>
                                            <Typography className={"ml-5 mt-2"} variant="h5" id="tableTitle" component="div">
                                                <b> User Details </b>
                                            </Typography>

                                            <Table aria-label="simple table">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell align="center">Name</TableCell>
                                                    <TableCell align="center">Username</TableCell>
                                                    <TableCell align="center">Wallet Amount</TableCell>
                                                    <TableCell align="center">Oneauth Id</TableCell>
                                                    <TableCell align="center">Email</TableCell>
                                                    <TableCell align="center">Mobile Number</TableCell>
                                                    <TableCell align="center">Address</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow key={this.state.user.id}>
                                                      <TableCell component="th" scope="row" align="center">
                                                        {this.state.user.firstname} {this.state.user.lastname}
                                                      </TableCell>
                                                      <TableCell align="center">{this.state.user.username}</TableCell>
                                                      <TableCell align="center">{this.state.user.wallet_amount /100}</TableCell>
                                                      <TableCell align="center">{this.state.user.oneauth_id}</TableCell>
                                                      <TableCell align="center">{this.state.user.email}</TableCell>
                                                      <TableCell align="center">{this.state.user.mobile_number}</TableCell>
                                                      <TableCell align="center">{this.state.user.permanent_address}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                }

                                {this.state.user &&
                                    <div>
                                    <div className={"row mr-5 mt-4"}>
                                        <iframe
                                            src={this.state.activeCartIframeUrl}
                                            frameBorder="0"
                                            onLoad={this.handleLoading}
                                            width="100%"
                                            height="220"
                                            allowtransparency='true'
                                            >
                                        </iframe>
                                    </div>

                                    <div className={"row mr-5 mt-4"}>
                                        <iframe
                                            src={this.state.purchasedProductIframeurl}
                                            frameBorder="0"
                                            onLoad={this.handleLoading}
                                            width="100%"
                                            height="350"
                                            allowtransparency='true'
                                            >
                                        </iframe>
                                    </div>
                                    </div>
                                }

                                <div className={"row mr-5 mt-4 mb-3"}>

                                    {!this.state.loading && this.state.generateLinkClicked &&
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
                    </div>

                </CheckLogin>
            </div>
        )
    }
}

export default GenerateLink
