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
     maxHeight: '30vh'
  },
});

const CouponProductsNotice = ({productList}) => {
    const classes = useStyles();
    return (
        <div className={"d-flex align-items-center justify-content-center"}>
            <div className={"col-md-12 mt-1"}>
                <span className="red pull-right ml-2 mb-1">
                    <b>*Listed products have Mrp less than entered discount. Proceeding will
                        make these products free for the generated coupon.*</b>
                </span>

                <TableContainer className={classes.table} component={Paper}>
                   <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" className={"red"}>Name</TableCell>
                        <TableCell align="center" className={"red"}>Mrp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productList.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell align="center">{product.name}</TableCell>
                          <TableCell align="center">{product.mrp / 100}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </div>
        </div>
    );
}


export default CouponProductsNotice;
