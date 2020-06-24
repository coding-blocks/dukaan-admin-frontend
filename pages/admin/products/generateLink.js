import React from 'react'
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import ProductLinkForm from "../../../forms/ProductLink";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/products'
import * as userController from '../../../controllers/users'
import ProductLinkCard from "../../../components/ProductLinkCard"
import ErrorHandler from "../../../helpers/ErrorHandler";
import Swal from 'sweetalert2';


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
            generateLinkClicked:false
        }
    }

    componentDidMount() {
        controller.fetchGenerateLinkData().then((organizations) => {
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
            product: value
        });
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

    handleUserChange = (event, value) => {
        this.setState({
            user: value,
        });
    }

    onApplyCreditsChange = (event) => {
        this.setState({
            useCredits: !JSON.parse(event.target.value)
        })
    }

    ongenerateLinkClick = () => {
        this.setState({
            generateLinkClicked: true
        })
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Generate Product Link"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>

                        <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                            <h2 className={"title"}>Create Buy Link</h2>
                        </div>
                        
                        <div className={"col-md-5 offset-1 pull-left"}>
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
                                ongenerateLinkClick={this.ongenerateLinkClick}
                            />
                        </div>

                        <div className={"col-md-6 pull-right"}>

                            { this.state.generateLinkClicked && this.state.product && this.state.user &&
                                <ProductLinkCard link={this.state.generatedLink}
                                    product={this.state.product}
                                    user={this.state.user}
                                    useCredits={this.state.useCredits}
                                />
                            }
                        </div>

                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default GenerateLink
