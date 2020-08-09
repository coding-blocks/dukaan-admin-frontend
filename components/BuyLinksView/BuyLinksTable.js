import React from 'react';
import Router from 'next/router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Grid from "@material-ui/core/Grid";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from "@material-ui/core/Chip";
import * as controller from "../../controllers/buyLink";
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import Link from "next/link";
import withReactContent from 'sweetalert2-react-content';

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

const ReactSwal = withReactContent(Swal);

class BuyLinksTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buyLinks: [],
            totalBuyLinks: 0,
            rowsPerPage: 10,
            currentPage: 0,
            totalPages: 0,
        }
    }

    resetPageInfo = () => {
        this.setState({
            rowsPerPage: 10,
            currentPage: 0,
            totalPages: 0,
        })
    }

    fillTable = () => {
        controller.searchBuyLinks(this.props.filterParams, {
            rowsPerPage: this.state.rowsPerPage,
            currentPage: this.state.currentPage,
        }).then((response) => {
            this.setState({
                buyLinks: response.data.buyLinks,
                totalBuyLinks: response.data.totalBuyLinks,
                totalPages: response.data.pagesInfo.pageCount
            })
        }).catch((error) => {
            Swal.fire({
                type: 'error',
                title: 'Error while fetching buy links!',
                text: error
            });
            this.setState({
                loading: false
            });
        });
    }

    componentDidMount() {
        this.fillTable()
    }


    handleChangePage = (event, newPage) => {
        this.setState({
            currentPage: newPage
        }, () => {
            this.fillTable()
        })

    }

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            currentPage: 0
        }, () => {
            this.fillTable()
        })
    }

    render() {
    	const { classes } = this.props;

        if (!this.state.buyLinks) {
            return (
                <CircularProgress/>
            )
        }
        return (
            <div>
             <Grid xs={11} className={"mt-5 mr-5"}>
                <Paper>
                    <TableContainer>
                        <Grid container justify="center" className={"mb-1"}>
                            <h2 className={"title"}> Buy Links</h2>
                         </Grid>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className={"red"}>USER</TableCell>
                                    <TableCell align="center" className={"red"}>PRODUCT</TableCell>
                                    <TableCell align="center" className={"red"}>URL</TableCell>
                                    <TableCell align="center" className={"red"}>STATUS</TableCell>
                                    <TableCell align="center" className={"red"}>COUPON</TableCell>
                                    <TableCell align="center" className={"red"}>STATE</TableCell>
                                    <TableCell align="center" className={"red"}>CREDITS</TableCell>
                                    <TableCell align="center" className={"red"}>CREATED BY</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.buyLinks.map((buyLink) => (
                                    <TableRow key={buyLink.id} 
                                    style={{borderTop: '1px solid lightgrey'}}>
                                        <TableCell align="center">
                                           {buyLink.user.firstname} {buyLink.user.lastname}
                                        </TableCell>
                                        <TableCell align="center">
                                           {buyLink.product.description}
                                        </TableCell>
                                        <TableCell align="center">
                                           {buyLink.short_url}
                                        </TableCell>
                                        <TableCell align="center">
                                           {buyLink.active === true ? 'Active' : 'Inactive'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {buyLink.coupon ? buyLink.coupon.code : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {buyLink.state ? buyLink.state.name : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {buyLink.use_credits ? 'Applicable' : 'Not Applicable'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {buyLink.buyLink_creator.firstname} {buyLink.buyLink_creator.lastname} 
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PaginationTheme
                        rowsPerPageOptions={[5,10]}
                        component="div"
                        count={this.state.totalBuyLinks}
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

export default withStyles(useStyles)(BuyLinksTable)
