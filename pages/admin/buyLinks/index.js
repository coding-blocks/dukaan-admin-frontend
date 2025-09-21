import React from 'react'
import Router, {withRouter} from 'next/router';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import CheckLogin from "../../../components/CheckLogin";
import BuyLinkFilterForm from "../../../components/BuyLinksView/BuyLinkFilterForm";
import BuyLinksTable from "../../../components/BuyLinksView/BuyLinksTable";
import Pagination from "../../../components/Pagination";

class BuyLinks extends React.Component {

    constructor() {
        super();
        this.buyLinksTable = React.createRef();
        this.state = {
            filterParams: {
                active:true,
                use_credits:false
            }
        }
    }


    onSearchBtnClick = (filterParams) => {
        this.setState({
            filterParams
        }, async () => {
            await this.buyLinksTable.current.resetPageInfo();
            this.buyLinksTable.current.fillTable();
        });
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | BuyLinks"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>
                            <div className={"col-md-3 pull-left"}>
                                <BuyLinkFilterForm
                                    onSearchBtnClick={this.onSearchBtnClick}
                                />
                            </div>

                            <div className={"col-md-9 pull-right"}>
                                <BuyLinksTable
                                    filterParams={this.state.filterParams}
                                    ref={this.buyLinksTable}/>
                            </div>

                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(BuyLinks)
