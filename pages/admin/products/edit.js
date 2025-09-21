import React from 'react';
import { useRouter } from 'next/router';
import EditProduct from '../../../components/EditProduct';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import CheckLogin from "../../../components/CheckLogin";

const EditProductPage = () => {
    const router = useRouter();
    const { productId } = router.query;

    if (!productId) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Head title="Coding Blocks | Dukaan | Edit Product" />
            <Layout />
            <CheckLogin>
                <EditProduct productId={productId} />
            </CheckLogin>
        </div>
    );
};

export default EditProductPage;