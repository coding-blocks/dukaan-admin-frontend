import { useState } from 'react';
import Head from '../../components/head';
import Layout from '../../components/layout';
import { fetchInvoices, markReconciled, unmarkReconciled } from '../../controllers/v2/invoices'
import moment from 'moment';
import { useEffect } from 'react';
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
import {Modal, Box, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const PaginationTheme = withStyles({
  actions: {
      color: "red",
      backgroundColor: 'white',
  }
})(TablePagination);

export default function Reconcile() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comment, setComment] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(25)
  const [invoices, setInvoices] = useState([])
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([])
  const [paginationMeta, setPaginationMeta] = useState({currentPage: 0, count: 0})

  useEffect(() => {
    async function fetchData() {
      const response = await fetchInvoices({ offset, limit })
      setInvoices(response.data.data)
      setPaginationMeta({ currentPage: response.data.pagesInfo.currentPage, count: response.data.pagesInfo.count})
    }
    fetchData()
  },[])

  function handleChangePage(event, newPage) {
    setOffset(newPage * limit)
  }

  function handleLimitChange(event) {
    setLimit(parseInt(event.target.value, 10))
  }

  function handleModalClose(e) {
    console.log(e)
  }

  function handleSelectRow(selected, invoice_id) {
    if(selected) {
      setSelectedInvoiceIds([...selectedInvoiceIds, invoice_id])
    } else { 
      const selectedIds = [...selectedInvoiceIds]
      const index = selectedInvoiceIds.indexOf(invoice_id)
      selectedIds.splice(index, 1)
      setSelectedInvoiceIds(selectedIds)
    }
  }

  async function handleMarkReconciled() {
    try {
      await markReconciled({ invoiceIds: selectedInvoiceIds, comment })
      setShowModal(false)
      Swal.fire({
        title: "Invoices reconciled successfully!",
        type: "success",
        showConfirmButton: true
      })

      const response = await fetchInvoices({ offset, limit })
      setInvoices(response.data.data)
      setPaginationMeta({ currentPage: response.data.pagesInfo.currentPage, count: response.data.pagesInfo.count})

    } catch(err) {
      Swal.fire({
        title: "Invoices Reconcilation Failed!",
        type: "error",
        showConfirmButton: true
      })
    }
  }

  async function handleUnmarkReconciled() {
    try {
      await unmarkReconciled({ invoiceIds: selectedInvoiceIds })
      Swal.fire({
        title: "Invoices reconciled successfully!",
        type: "success",
        showConfirmButton: true
      })

      const response = await fetchInvoices({ offset, limit })
      setInvoices(response.data.data)
      setPaginationMeta({ currentPage: response.data.pagesInfo.currentPage, count: response.data.pagesInfo.count})
    } catch(err) {
      Swal.fire({
        title: "Invoices Un-Reconcilation Failed!",
        type: "error",
        showConfirmButton: true
      })
    }
  }

  async function handleDownloadCsv() {
    try {
      const response = await fetchInvoices({ startDate, endDate })
      const invoices = response.data.data
      const data = [['Name','Email','Product','List Price','Final Price', 'Discount', 'CGST','IGST','SGST','Tax','Final Amount','RazorPay Order Id','RazorPay Payment Id','Status', 'Date of Sale', 'Invoice Link','Reconciled By']]
  
      invoices.map(invoice => {
        const row = []
        row.push(invoice.cart.buyer.firstname + ' ' + invoice.cart.buyer.lastname)
        row.push(invoice.cart.buyer.email)
        row.push(invoice.product.name)
        row.push(invoice.list_price / 100)
        row.push(invoice.final_price / 100)
        row.push(invoice.discount_availed / 100)
        row.push(invoice.cgst / 100)
        row.push(invoice.igst / 100)
        row.push(invoice.sgst / 100)
        row.push(invoice.cart.total_tax_collected / 100)
        row.push(invoice.amount / 100)
        row.push(invoice.transaction?.razorpay?.order_id || invoice.transaction?.razorpay_order_id || 'N/A')
        row.push(invoice.transaction?.razorpay?.payment_id || invoice.transaction?.razorpay_payment_id || 'N/A')
        row.push(invoice.transaction?.status)
        row.push(invoice.transaction?.date_of_sale)
        row.push(invoice.invoice_link || 'N/A')
        row.push(invoice.reconciledBy ? `${invoice.reconciledBy.firstname} ${invoice.reconciledBy.lastname}(${invoice.reconciledBy.oneauth_id}`: 'N/A' )
        data.push(row)
      })
      let workbook = XLSX.utils.book_new();
      let worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet);
      XLSX.writeFile(workbook, `invoices-${startDate}-to-${endDate}.csv`);
    } catch(err) {
      Swal.fire({
        title: "Some Error occured!",
        type: "error",
        showConfirmButton: true
      })
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetchInvoices({ offset, limit })
      setInvoices(response.data.data)
      setPaginationMeta({ currentPage: response.data.pagesInfo.currentPage, count: response.data.pagesInfo.count})
    }
    fetchData()
  }, [limit, offset])

  return (
    <div>
      <Head title="Coding Blocks | Dukaan | Coupon"/>
      <Layout/>
      <div className="my-4">
        <h3 className="t-align-c">Reconciler</h3>

        <div className="my-3 px-5">
          <span className="bold font-md">Select Date Range</span>
          <div>
            <label for="start-date">Start Date:</label>
            <input type="date" id="start-date" name="start0date" onChange={(e) => setStartDate(e.target.value)}></input>
          </div>
          <div>
            <label for="end-date">End Date:</label>
            <input type="date" id="end-date" name="end-date" onChange={(e) => setEndDate(e.target.value)}></input>
          </div>
        </div>
        

        <div className=" d-flex justify-content-center">
          <Grid xs={11} className={"mt-4 mr-5"}>
            <Paper>
              <TableContainer>
                <Grid container justify="center" className={"mb-1"}>
                  <div className="d-flex justify-content-between w-100 p-4">
                    <h2 className={"title"}>Invoices</h2>
                    <li className="dropdown mt-1 float-right">
                        <button className="dropbtn dropdown-toggle">
                          <span className="font-md">Actions</span>
                          <i className="fa fa-caret-down pl-2" />
                        </button>
                        <div className="dropdown-content">
                          <div className="flex-row justify-content-center">
                            <button className="p-2" disabled={!!!selectedInvoiceIds.length} onClick={() => setShowModal(true)}>Mark Reconciled</button>
                          </div>
                          <div className="divider-h" />
                          <div className="flex-row justify-content-center">
                            <button className="p-2" disabled={!!!selectedInvoiceIds.length} onClick={() => handleUnmarkReconciled()}>Mark Un-Reconcile</button>
                          </div>
                          <div className="divider-h" />
                          <div className="flex-row justify-content-center">
                            <button className="p-2" disabled={!!!startDate || !!!endDate} onClick={() => handleDownloadCsv()}>Download Csv</button>
                          </div>
                        </div>
                      </li>
                  </div>
                </Grid>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className={"red"}>Select</TableCell>
                      <TableCell align="center" className={"red"}>Name</TableCell>
                      <TableCell align="center" className={"red"}>Email</TableCell>
                      <TableCell align="center" className={"red"}>Product</TableCell>
                      <TableCell align="center" className={"red"}>List Price</TableCell>
                      <TableCell align="center" className={"red"}>Final Price</TableCell>
                      <TableCell align="center" className={"red"}>Discount</TableCell>
                      <TableCell align="center" className={"red"}>CGST</TableCell>
                      <TableCell align="center" className={"red"}>IGST</TableCell>
                      <TableCell align="center" className={"red"}>SGST</TableCell>
                      <TableCell align="center" className={"red"}>Tax</TableCell>
                      <TableCell align="center" className={"red"}>Final Amount</TableCell>
                      <TableCell align="center" className={"red"}>RazorPay Order Id</TableCell>
                      <TableCell align="center" className={"red"}>RazorPay Payment Id</TableCell>
                      <TableCell align="center" className={"red"}>Status</TableCell>
                      <TableCell align="center" className={"red"}>Invoice Link</TableCell>
                      <TableCell align="center" className={"red"}>Reconciled By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map(invoice => (
                      <TableRow key={invoice.id} 
                        className={invoice.reconciled_by ? 'bg-green' : selectedInvoiceIds.includes(invoice.id) ? 'bg-blue' : ''}>
                        <TableCell>
                          <input type="checkbox" onChange={(e) => handleSelectRow(e.target.checked, invoice.id)} />
                        </TableCell>
                        <TableCell>{invoice.cart.buyer.firstname} {invoice.cart.buyer.lastname}</TableCell>
                        <TableCell>{invoice.cart.buyer.email}</TableCell>
                        <TableCell>{invoice.product.name}</TableCell>
                        <TableCell>{invoice.list_price / 100}</TableCell>
                        <TableCell>{invoice.final_price / 100}</TableCell>
                        <TableCell>{invoice.discount_availed / 100}</TableCell>
                        <TableCell>{invoice.cgst / 100}</TableCell>
                        <TableCell>{invoice.igst / 100}</TableCell>
                        <TableCell>{invoice.sgst / 100}</TableCell>
                        <TableCell>{invoice.cart.total_tax_collected / 100}</TableCell>
                        <TableCell>{invoice.amount / 100}</TableCell>
                        <TableCell>{invoice.transaction?.razorpay?.order_id || invoice.transaction?.razorpay_order_id}</TableCell>
                        <TableCell>{invoice.transaction?.razorpay?.payment_id || invoice.transaction?.razorpay_payment_id}</TableCell>
                        <TableCell><span className={
                          invoice.transaction.status === 'captured' ? 'green' : invoice.transaction.status === 'cancelled' ? 'red': 'yellow'
                        }>{invoice.transaction?.status}</span></TableCell>
                        <TableCell><a href={invoice.invoice_link} target="_blank">{invoice.invoice_link ? 'Link' : 'N/A'}</a></TableCell>
                        <TableCell>{invoice.reconciledBy ? `${invoice.reconciledBy.firstname} ${invoice.reconciledBy.lastname}(${invoice.reconciledBy.oneauth_id}`: 'N/A' }</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaginationTheme
                        component="div"
                        count={paginationMeta.count}
                        rowsPerPage={limit}
                        page={paginationMeta.currentPage}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleLimitChange}
                    />
            </Paper>
          </Grid>
        </div>
      </div>
      {/* <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a comment
          </Typography>
            <textarea name="" id="" cols="30" rows="10" onChange={(e) => setComment(e.target.value)}>

            </textarea>
            <Button>Mark as Reconciled</Button>
          </Box>
      </Modal> */}
      <Dialog
            title="Dialog"
            modal={true}
            maxWidth={"xl"}
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <DialogContent>
              <h4>Add Comment</h4>
              <textarea placeholder="Comments..." name="" id="" cols="30" rows="10" onChange={(e) => setComment(e.target.value)}></textarea>
              <Button variant="outlined" disabled={!!!comment} onClick={() => handleMarkReconciled()}>Mark as Reconciled</Button>
            </DialogContent>
      </Dialog>
    </div>
  )
}