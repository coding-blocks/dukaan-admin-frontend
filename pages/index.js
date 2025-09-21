import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";
import AddUser from "../components/AddUser";
import CheckLogin from "../components/CheckLogin";
import userController from "../controllers/users";
import ErrorBoundary from "../components/ErrorBoundary";
import AsyncSelect from "react-select/async";
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
                            {/* Search User */}
                            <div className="container mt-4">
                                <div className="row">
                                    <div className="col-md-12 col-12">
                                        <div>
                                            <form
                                                id={"email-search-form"}
                                                className={"row align-items-center"}>
                                                <div className={"col-md-3 col-6"}>
                                                    <select id={"search-field-option"} required={true}
                                                            defaultValue={this.state.searchOption}
                                                            onChange={this.handleSearchOptionChange}>
                                                        <option value={"email"}>Search by email</option>
                                                        <option value={"phone"}>Search by phone</option>
                                                    </select>

                                                </div>
                                                <div className="col-md-7 col-6">
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        placeholder={this.state.searchPlaceholder}
                                                        loadOptions={this.loadOptions}
                                                        onChange={this.handleInputChange}/>
                                                </div>


                                                <Link href={`/admin/orders?id=${this.state.id}`}>
                                                    <button
                                                        id="search"
                                                        className="button-solid mb-1"
                                                        style={{fontSize: "1.3rem"}}>
                                                        Search
                                                    </button>
                                                </Link>
                                            </form>
                                        </div>
                                    </div>
                                    <AddUser/>
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
