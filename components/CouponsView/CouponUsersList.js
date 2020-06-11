import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        overflowY: 'scroll',
        maxHeight: '50vh',
    },
});

const CouponUsersList = ({ couponUsersList }) => {

    const classes = useStyles();

    return (
        <div className={"d-flex align-items-center justify-content-center"}>
            <div className={"col-md-12 mt-1"}>
                { couponUsersList.length ?
                  <div>
                    <span className="red ml-2 mb-1">
                        <b>*List of users by whom the selected coupon has been applied along with the respective product.*</b>
                    </span>
                    <TableContainer className={classes.table} component={Paper}>
                       <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" className={"red"}>Name</TableCell>
                            <TableCell align="center" className={"red"}>Oneauth Id</TableCell>
                            <TableCell align="center" className={"red"}>Email</TableCell>
                            <TableCell align="center" className={"red"}>Product</TableCell>
                            <TableCell align="center" className={"red"}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {couponUsersList.map((couponUser) => (
                            <TableRow key={couponUser.id}>
                              <TableCell align="center">{couponUser.name}</TableCell>
                              <TableCell align="center">{couponUser.oneauth_id}</TableCell>
                              <TableCell align="center">{couponUser.email}</TableCell>
                              <TableCell align="center">{couponUser.product}</TableCell>
                              <TableCell align="center">{couponUser.paymentStatus}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  :
                  <div>
                    <span className="red ml-1 mb-1">
                        <b>*Coupon hasn't been applied by any user yet.*</b>
                    </span>
                  </div>
                }
            </div>
        </div>
    );
}


export default CouponUsersList;