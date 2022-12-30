import {axios} from "../../DukaanAPI";
import ErrorHandler from '../../helpers/ErrorHandler';

export const fetchInvoices = (options) => {
  return axios.get('/api/v2/admin/invoices', {params: options})
  .catch(err => {
    ErrorHandler.handle(err)
  })
}

export const markReconciled = (data) => {
  return axios.post('/api/v2/admin/invoices/mark-reconciled', data)
}

export const unmarkReconciled = (data) => {
  return axios.post('/api/v2/admin/invoices/unmark-reconciled', data)
}