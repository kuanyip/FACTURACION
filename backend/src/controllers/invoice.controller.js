const asyncHandler = require('../utils/asyncHandler');
const invoiceService = require('../services/invoice.service');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const invoices = await invoiceService.findAll();
    res.json({ data: invoices });
  }),

  create: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const invoice = await invoiceService.createInvoice(body);
    res.status(201).json({ data: invoice });
  }),

  update: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const invoice = await invoiceService.updateInvoice(params.id, body);
    res.json({ data: invoice });
  }),

  remove: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await invoiceService.deleteInvoice(params.id);
    res.status(204).send();
  })
};
