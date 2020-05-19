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
import * as controller from "../../controllers/v2/couponsV2";
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';


const PaginationTheme = withStyles({
  actions: {
      color: "red",
      backgroundColor: 'white',
  }
})(TablePagination);

class CouponsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
            totalCoupons: 0,
            rowsPerPage: 10,
            currentPage: 0,
            totalPages:0,
        }
    }

    resetPageInfo = () => {
        this.setState({
            rowsPerPage: 10,
            currentPage: 0,
            totalPages:0,
        })
    }

    fillTable = () => {
        controller.searchCoupons(this.props.filterParams, {
            rowsPerPage: this.state.rowsPerPage,
            currentPage: this.state.currentPage,
        }).then((response) => {
            this.setState({
                coupons: response.data.coupons,
                totalCoupons: response.data.totalCoupons,
                totalPages: response.data.pagesInfo.pageCount
            })
        }).catch((error) => {
          Swal.fire({
            type: 'error',
            title: 'Error while fetching coupons!',
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

    handleDeleteCoupon = (coupon) => {
        Swal.fire({
          title: "Are you sure you want to delete coupon – " + coupon.code + " ?",
          type: 'question',
          confirmButtonColor: '#f66',
          confirmButtonText: "Yes, delete!",
          cancelButtonText: "No, stop!",
          showCancelButton: true,
          showConfirmButton: true,
          showCloseButton: true
        }).then((result) => {
          if (result.value) {
            // Confirmation passed, delete coupon.
            controller.handleDeleteCoupon(coupon.id).then((response) => {
              // Remove the coupon from the table.
              let coupons = this.state.coupons;
              let couponIndex = this.state.coupons.indexOf(coupon);
              coupons.splice(couponIndex, 1);
              this.setState({
                coupons: coupons
              });
              // Show that the job is done
              Swal.fire({
                title: 'Coupon ' + coupon.code + ' Deleted!',
                type: "info",
                timer: '1500',
                showConfirmButton: true,
                confirmButtonText: "Okay"
              });
            }).catch((error) => {
              Swal.fire({
                title: "Error while deleting coupon!",
                html: "Error: " + error,
                type: "error",
                showConfirmButton: true
              });
            });
          }
        });
    }

    render() {
        if (!this.state.coupons) {
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
                            <h2 className={"title"}>Coupon Results</h2>
                         </Grid>
                        <Table className={{
                            table: {
                                minWidth: 650,
                            },
                        }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className={"red"}>CODE</TableCell>
                                    <TableCell align="center" className={"red"}>CATEGORY</TableCell>
                                    <TableCell align="center" className={"red"}>MODE</TableCell>
                                    <TableCell align="center" className={"red"}>DISCOUNT</TableCell>
                                    <TableCell align="center" className={"red"}>LEFT</TableCell>
                                    <TableCell align="center" className={"red"}>EDIT</TableCell>
                                    <TableCell align="center" className={"red"}>DELETE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell align="center">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell align="center">{coupon.category}</TableCell>
                                        <TableCell align="center">{coupon.mode}</TableCell>
                                        <TableCell align="center">{
                                            coupon.mode === 'flat' ? coupon.amount : `${coupon.percentage}%`
                                        }</TableCell>
                                        <TableCell align="center">{coupon.left}</TableCell>
                                        <TableCell align="center">

                                        <Button size="small" variant="outlined" 
                                                style={{background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" , color: 'white', border: 0,
                                                borderRadius: 3, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}} onClick={() => Router.push({
                                                    pathname: '/admin/coupons2/edit',
                                                    query: coupon,
                                                  }, `/admin/coupons2/edit/${coupon.id}`)
                                                }>
                                                Edit
                                        </Button>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Button size="small" variant="outlined" 
                                                style={{background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" , color: 'white', border: 0,
                                                borderRadius: 3, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}} onClick={() => { this.handleDeleteCoupon(coupon) }}>
                                                Delete
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PaginationTheme
                        rowsPerPageOptions={[5,10]}
                        component="div"
                        count={this.state.totalCoupons}
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


export default CouponsTable
