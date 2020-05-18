import React from 'react'
import ProductsChooserV2 from "../components/ProductsChooser/ProductsChooserV2";
import Head from "../components/head";
import Layout from "../components/layout";


class Test extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks"/>
                <Layout/>
                <div className={"col-md-12"}>
                    <ProductsChooserV2 productTypeId={2} organizationId={1}/>
                </div>
            </div>

        );
    }
}

export default Test
