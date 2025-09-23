import React from "react";
import Head from "../components/head";
import Layout from "../components/layout";
import CheckLogin from "../components/CheckLogin";
import userController from "../controllers/users";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorHandler from "../helpers/ErrorHandler";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            searchOption: "email",
            searchPlaceholder: "Start typing email to get suggestions",
        };
    }

    componentDidMount() {

    }

    /**
     * Creates the object that is used by react-select
     * to display options.
     * @param {object} response - Object to generate options for
     * @return {object}
     */
    mapResponseToResults = (response) => {
        return response.map(user => ({
            value: user.email,
            label: `Email: ${user.email} Phone: ${user.mobile_number} - Username: ${user.username} - OneauthId: ${user.oneauth_id}`,
            user_id: `${user.id}`
        }));
    };

    /**
     * Used for fetching suggestions. Called by AsyncSelect
     * everytime the input field changes to load suggestions.
     * @param {string} inputValue - Value of the search box
     *  (in this case it is the email field)
     * @param {function} callback - Callback function with options
     *  that will be populated in the suggestions
     */
    loadOptions = (inputValue, callback) => {
        if (inputValue) {
            userController.handleGetUserByEmailOrPhone(this.state.searchOption, inputValue).then((response) => {
                callback(this.mapResponseToResults(response.data));
            }).catch((error) => {
                ErrorHandler.handle(error)
                callback([]);
            })
        }
    };


    /**
     * Handles the value that is of the selected option.
     * Not to be confused with the handleEmailTextboxChange
     * method below.
     * @param {object} selectedOption - The selected option
     */
    handleInputChange = selectedOption => {
        this.setState({
            id: selectedOption.user_id
        });
    };

    handleSearchOptionChange = (event) => {
        if(event.target.value === 'email'){
            this.setState({
                searchOption: "email",
                searchPlaceholder: "Start typing email to get suggestions",
            });
        }else if(event.target.value === 'phone'){
            this.setState({
                searchOption: "phone",
                searchPlaceholder: "Start typing phone number to get suggestions",
            });
        }

    };

    /**
     * Handles the search when the email search form is submitted.
     * @param {SyntheticEvent} e – Form submission event
     */


    render() {
        return (

            <ErrorBoundary>
                <CheckLogin>
                    <div>
                        <Head title="Coding Blocks | Dukaan"/>
                        <Layout>
                            <div style={{
                                minHeight: '90vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h1 className="title" style={{
                                        fontSize: '3rem',
                                        fontWeight: '100',
                                        color: '#333',
                                    }}>
                                        VMC Products and Coupons Portal
                                    </h1>
                                </div>
                            </div>
                        </Layout>
                    </div>
                </CheckLogin>
            </ErrorBoundary>
        );
    }
}

export default Home;
