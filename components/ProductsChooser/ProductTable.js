import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Grid from "@material-ui/core/Grid";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import Link from "next/link";
import * as controller from "../../controllers/products";
import Formatter from '../../helpers/formatter';

const PaginationTheme = withStyles({
    actions: {
        color: "red",
        backgroundColor: 'white',
    }
})(TablePagination);

const useStyles = theme => ({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
});

class ProductsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalProducts: 0,
            rowsPerPage: 10,
            currentPage: 0,
            totalPages: 0,
            loading: false
        }
    }

fillTable = () => {
    this.setState({ loading: true });
    
    const pageInfo = {
        page: this.state.currentPage + 1,
        limit: this.state.rowsPerPage
    };

    controller.handleGetProducts(this.props.filterParams, pageInfo)
        .then((response) => {
            const products = response.results || response.data?.products || [];
            const totalProducts = response.pagesInfo?.totalCount || 
                                 response.data?.pagesInfo?.totalCount || 
                                 products.length;
            const totalPages = response.pagesInfo?.pageCount || 
                              response.data?.pagesInfo?.pageCount || 
                              1;

            this.setState({
                products,
                totalProducts,
                totalPages,
                loading: false
            });
        })
        .catch((error) => {
            console.error('API Error:', error);
            Swal.fire({
                type: 'error',
                title: 'Error while fetching products!',
                text: error.message || error
            });
            this.setState({ loading: false });
        });
}

    componentDidMount() {
        this.fillTable();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filterParams !== this.props.filterParams) {
            this.setState({ currentPage: 0 }, this.fillTable);
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            currentPage: newPage
        }, this.fillTable);
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            currentPage: 0
        }, this.fillTable);
    }

    handleDeleteProduct = (product) => {
        Swal.fire({
            title: `Are you sure you want to delete product – ${product.name}?`,
            type: 'question',
            confirmButtonColor: '#f66',
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, stop!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                controller.handleDeleteProduct(product.id)
                    .then((response) => {
                        let products = this.state.products;
                        let productIndex = this.state.products.findIndex(p => p.id === product.id);
                        if (productIndex !== -1) {
                            products.splice(productIndex, 1);
                            this.setState({ products });
                        }
                        
                        Swal.fire({
                            title: `Product ${product.name} Deleted!`,
                            type: "success",
                            timer: '1500',
                            showConfirmButton: true,
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "Error while deleting product!",
                            text: error.message || error,
                            type: "error",
                        });
                    });
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid xs={11} className={"mt-5 mr-5"}>
                    <Paper>
                        <TableContainer>
                            <Grid container justify="center" className={"mb-1"}>
                                <h2 className={"title"}>Product Results</h2>
                            </Grid>
                            <Table aria-label="products table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" className={"red"}>IMAGE</TableCell>
                                        <TableCell align="center" className={"red"}>NAME</TableCell>
                                        <TableCell align="center" className={"red"}>DESCRIPTION</TableCell>
                                        <TableCell align="center" className={"red"}>MRP</TableCell>
                                        <TableCell align="center" className={"red"}>LIST PRICE</TableCell>
                                        <TableCell align="center" className={"red"}>CATEGORY</TableCell>
                                        <TableCell align="center" className={"red"}>TYPE</TableCell>
                                        <TableCell align="center" className={"red"}>LISTED</TableCell>
                                        <TableCell align="center" className={"red"}>STATUS</TableCell>
                                        <TableCell align="center" className={"red"}>EDIT</TableCell>
                                        <TableCell align="center" className={"red"}>DELETE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.products.map((product) => (
                                        <TableRow key={product.id} style={{borderTop: '1px solid lightgrey'}}>
                                            <TableCell align="center">
                                                <img src={product.image_url} width="50" height="50" style={{objectFit: 'cover'}} alt={product.name} />
                                            </TableCell>
                                            <TableCell align="center">{product.name}</TableCell>
                                            <TableCell align="center">{product.description}</TableCell>
                                            <TableCell align="center">{Formatter.formatCurrency(product.mrp)}</TableCell>
                                            <TableCell align="center">{Formatter.formatCurrency(product.list_price)}</TableCell>
                                            <TableCell align="center">{product.product_category?.name || 'N/A'}</TableCell>
                                            <TableCell align="center">{product.type || 'N/A'}</TableCell>
                                            <TableCell align="center">{product.listed ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="center">
                                                {product.listed ? 'Active' : 'Inactive'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link href={`/admin/products`}>
                                                    <Button size="small" variant="outlined" className={classes.root} onClick={() => {
                                                        this.props.onEditProduct(product);
                                                    }}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button size="small" variant="outlined" 
                                                    className={classes.root}
                                                    onClick={() => { this.handleDeleteProduct(product) }}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <PaginationTheme
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.state.totalProducts}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.currentPage}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(ProductsTable);