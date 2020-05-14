import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as controller from "../../controllers/v2/couponsV2";
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";


class CouponsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
            rowsPerPage: 5,
            currentPage: 0,
            filterParams: props.filterParams
        }

    }

    fillTable = () => {
        controller.searchCoupons(undefined, {
            rowsPerPage: this.state.rowsPerPage,
            currentPage: this.state.currentPage,
        }).then((response) => {
            this.setState({
                coupons: response.data.coupons,
                totalPages: response.data.pagesInfo.pageCount
            })
        })
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
        if (!this.state.coupons) {
            return (
                <CircularProgress/>
            )
        }
        return (
            <div>
                <Paper className={{
                    width: '100%',
                }}>
                    <TableContainer>
                        <Table className={{
                            table: {
                                minWidth: 650,
                            },
                        }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Code</TableCell>
                                    <TableCell align="right">Category</TableCell>
                                    <TableCell align="right">Mode</TableCell>
                                    <TableCell align="right">Discount</TableCell>
                                    <TableCell align="right">Left</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell component="th" scope="row">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell align="right">{coupon.category}</TableCell>
                                        <TableCell align="right">{coupon.mode}</TableCell>
                                        <TableCell align="right">{
                                            coupon.mode === 'flat' ? coupon.amount : `${coupon.percentage}%`
                                        }</TableCell>
                                        <TableCell align="right">{coupon.left}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={-1}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.currentPage}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>

            </div>
        );
    }

}


export default CouponsTable
